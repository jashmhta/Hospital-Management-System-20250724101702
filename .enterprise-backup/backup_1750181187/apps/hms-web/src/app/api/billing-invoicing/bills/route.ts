import type { NextRequest } from 'next/server';


import { AuditService } from '@/lib/audit/audit-service';
import { prisma } from '@/lib/prisma';
import { ApiResponseBuilder, PaginationBuilder } from '@/utils/api-response';
// apps/hms-web/src/app/api/billing-invoicing/bills/route.ts
export async function POST(request: NextRequest): unknown {
  try {
    const body = await request.json()
    const { patientId, items, discountAmount = 0, notes } = body,

    // Calculate total
    const subtotal = items.reduce((sum: number, item: unknown) =>
      sum + (item.quantity * item.unitPrice), 0)
    const totalAmount = subtotal - discountAmount,

    // Generate bill number
    const lastBill = await prisma.bill.findFirst({
orderBy: { createdAt: 'desc' },
      select: { billNumber: true }
    })

    const nextBillNumber = lastBill ?
      Number.parseInt(lastBill.billNumber.substring(4)) + 1 : 1001;
    const billNumber = `BILL${nextBillNumber.toString().padStart(6, '0')}`;

    const bill = await prisma.bill.create({
      data: {
        billNumber,
        patientId,
        subtotal,
        discountAmount,
        totalAmount,
        status: 'PENDING',
        items,
        notes
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            mrn: true
          }
        }
      }
    });

    await AuditService.logUserAction(
      {
        userId: request.headers.get('x-user-id') || undefined,
        ipAddress: request.ip,
        action: 'CREATE',
        entity: 'BILL',
        entityId: bill.id,
        message: `Bill generated: ${billNumber}- Amount: ${totalAmount}`
      }
    );

    // ... previous code ...
    const billItems = await prisma.billItem.findMany({
        where: { billId: bill.id },
        include: {
            service: true,
            medication: true,
            procedure: true
        }
    });

    const totalAmount = billItems.reduce((sum, item) => {
        return sum + (item.amount || 0);
    }, 0);

    const response = {
        ...bill,
        items: billItems,
        totalAmount
    };

    return NextResponse.json(response, { status: 200 });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { patientId, items } = body;

        if (!patientId || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const bill = await prisma.bill.create({
            data: {
                patientId,
                status: 'PENDING',
                createdAt: new Date(),
                updatedAt: new Date(),
                billItems: {
                    create: items.map((item: any) => ({
                        ...item
                    }))
                }
            },
            include: {
                billItems: true
            }
        });

        return NextResponse.json(bill, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create bill', details: error?.message }, { status: 500 });
    }
}
// ... next code ...
