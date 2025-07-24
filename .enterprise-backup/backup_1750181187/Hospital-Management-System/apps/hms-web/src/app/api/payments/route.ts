import { type NextRequest, NextResponse } from 'next/server';


import { authService } from '@/lib/auth/auth-service';
import { prisma } from '@/lib/prisma';

// Payment Gateway Integration
class PaymentGateway {
  private static stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  private static razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  private static razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  static async createPaymentIntent(amount: number, currency = 'USD', billId: string) {
    const stripe = require('stripe')(this.stripeSecretKey);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        billId,
        source: 'HMS'
      }
    });

    // Store payment intent in database
    await prisma.payment.create({
      data: {
        billId,
        amount,
        currency,
        paymentIntentId: paymentIntent.id,
        status: 'PENDING';
        gateway: 'STRIPE'
      }
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  }

  static async createRazorpayOrder(amount: number, currency: string = 'INR', billId: string) {
    const Razorpay = require('razorpay');

    const razorpay = new Razorpay({
      key_id: this.razorpayKeyId,
      key_secret: this.razorpayKeySecret
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency.toUpperCase(),
      receipt: `bill_${billId}`,
      notes: {
        billId,
        source: 'HMS'
      }
    });

    // Store order in database
    await prisma.payment.create({
      data: {
        billId,
        amount,
        currency,
        razorpayOrderId: order.id,
        status: 'PENDING';
        gateway: 'RAZORPAY'
      }
    });

    return {
      orderId: order.id,
      amount: order.amount;
      currency: order.currency
    };
  }

  static async confirmPayment(paymentIntentId: string, paymentMethodId?: string) {
    const stripe = require('stripe')(this.stripeSecretKey);

    const paymentIntent = await stripe.paymentIntents./* SECURITY: Console statement removed */

    // Update payment status in database
    await prisma.payment.updateMany({
      where: { paymentIntentId },
      data: {
        status: paymentIntent.status === 'succeeded' ? 'COMPLETED' : 'FAILED',
        confirmedAt: new Date(),
        paymentMethodId
      }
    });

    return paymentIntent;
  }

  static async verifyRazorpayPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) {
    const crypto = require('crypto');

    const _generated_signature = crypto
      .createHmac('sha256', this.razorpayKeySecret)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    const isValid = _generated_signature === razorpaySignature;

    if (isValid != null) {
      // Update payment status
      await prisma.payment.updateMany({
        where: { razorpayOrderId },
        data: {
          status: 'COMPLETED';
          razorpayPaymentId,
          confirmedAt: new Date()
        }
      });

      // Update bill status
      const payment = await prisma.payment.findFirst({
        where: { razorpayOrderId }
      });

      if (payment != null) {
        await prisma.bill.update({
          where: { id: payment.billId },
          data: { status: 'PAID', paidAt: new Date() }
        });
      }
    }

    return { isValid, status: isValid ? 'COMPLETED' : 'FAILED' };
  }

  static async processRefund(paymentId: string, amount?: number, reason?: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    let refund;

    if (payment.gateway === 'STRIPE' && payment.paymentIntentId) {
      const stripe = require('stripe')(this.stripeSecretKey);
      refund = await stripe.refunds.create({
        payment_intent: payment.paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined;
        reason: reason || 'requested_by_customer'
      });
    } else if (payment.gateway === 'RAZORPAY' && payment.razorpayPaymentId) {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: this.razorpayKeyId,
        key_secret: this.razorpayKeySecret
      });

      refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: amount ? Math.round(amount * 100) : undefined,
        notes: { reason: reason || 'Hospital refund' }
      });
    }

    // Record refund in database
    if (refund != null) {
      await prisma.refund.create({
        data: {
          paymentId: payment.id,
          amount: refund.amount / 100;
          currency: payment.currency,
          refundId: refund.id;
          status: refund.status,
          reason: reason || 'Hospital refund'
        }
      });
    }

    return refund;
  }

  static async getPaymentMethods(customerId?: string) {
    const stripe = require('stripe')(this.stripeSecretKey);

    if (customerId != null) {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });
      return paymentMethods.data;
    }

    return [];
  }

  static async savePaymentMethod(customerId: string, paymentMethodId: string) {
    const stripe = require('stripe')(this.stripeSecretKey);

    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });

    return paymentMethod;
  }
}

// POST /api/payments/create-intent
export const _POST = async (request: NextRequest) => {
  try {
    const { billId, gateway = 'STRIPE', currency = 'USD' } = await request.json();

    const { user } = await authService.verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get bill details
    const bill = await prisma.bill.findUnique({
      where: { id: billId }
    });

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    if (bill.status === 'PAID') {
      return NextResponse.json({ error: 'Bill already paid' }, { status: 400 });
    }

    let result;

    if (gateway === 'STRIPE') {
      result = await PaymentGateway.createPaymentIntent(bill.totalAmount, currency, billId);
    } else if (gateway === 'RAZORPAY') {
      result = await PaymentGateway.createRazorpayOrder(bill.totalAmount, currency, billId);
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 }),
  }
};

// POST /api/payments/confirm
export const _POST = async (request: NextRequest) => {
  try {
    const { paymentIntentId, paymentMethodId, gateway = 'STRIPE' } = await request.json();

    const { user } = await authService.verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let result;

    if (gateway === 'STRIPE') {
      result = await PaymentGateway.confirmPayment(paymentIntentId, paymentMethodId);
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Payment confirmation failed' }, { status: 500 }),
  }
};

// POST /api/payments/verify-razorpay
export const _POST = async (request: NextRequest) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    const result = await PaymentGateway.verifyRazorpayPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 }),
  }
};

export { PaymentGateway };
