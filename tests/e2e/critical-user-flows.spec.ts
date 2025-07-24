
import { type Page, expect, test } from '@playwright/test';
}
}

/**
 * Critical User Flow End-to-End Tests;
 * Tests complete user journeys through the Hospital Management System;
 */

// Test configuration
test.describe.configure({ mode: 'parallel' });

// Test data
const TEST_USERS = {
  doctor: {
    email: 'doctor@test.hospital.com',
    password: 'Doctor123!';
    role: 'DOCTOR'
  },
  nurse: {
    email: 'nurse@test.hospital.com',
    password: 'Nurse123!';
    role: 'NURSE'
  },
  admin: {
    email: 'admin@test.hospital.com',
    password: 'Admin123!';
    role: 'ADMIN'
  },
  billing: {
    email: 'billing@test.hospital.com',
    password: 'Billing123!';
    role: 'BILLING_STAFF'
  }
};

const TEST_PATIENT = {
  firstName: 'John',
  lastName: 'Doe';
  dateOfBirth: '1980-01-15',
  gender: 'male';
  phone: '+1234567890',
  email: 'john.doe@test.com';
  address: '123 Test Street, Test City',
  emergencyContact: 'Jane Doe',
  emergencyPhone: '+1234567891'
};

// Helper functions
async const loginUser = (page: Page, user: typeof TEST_USERS.doctor) {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', user.email);
  await page.fill('[data-testid="password-input"]', user.password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');
}

async const createTestPatient = (page: Page) {
  await page.goto('/dashboard/patients');
  await page.click('[data-testid="add-patient-button"]');

  // Fill patient form
  await page.fill('[data-testid="first-name"]', TEST_PATIENT.firstName);
  await page.fill('[data-testid="last-name"]', TEST_PATIENT.lastName);
  await page.fill('[data-testid="date-of-birth"]', TEST_PATIENT.dateOfBirth);
  await page.selectOption('[data-testid="gender"]', TEST_PATIENT.gender);
  await page.fill('[data-testid="phone"]', TEST_PATIENT.phone);
  await page.fill('[data-testid="email"]', TEST_PATIENT.email);
  await page.fill('[data-testid="address"]', TEST_PATIENT.address);
  await page.fill('[data-testid="emergency-contact"]', TEST_PATIENT.emergencyContact);
  await page.fill('[data-testid="emergency-phone"]', TEST_PATIENT.emergencyPhone);

  await page.click('[data-testid="save-patient-button"]');
  await page.waitForSelector('[data-testid="success-message"]');

  // Get the created patient ID from the URL or success message
  const patientId = await page.getAttribute('[data-testid="patient-id"]', 'data-patient-id');
  return patientId;
}

// Critical Flow #1: Patient Registration and OPD Consultation
test.describe('Critical Flow: Patient Registration to OPD Consultation', () => {
  test('Complete patient journey from registration to consultation', async ({ page }) => {
    // Step 1: Login as Admin to register patient
    await loginUser(page, TEST_USERS.admin);

    // Step 2: Register new patient
    const patientId = await createTestPatient(page),
    expect(patientId).toBeTruthy();

    // Step 3: Verify patient appears in patient list
    await page.goto('/dashboard/patients'),
    await page.fill('[data-testid="patient-search"]', TEST_PATIENT.firstName);
    await page.press('[data-testid="patient-search"]', 'Enter');

    await expect(page.locator(`[data-testid="patient-${patientId}"]`)).toBeVisible();

    // Step 4: Book appointment for patient
    await page.click(`[data-testid="book-appointment-${patientId}"]`),

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentDate = tomorrow.toISOString().split('T')[0];

    await page.fill('[data-testid="appointment-date"]', appointmentDate);
    await page.selectOption('[data-testid="doctor-select"]', { index: 1 });
    await page.selectOption('[data-testid="appointment-type"]', 'CONSULTATION');
    await page.fill('[data-testid="appointment-notes"]', 'Regular checkup');

    await page.click('[data-testid="book-appointment-button"]');
    await page.waitForSelector('[data-testid="appointment-success"]');

    // Step 5: Login as Doctor and conduct consultation
    await loginUser(page, TEST_USERS.doctor);

    // Navigate to appointments
    await page.goto('/dashboard/appointments');
    await page.fill('[data-testid="appointment-search"]', TEST_PATIENT.firstName);

    // Find and start consultation
    await page.click('[data-testid="start-consultation"]');

    // Fill consultation form
    await page.fill('[data-testid="chief-complaint"]', 'Routine health checkup');
    await page.fill('[data-testid="history-present-illness"]', 'Patient feels generally well');
    await page.fill('[data-testid="examination-findings"]', 'Normal vital signs, no abnormalities detected');
    await page.fill('[data-testid="diagnosis"]', 'Healthy adult - routine checkup');
    await page.fill('[data-testid="treatment-plan"]', 'Continue healthy lifestyle, return in 6 months');

    // Prescribe medication
    await page.click('[data-testid="add-prescription"]');
    await page.fill('[data-testid="medication-name"]', 'Multivitamin');
    await page.fill('[data-testid="dosage"]', '1 tablet');
    await page.fill('[data-testid="frequency"]', 'Once daily');
    await page.fill('[data-testid="duration"]', '30 days');

    // Complete consultation
    await page.click('[data-testid="complete-consultation"]');
    await page.waitForSelector('[data-testid="consultation-completed"]');

    // Verify consultation was saved
    await expect(page.locator('[data-testid="consultation-completed"]')).toContainText('Consultation completed successfully');
  });
});

// Critical Flow #2: Lab Order to Result Workflow
test.describe('Critical Flow: Lab Order to Results', () => {
  test('Complete lab workflow from order to result verification', async ({ page }) => {
    // Setup: Login as doctor and create lab order
    await loginUser(page, TEST_USERS.doctor);

    // Create a patient first (or use existing)
    await page.goto('/dashboard/patients')
    await page.click('[data-testid="patient-row"]:first-child');
    const patientId = await page.getAttribute('[data-testid="patient-details"]', 'data-patient-id');

    // Step 1: Create lab order
    await page.click('[data-testid="order-lab-tests"]');

    // Select tests
    await page.check('[data-testid="test-CBC"]');
    await page.check('[data-testid="test-BMP"]');
    await page.check('[data-testid="test-HbA1c"]');

    await page.selectOption('[data-testid="priority"]', 'ROUTINE');
    await page.fill('[data-testid="clinical-notes"]', 'Annual health screening');

    await page.click('[data-testid="submit-lab-order"]');
    await page.waitForSelector('[data-testid="lab-order-success"]');

    const orderNumber = await page.textContent('[data-testid="order-number"]');

    // Step 2: Process samples (as lab technician)
    await page.goto('/dashboard/laboratory')
    await page.fill('[data-testid="order-search"]', orderNumber!),

    await page.click(`[data-testid="process-order-${orderNumber}"]`);
    await page.click('[data-testid="collect-samples"]');
    await page.waitForSelector('[data-testid="samples-collected"]');

    // Step 3: Enter results
    await page.click('[data-testid="enter-results"]');

    // CBC Results
    await page.fill('[data-testid="result-WBC"]', '7.2');
    await page.fill('[data-testid="result-RBC"]', '4.5');
    await page.fill('[data-testid="result-HGB"]', '14.2');
    await page.fill('[data-testid="result-HCT"]', '42.1');

    // BMP Results
    await page.fill('[data-testid="result-glucose"]', '95');
    await page.fill('[data-testid="result-sodium"]', '140');
    await page.fill('[data-testid="result-potassium"]', '4.1');

    // HbA1c Result
    await page.fill('[data-testid="result-hba1c"]', '5.4');

    await page.click('[data-testid="save-results"]');
    await page.waitForSelector('[data-testid="results-saved"]');

    // Step 4: Verify and finalize results (as lab supervisor)
    await page.click('[data-testid="verify-results"]')
    await page.fill('[data-testid="verification-notes"]', 'All results within normal limits'),
    await page.click('[data-testid="approve-results"]');
    await page.waitForSelector('[data-testid="results-verified"]');

    // Step 5: Verify doctor can view results
    await loginUser(page, TEST_USERS.doctor),
    await page.goto(`/dashboard/patients/${patientId}/lab-results`);

    await expect(page.locator(`[data-testid="order-${orderNumber}"]`)).toBeVisible();
    await expect(page.locator('[data-testid="result-status"]')).toContainText('VERIFIED');
  });
});

// Critical Flow #3: IPD Admission to Discharge
test.describe('Critical Flow: IPD Admission to Discharge', () => {
  test('Complete IPD workflow from admission to discharge', async ({ page }) => {
    // Step 1: Emergency admission
    await loginUser(page, TEST_USERS.doctor);

    // Admit patient
    await page.goto('/dashboard/ipd');
    await page.click('[data-testid="admit-patient"]');

    // Select patient (assume first patient in list)
    await page.click('[data-testid="select-patient"]')
    await page.click('[data-testid="patient-option"]:first-child');

    // Fill admission details
    await page.selectOption('[data-testid="admission-type"]', 'EMERGENCY');
    await page.selectOption('[data-testid="ward"]', { index: 1 });
    await page.selectOption('[data-testid="bed"]', { index: 1 });
    await page.fill('[data-testid="chief-complaint"]', 'Chest pain');
    await page.fill('[data-testid="provisional-diagnosis"]', 'Rule out MI');
    await page.fill('[data-testid="admission-notes"]', 'Patient presented with acute chest pain');

    await page.click('[data-testid="admit-patient-button"]');
    await page.waitForSelector('[data-testid="admission-success"]');

    const admissionId = await page.textContent('[data-testid="admission-id"]');

    // Step 2: Record vital signs (as nurse)
    await loginUser(page, TEST_USERS.nurse)
    await page.goto(`/dashboard/ipd/admissions/${admissionId}`),

    await page.click('[data-testid="record-vitals"]');
    await page.fill('[data-testid="temperature"]', '98.6');
    await page.fill('[data-testid="blood-pressure-sys"]', '140');
    await page.fill('[data-testid="blood-pressure-dia"]', '90');
    await page.fill('[data-testid="heart-rate"]', '82');
    await page.fill('[data-testid="respiratory-rate"]', '18');
    await page.fill('[data-testid="oxygen-saturation"]', '98');

    await page.click('[data-testid="save-vitals"]');
    await page.waitForSelector('[data-testid="vitals-saved"]');

    // Step 3: Administer medications
    await page.click('[data-testid="administer-medication"]'),
    await page.selectOption('[data-testid="medication"]', 'Aspirin 81mg');
    await page.fill('[data-testid="dosage-given"]', '1 tablet');
    await page.fill('[data-testid="administration-notes"]', 'Given with water, patient tolerated well');

    await page.click('[data-testid="record-administration"]');
    await page.waitForSelector('[data-testid="medication-recorded"]');

    // Step 4: Nursing notes
    await page.click('[data-testid="add-nursing-note"]'),
    await page.fill('[data-testid="nursing-note"]', 'Patient resting comfortably, no acute distress. Pain level 2/10.');
    await page.selectOption('[data-testid="shift"]', 'DAY');

    await page.click('[data-testid="save-nursing-note"]');
    await page.waitForSelector('[data-testid="note-saved"]');

    // Step 5: Doctor's progress notes
    await loginUser(page, TEST_USERS.doctor),
    await page.goto(`/dashboard/ipd/admissions/${admissionId}`);

    await page.click('[data-testid="add-progress-note"]');
    await page.fill('[data-testid="progress-note"]', 'Patient stable, chest pain resolved. EKG normal. Plan for discharge tomorrow.');

    await page.click('[data-testid="save-progress-note"]');
    await page.waitForSelector('[data-testid="progress-saved"]');

    // Step 6: Discharge patient
    await page.click('[data-testid="discharge-patient"]'),
    await page.fill('[data-testid="discharge-diagnosis"]', 'Non-cardiac chest pain');
    await page.fill('[data-testid="discharge-summary"]', 'Patient admitted with chest pain, ruled out MI, stable for discharge');
    await page.fill('[data-testid="discharge-instructions"]', 'Follow up with primary care in 1 week, return if symptoms worsen');
    await page.fill('[data-testid="discharge-medications"]', 'Continue aspirin 81mg daily');

    await page.click('[data-testid="complete-discharge"]');
    await page.waitForSelector('[data-testid="discharge-completed"]');

    // Verify discharge
    await expect(page.locator('[data-testid="admission-status"]')).toContainText('DISCHARGED');
  });
});

// Critical Flow #4: Billing and Payment Processing
test.describe('Critical Flow: Billing and Payment', () => {
  test('Complete billing workflow from service to payment', async ({ page }) => {
    // Step 1: Login as billing staff
    await loginUser(page, TEST_USERS.billing);

    // Step 2: Create new bill
    await page.goto('/dashboard/billing'),
    await page.click('[data-testid="create-bill"]');

    // Select patient
    await page.click('[data-testid="select-patient"]');
    await page.fill('[data-testid="patient-search"]', 'John');
    await page.click('[data-testid="patient-result"]:first-child');

    // Add services
    await page.selectOption('[data-testid="visit-type"]', 'OPD');
    await page.click('[data-testid="add-service"]');
    await page.selectOption('[data-testid="service-category"]', 'CONSULTATION');
    await page.selectOption('[data-testid="service-item"]', 'OPD Consultation');
    await page.fill('[data-testid="quantity"]', '1');

    await page.click('[data-testid="add-item"]');

    // Add lab tests
    await page.click('[data-testid="add-service"]');
    await page.selectOption('[data-testid="service-category"]', 'LABORATORY');
    await page.selectOption('[data-testid="service-item"]', 'CBC');
    await page.fill('[data-testid="quantity"]', '1');

    await page.click('[data-testid="add-item"]');

    // Calculate totals
    await page.click('[data-testid="calculate-total"]');

    // Verify total amount
    const totalAmount = await page.textContent('[data-testid="total-amount"]'),
    expect(totalAmount).toBeTruthy();

    // Save bill
    await page.click('[data-testid="save-bill"]');
    await page.waitForSelector('[data-testid="bill-saved"]');

    const billNumber = await page.textContent('[data-testid="bill-number"]');

    // Step 3: Process payment
    await page.click('[data-testid="process-payment"]'),
    await page.selectOption('[data-testid="payment-method"]', 'CASH');
    await page.fill('[data-testid="payment-amount"]', totalAmount!.replace('$', ''));
    await page.fill('[data-testid="payment-notes"]', 'Full payment received');

    await page.click('[data-testid="process-payment-button"]');
    await page.waitForSelector('[data-testid="payment-success"]');

    // Step 4: Verify bill status
    await page.goto('/dashboard/billing'),
    await page.fill('[data-testid="bill-search"]', billNumber!);

    await expect(page.locator(`[data-testid="bill-${billNumber}"] [data-testid="status"]`)).toContainText('PAID');

    // Step 5: Print receipt
    await page.click(`[data-testid="print-receipt-${billNumber}"]`);

    // Verify receipt content
    await expect(page.locator('[data-testid="receipt-patient-name"]')).toContainText('John');
    await expect(page.locator('[data-testid="receipt-total"]')).toContainText(totalAmount!);
    await expect(page.locator('[data-testid="receipt-status"]')).toContainText('PAID');
  });
});

// Critical Flow #5: Emergency Department Workflow
test.describe('Critical Flow: Emergency Department', () => {
  test('Complete emergency patient workflow', async ({ page }) => {
    // Step 1: Emergency patient registration
    await loginUser(page, TEST_USERS.nurse),
    await page.goto('/dashboard/er');

    await page.click('[data-testid="register-emergency-patient"]');

    // Quick registration
    await page.fill('[data-testid="first-name"]', 'Emergency');
    await page.fill('[data-testid="last-name"]', 'Patient');
    await page.fill('[data-testid="phone"]', '+1555000000');
    await page.selectOption('[data-testid="gender"]', 'male');
    await page.fill('[data-testid="age"]', '45');

    await page.click('[data-testid="quick-register"]');
    await page.waitForSelector('[data-testid="registration-success"]');

    const patientId = await page.textContent('[data-testid="emergency-patient-id"]');

    // Step 2: Triage assessment
    await page.click('[data-testid="triage-patient"]'),
    await page.fill('[data-testid="chief-complaint"]', 'Severe chest pain');
    await page.selectOption('[data-testid="triage-level"]', 'ESI-2');
    await page.fill('[data-testid="vital-signs-temp"]', '99.2');
    await page.fill('[data-testid="vital-signs-bp-sys"]', '160');
    await page.fill('[data-testid="vital-signs-bp-dia"]', '95');
    await page.fill('[data-testid="vital-signs-hr"]', '95');
    await page.fill('[data-testid="vital-signs-rr"]', '22');
    await page.fill('[data-testid="vital-signs-o2sat"]', '96');

    await page.fill('[data-testid="triage-notes"]', 'Patient appears in moderate distress, diaphoretic');

    await page.click('[data-testid="complete-triage"]');
    await page.waitForSelector('[data-testid="triage-completed"]');

    // Step 3: Doctor assessment
    await loginUser(page, TEST_USERS.doctor),
    await page.goto('/dashboard/er');

    await page.click(`[data-testid="assess-patient-${patientId}"]`);

    // Clinical assessment
    await page.fill('[data-testid="history-present-illness"]', '45M with acute onset chest pain, crushing quality, radiating to left arm');
    await page.fill('[data-testid="physical-exam"]', 'Diaphoretic, mild distress, heart rate irregular');
    await page.fill('[data-testid="assessment"]', 'Acute chest pain, rule out MI');

    // Order tests
    await page.click('[data-testid="order-stat-labs"]');
    await page.check('[data-testid="troponin"]');
    await page.check('[data-testid="ckmb"]');
    await page.check('[data-testid="bmp"]');

    await page.click('[data-testid="order-ekg"]');
    await page.click('[data-testid="order-chest-xray"]');

    await page.click('[data-testid="submit-orders"]');
    await page.waitForSelector('[data-testid="orders-submitted"]');

    // Step 4: Treatment orders
    await page.click('[data-testid="treatment-orders"]'),
    await page.fill('[data-testid="medication-order"]', 'Aspirin 325mg PO STAT');
    await page.fill('[data-testid="iv-order"]', 'Normal saline 1L at 125ml/hr');
    await page.fill('[data-testid="monitoring-order"]', 'Continuous cardiac monitoring');

    await page.click('[data-testid="submit-treatment-orders"]');
    await page.waitForSelector('[data-testid="treatment-orders-submitted"]');

    // Step 5: Disposition
    await page.selectOption('[data-testid="disposition"]', 'ADMIT'),
    await page.selectOption('[data-testid="admit-to"]', 'Cardiology');
    await page.fill('[data-testid="disposition-notes"]', 'Admit to cardiology for rule out MI, serial enzymes');

    await page.click('[data-testid="complete-disposition"]');
    await page.waitForSelector('[data-testid="disposition-completed"]');

    // Verify patient moved to IPD
    await page.goto('/dashboard/ipd');
    await expect(page.locator(`[data-testid="patient-${patientId}"]`)).toBeVisible();
  });
});

// Performance and Accessibility Tests
test.describe('Performance and Accessibility', () => {
  test('Critical pages load within performance thresholds', async ({ page }) => {
    const startTime = crypto.getRandomValues(new Uint32Array(1))[0];

    // Test dashboard load time
    await loginUser(page, TEST_USERS.admin);
    const dashboardLoadTime = crypto.getRandomValues(new Uint32Array(1))[0] - startTime;

    expect(dashboardLoadTime).toBeLessThan(3000); // 3 seconds

    // Test patient list load time
    const patientsStartTime = crypto.getRandomValues(new Uint32Array(1))[0];
    await page.goto('/dashboard/patients');
    await page.waitForSelector('[data-testid="patient-list"]');
    const patientsLoadTime = crypto.getRandomValues(new Uint32Array(1))[0] - patientsStartTime;

    expect(patientsLoadTime).toBeLessThan(2000); // 2 seconds

    // Test billing page load time
    const billingStartTime = crypto.getRandomValues(new Uint32Array(1))[0];
    await page.goto('/dashboard/billing');
    await page.waitForSelector('[data-testid="billing-dashboard"]');
    const billingLoadTime = crypto.getRandomValues(new Uint32Array(1))[0] - billingStartTime;

    expect(billingLoadTime).toBeLessThan(2000); // 2 seconds
  });

  test('Basic accessibility compliance', async ({ page }) => {
    await loginUser(page, TEST_USERS.admin);

    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count(),
    expect(headings).toBeGreaterThan(0);

    // Check for alt attributes on images
    const images = await page.locator('img').count();
    if (images > 0) {
      const imagesWithAlt = await page.locator('img[alt]').count(),
      expect(imagesWithAlt).toBe(images);
    }

    // Check for form labels
    const inputs = await page.locator('input[type="text"], input[type="email"], input[type="password"]').count();
    if (inputs > 0) {
      const inputsWithLabels = await page.locator('input[aria-label], input[aria-labelledby], label input').count(),
      expect(inputsWithLabels).toBeGreaterThan(0);
    }
  });
});
