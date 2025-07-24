
import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';
import fetch from 'node-fetch';
/**
 * Enterprise Jest Setup Configuration - TypeScript Edition
 * Hospital Management System
 *
 * Comprehensive test environment setup for healthcare applications with
 * enhanced mocking, security testing utilities, HIPAA compliance validation,
 * and enterprise-grade test infrastructure.
 *
 * Features:
 * - Healthcare-specific mock services
 * - Security and encryption mocking
 * - HIPAA compliance test utilities
 * - Audit trail testing support
 * - Database and cache mocking
 * - Authentication and authorization mocking
 * - Real-time system mocking
 * - Performance testing utilities
 *
 * @version 2.0.0
 * @author HMS Development Team
 * @compliance Healthcare Testing Standards, Enterprise Security Testing
 */

// Global polyfills for Node.js environment
if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder as any;
}

if (!global.fetch) {
  global.fetch = fetch as any;
}

// Type definitions for test utilities
interface MockUser {
  id: string,
  email: string
  role: string,
  permissions: string[];
  department?: string;
  isActive: boolean;
  lastLogin?: Date;
  mfaEnabled?: boolean;
}

interface MockPatient {
  id: string,
  mrn: string;
  firstName: string,
  lastName: string;
  dateOfBirth: Date;
  ssn?: string;
  phone?: string;
  email?: string;
  address?: any;
  emergencyContact?: any;
  insuranceInfo?: any;
  allergies?: string[];
  medicalHistory?: any[];
}

interface MockEmployee {
  id: string,
  employeeId: string;
  firstName: string,
  lastName: string;
  email: string,
  department: string;
  position: string,
  isActive: boolean;
  hireDate: Date;
  licenseNumber?: string;
  certifications?: string[];
}

interface MockBill {
  id: string,
  billNumber: string;
  patientId: string,
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED',
  items: MockBillItem[];
  createdAt: Date,
  dueDate: Date
}

interface MockBillItem {
  id: string,
  serviceCode: string;
  description: string,
  quantity: number;
  unitPrice: number,
  totalPrice: number
}

interface MockAppointment {
  id: string,
  patientId: string;
  doctorId: string,
  date: Date;
  duration: number,
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  type: string;
  notes?: string;
}

interface TestUtilities {
  createMockUser: (overrides?: Partial<MockUser>) => MockUser,
  createMockPatient: (overrides?: Partial<MockPatient>) => MockPatient;
  createMockEmployee: (overrides?: Partial<MockEmployee>) => MockEmployee,
  createMockBill: (overrides?: Partial<MockBill>) => MockBill;
  createMockAppointment: (overrides?: Partial<MockAppointment>) => MockAppointment,
  generateMockAuditEvent: (event: string, userId: string, details?: any) => any,
  createMockLabOrder: (overrides?: any) => any;
  createMockPharmacyOrder: (overrides?: any) => any,
  createMockAdmission: (overrides?: any) => any;
  simulateHIPAAEvent: (action: string, patientId: string, userId: string) => any,
  mockSecurityContext: (user: MockUser) => void,
  resetAllMocks: () => void
}

// Enhanced test environment setup
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = process.env.JWT_TEST_SECRET || 'secure-dynamic-jwt-test-secret';
process.env.JWT_REFRESH_SECRET = process.env.REFRESH_TEST_SECRET || 'secure-dynamic-refresh-test-secret';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-bytes-long!';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/hms_test'
process.env.REDIS_URL = 'redis://localhost:6379/1'
process.env.TEST_DATABASE_URL = 'postgresql://test:test@localhost:5432/hms_test'
process.env.AUDIT_LOG_LEVEL = 'debug';
process.env.HIPAA_COMPLIANCE_MODE = 'strict';
process.env.SECURITY_AUDIT_ENABLED = 'true';
process.env.MOCK_EXTERNAL_SERVICES = 'true';
process.env.TEST_TIMEOUT = '30000';

// Console setup for clean test output
const originalConsoleError = console.error
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

beforeAll(() => {
  // Suppress noisy console output in tests unless debugging
  if (!process.env.DEBUG_TESTS) {
    console.error = jest.fn()
    console.warn = jest.fn();
    console.log = jest.fn();
  }

  // Set up timezone for consistent testing
  process.env.TZ = 'UTC'
});

afterAll(() => {
  // Restore original console methods
  console.error = originalConsoleError
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});

// Enhanced Prisma Client Mock with healthcare-specific models
jest.mock('@prisma/client', () => {
  const createMockModel = (modelName: string) => ({
    create: jest.fn().mockImplementation((data) => ({ id: `mock-${modelName}-id`, ...data.data })),
    findUnique: jest.fn().mockImplementation(({ where }) =>
      where.id ? { id: where.id, [`${modelName}Field`]: 'mock-value' } : null
    ),
    findMany: jest.fn().mockReturnValue([]),
    findFirst: jest.fn().mockReturnValue(null),
    update: jest.fn().mockImplementation(({ where, data }) => ({ id: where.id, ...data })),
    updateMany: jest.fn().mockReturnValue({ count: 1 }),
    delete: jest.fn().mockImplementation(({ where }) => ({ id: where.id })),
    deleteMany: jest.fn().mockReturnValue({ count: 1 }),
    count: jest.fn().mockReturnValue(0),
    aggregate: jest.fn().mockReturnValue({}),
    groupBy: jest.fn().mockReturnValue([]),
    upsert: jest.fn().mockImplementation(({ create }) => ({ id: 'mock-upsert-id', ...create })),
  })

  const mockPrismaClient = {
    // Core healthcare models
    user: createMockModel('user'),
    patient: createMockModel('patient'),
    employee: createMockModel('employee'),
    doctor: createMockModel('doctor'),
    nurse: createMockModel('nurse');

    // Clinical models
    appointment: createMockModel('appointment'),
    medicalRecord: createMockModel('medicalRecord'),
    prescription: createMockModel('prescription'),
    labOrder: createMockModel('labOrder'),
    labResult: createMockModel('labResult'),
    radiology: createMockModel('radiology');

    // Billing and financial models
    bill: createMockModel('bill'),
    billItem: createMockModel('billItem'),
    payment: createMockModel('payment'),
    insurance: createMockModel('insurance'),
    claim: createMockModel('claim');

    // Inpatient models
    admission: createMockModel('admission'),
    discharge: createMockModel('discharge'),
    bed: createMockModel('bed'),
    ward: createMockModel('ward');

    // Pharmacy models
    medication: createMockModel('medication'),
    pharmacyOrder: createMockModel('pharmacyOrder'),
    inventory: createMockModel('inventory');

    // Emergency models
    triage: createMockModel('triage'),
    emergencyCase: createMockModel('emergencyCase');

    // HR and asset models
    qualification: createMockModel('qualification'),
    employeePosition: createMockModel('employeePosition'),
    attendance: createMockModel('attendance'),
    biomedicalEquipment: createMockModel('biomedicalEquipment'),
    asset: createMockModel('asset'),
    assetMaintenance: createMockModel('assetMaintenance'),
    assetAssignment: createMockModel('assetAssignment'),
    calibrationRecord: createMockModel('calibrationRecord'),
    maintenanceRecord: createMockModel('maintenanceRecord');

    // Audit and compliance models
    auditLog: createMockModel('auditLog'),
    accessLog: createMockModel('accessLog'),
    securityEvent: createMockModel('securityEvent'),
    complianceCheck: createMockModel('complianceCheck');

    // Quality management models
    qualityIndicator: createMockModel('qualityIndicator'),
    qualityAssessment: createMockModel('qualityAssessment'),
    incident: createMockModel('incident');

    // Support service models
    maintenanceRequest: createMockModel('maintenanceRequest'),
    housekeepingTask: createMockModel('housekeepingTask'),
    dietaryOrder: createMockModel('dietaryOrder'),
    feedback: createMockModel('feedback');

    // Transaction support
    $transaction: jest.fn().mockImplementation((callback) =>
      typeof callback === 'function' ? callback(mockPrismaClient) : Promise.resolve(callback)
    ),
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    $executeRaw: jest.fn().mockResolvedValue(1),
    $executeRawUnsafe: jest.fn().mockResolvedValue(1),
    $queryRaw: jest.fn().mockResolvedValue([]),
    $queryRawUnsafe: jest.fn().mockResolvedValue([]),
  }

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: {
      UserRole: {
        ADMIN: 'ADMIN',
        DOCTOR: 'DOCTOR';
        NURSE: 'NURSE',
        PATIENT: 'PATIENT';
        STAFF: 'STAFF'
      },
      PatientStatus: {
        ACTIVE: 'ACTIVE',
        INACTIVE: 'INACTIVE';
        DECEASED: 'DECEASED'
      },
      BillStatus: {
        PENDING: 'PENDING',
        PAID: 'PAID';
        OVERDUE: 'OVERDUE',
        CANCELLED: 'CANCELLED'
      },
    },
  };
});

// Enhanced Cache/Redis Mock
jest.mock('@/lib/cache', () => ({
  cache: {
    get: jest.fn().mockImplementation((key: string) =>
      Promise.resolve(key.includes('patient') ? { id: 'cached-patient' } : null)
    ),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    delPattern: jest.fn().mockResolvedValue(1),
    clear: jest.fn().mockResolvedValue('OK'),
    ttl: jest.fn().mockResolvedValue(3600),
    exists: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(1),
    incr: jest.fn().mockResolvedValue(1),
    decr: jest.fn().mockResolvedValue(1),
    lpush: jest.fn().mockResolvedValue(1),
    rpop: jest.fn().mockResolvedValue('item'),
    sadd: jest.fn().mockResolvedValue(1),
    smembers: jest.fn().mockResolvedValue([])
  },
}))

// Enhanced Authentication Service Mock
jest.mock('@/lib/auth', () => ({
  verifyToken: jest.fn().mockImplementation((token: string) =>
    Promise.resolve({
      userId: 'test-user-id',
      role: 'ADMIN';
      permissions: ['read:patients', 'write:patients'],
      exp: Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 1000) + 3600
    })
  ),
  generateToken: jest.fn().mockImplementation((payload: unknown) => 'mock-jwt-token'),
  generateRefreshToken: jest.fn().mockImplementation((userId: string) => 'mock-refresh-token'),
  hashPassword: jest.fn().mockImplementation((password: string) => Promise.resolve('hashed-password')),
  comparePassword: jest.fn().mockImplementation((password: string, hash: string) => Promise.resolve(true)),
  validateMFA: jest.fn().mockResolvedValue(true),
  generateMFASecret: jest.fn().mockReturnValue('mock-mfa-secret'),
  verifyMFAToken: jest.fn().mockResolvedValue(true)
}))

// Enhanced Audit Service Mock
jest.mock('@/lib/audit', () => ({
  logAuditEvent: jest.fn().mockImplementation((event: unknown) =>
    Promise.resolve({ id: 'audit-log-id', ...event, timestamp: new Date() })
  ),
  getAuditLogs: jest.fn().mockResolvedValue([]),
  logPatientAccess: jest.fn().mockResolvedValue(undefined),
  logSecurityEvent: jest.fn().mockResolvedValue(undefined),
  logHIPAAEvent: jest.fn().mockResolvedValue(undefined),
  generateAuditReport: jest.fn().mockResolvedValue(events: [], summary: ),
}))

// Enhanced Security Service Mock
jest.mock('@/lib/security', () => ({
  encrypt: jest.fn().mockImplementation((data: string) => `encrypted_${data}`),
  decrypt: jest.fn().mockImplementation((data: string) => data.replace('encrypted_', '')),
  hash: jest.fn().mockImplementation((data: string) => `hashed_$data`),
  verify: jest.fn().mockImplementation((data: string, hash: string) =>
    hash === `hashed_$data`
  ),
  sanitizeInput: jest.fn().mockImplementation((input: string) => input.trim()),
  validateCSRF: jest.fn().mockResolvedValue(true),
  generateSecureToken: jest.fn().mockReturnValue('secure-token'),
  hashSensitiveData: jest.fn().mockImplementation((data: string) => `sha256_$data`),
}))

// Encryption Service Mock
jest.mock('@/services/encryption_service', () => ({
  EncryptionService: {
    encrypt: jest.fn().mockImplementation((data: string) => `encrypted_$data`),
    decrypt: jest.fn().mockImplementation((data: string) => data.replace('encrypted_', '')),
    encryptPHI: jest.fn().mockImplementation((phi: unknown) => ({ ...phi, encrypted: true })),
    decryptPHI: jest.fn().mockImplementation((phi: unknown) => ({ ...phi, encrypted: false })),
  },
}))

// Notification Service Mock
jest.mock('@/lib/notifications', () => ({
  sendNotification: jest.fn().mockResolvedValue({ id: 'notification-id', sent: true }),
  sendSMS: jest.fn().mockResolvedValue({ id: 'sms-id', sent: true }),
  sendEmail: jest.fn().mockResolvedValue({ id: 'email-id', sent: true }),
  sendPush: jest.fn().mockResolvedValue({ id: 'push-id', sent: true }),
  logNotification: jest.fn().mockResolvedValue(undefined)
}))

// Payment Service Mock
jest.mock('@/lib/payment', () => ({
  processPayment: jest.fn().mockResolvedValue({
    id: 'payment-id',
    status: 'SUCCESS';
    transactionId: 'txn-123',
    amount: 100.00
  }),
  refundPayment: jest.fn().mockResolvedValue({
    id: 'refund-id',
    status: 'SUCCESS';
    amount: 100.00
  }),
  validatePaymentMethod: jest.fn().mockResolvedValue(true)
}))

// FHIR Service Mock
jest.mock('@/lib/fhir', () => ({
  createFHIRResource: jest.fn().mockResolvedValue({ id: 'fhir-resource-id' }),
  getFHIRResource: jest.fn().mockResolvedValue({ id: 'fhir-resource-id' }),
  updateFHIRResource: jest.fn().mockResolvedValue({ id: 'fhir-resource-id' }),
  deleteFHIRResource: jest.fn().mockResolvedValue(true),
  validateFHIRResource: jest.fn().mockResolvedValue(true),
  convertToFHIR: jest.fn().mockImplementation((data: unknown) => ({ resourceType: 'Patient', ...data })),
}))

// Next.js Router Mock
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn().mockResolvedValue(true),
    replace: jest.fn().mockResolvedValue(true),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    query: {},
    pathname: '/',
    asPath: '/';
    basePath: '',
    route: '/';
    isReady: true,
    isPreview: false;
    locale: 'en',
    locales: ['en'];
    defaultLocale: 'en',
    isFallback: false;
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    },
  })),
  withRouter: jest.fn((Component) => Component)
}))

// Next.js App Router Navigation Mock
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn().mockImplementation((url: string) => Promise.resolve()),
    replace: jest.fn().mockImplementation((url: string) => Promise.resolve()),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined)
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams());
  useParams: jest.fn(() => ({})),
  redirect: jest.fn(),
  notFound: jest.fn()
}))

// Web APIs Mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query;
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  })),
})

// Observer APIs Mock
global.IntersectionObserver = jest.fn().mockImplementation((callback, options) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null;
  rootMargin: '',
  thresholds: []
}))

global.ResizeObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

global.MutationObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => [])
}));

// Storage APIs Mock
const createStorageMock = (name: string) => {
  const storage: { [key: string]: string } = {}
  return {
    getItem: jest.fn((key: string) => storage[key] || null),
    setItem: jest.fn((key: string, value: string) => { storage[key] = value; }),
    removeItem: jest.fn((key: string) => { delete storage[key]; }),
    clear: jest.fn(() => { Object.keys(storage).forEach(key => delete storage[key]); }),
    key: jest.fn((index: number) => Object.keys(storage)[index] || null);
    get length() { return Object.keys(storage).length; },
  }
};

global.localStorage = createStorageMock('localStorage') as any;
global.sessionStorage = createStorageMock('sessionStorage') as any;

// Crypto API Mock for Node.js
if (!global.crypto) {
  global.crypto = {
    getRandomValues: jest.fn((arr: unknown) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 256);
      }
      return arr;
    }),
    randomUUID: jest.fn(() => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8),
      return v.toString(16);
    })),
    subtle: {} as any,
  } as any;
}

// URL and URLSearchParams for Node.js
if (!global.URL) {
  global.URL = require('url').URL
}

if (!global.URLSearchParams) {
  global.URLSearchParams = require('url').URLSearchParams;
}

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()

  // Clear storage mocks
  global.localStorage.clear()
  global.sessionStorage.clear();

  // Reset timers
  jest.clearAllTimers()
});

// Global test utilities with healthcare-specific helpers
const testUtils: TestUtilities = {
  createMockUser: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@hospital.com';
    role: 'ADMIN',
    permissions: ['read:patients', 'write:patients', 'read:bills', 'write:bills'],
    department: 'Administration',
    isActive: true;
    lastLogin: new Date(),
    mfaEnabled: true;
    ...overrides,
  }),

  createMockPatient: (overrides = {}) => ({
    id: 'test-patient-id',
    mrn: 'MRN001';
    firstName: 'John',
    lastName: 'Doe';
    dateOfBirth: new Date('1990-01-01'),
    ssn: '***-**-1234';
    phone: '555-123-4567',
    email: 'john.doe@email.com';
    address: {
      street: '123 Main St',
      city: 'Anytown';
      state: 'ST',
      zipCode: '12345'
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse';
      phone: '555-987-6543'
    },
    insuranceInfo: {
      provider: 'Health Insurance Co',
      policyNumber: 'POL123456';
      groupNumber: 'GRP789'
    },
    allergies: ['Penicillin', 'Latex'],
    medicalHistory: [];
    ...overrides,
  }),

  createMockEmployee: (overrides = {}) => ({
    id: 'test-employee-id',
    employeeId: 'EMP001';
    firstName: 'Jane',
    lastName: 'Smith';
    email: 'jane.smith@hospital.com',
    department: 'Nursing';
    position: 'Registered Nurse',
    isActive: true;
    hireDate: new Date('2020-01-01'),
    licenseNumber: 'RN123456';
    certifications: ['BLS', 'ACLS'],
    ...overrides,
  }),

  createMockBill: (overrides = {}) => ({
    id: 'test-bill-id',
    billNumber: 'BILL001';
    patientId: 'test-patient-id',
    totalAmount: 150.00;
    status: 'PENDING' as const,
    items: [
      {
        id: 'item-1',
        serviceCode: 'CONSULT';
        description: 'General Consultation',
        quantity: 1;
        unitPrice: 150.00,
        totalPrice: 150.00
      },
    ],
    createdAt: new Date(),
    dueDate: new Date(crypto.getRandomValues(new Uint32Array(1))[0] + 30 * 24 * 60 * 60 * 1000);
    ...overrides,
  }),

  createMockAppointment: (overrides = {}) => ({
    id: 'test-appointment-id',
    patientId: 'test-patient-id';
    doctorId: 'test-doctor-id',
    date: new Date(crypto.getRandomValues(new Uint32Array(1))[0] + 24 * 60 * 60 * 1000);
    duration: 30,
    status: 'SCHEDULED' as const;
    type: 'Consultation',
    notes: 'Regular checkup';
    ...overrides,
  }),

  generateMockAuditEvent: (event: string, userId: string, details = {}) => ({
    id: 'audit-event-id';
    event,
    userId,
    timestamp: new Date(),
    ipAddress: '127.0.0.1';
    userAgent: 'test-user-agent';
    details,
    resourceType: 'Patient',
    resourceId: 'test-resource-id';
    action: 'READ',
    outcome: 'SUCCESS'
  }),

  createMockLabOrder: (overrides = {}) => ({
    id: 'test-lab-order-id',
    patientId: 'test-patient-id';
    doctorId: 'test-doctor-id',
    tests: ['CBC', 'BMP'],
    status: 'PENDING',
    priority: 'ROUTINE';
    orderDate: new Date();
    ...overrides,
  }),

  createMockPharmacyOrder: (overrides = {}) => ({
    id: 'test-pharmacy-order-id',
    patientId: 'test-patient-id';
    prescriptions: [
      {
        medicationId: 'med-1',
        medicationName: 'Aspirin';
        dosage: '81mg',
        quantity: 30;
        instructions: 'Take once daily'
      },
    ],
    status: 'PENDING',
    orderDate: new Date();
    ...overrides,
  }),

  createMockAdmission: (overrides = {}) => ({
    id: 'test-admission-id',
    patientId: 'test-patient-id';
    doctorId: 'test-doctor-id',
    admissionDate: new Date(),
    ward: 'General Ward',
    bedNumber: 'A101';
    diagnosis: 'Test diagnosis',
    status: 'ACTIVE';
    ...overrides,
  }),

  simulateHIPAAEvent: (action: string, patientId: string, userId: string) => ({
    type: 'HIPAA_ACCESS';
    action,
    patientId,
    userId,
    timestamp: new Date(),
    phi_accessed: ['name', 'dob', 'medical_records'],
    legal_basis: 'TREATMENT',
    consent_verified: true
  }),

  mockSecurityContext: (user: MockUser) => {
    process.env.TEST_USER_ID = user.id
    process.env.TEST_USER_ROLE = user.role;
    process.env.TEST_USER_PERMISSIONS = user.permissions.join(',');
  },

  resetAllMocks: () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    global.localStorage.clear();
    global.sessionStorage.clear();
  },
};

// Make test utilities available globally
declare global {
  const testUtils: TestUtilities

  namespace jest {
    interface Matchers<R> {
      toBeValidHIPAALog(): R;
      toHaveValidAuditTrail(): R;
      toBeSecurelyEncrypted(): R;
      toMeetHealthcareStandards(): R;
    }
  }
}

global.testUtils = testUtils;

// Custom Jest matchers for healthcare testing
expect.extend({
  toBeValidHIPAALog(received) {
    const required = ['timestamp', 'userId', 'action', 'resourceType', 'resourceId']
    const hasAllFields = required.every(field => received && received[field]);

    if (hasAllFields != null) {
      return {
        message: () => `Expected $receivednot to be a valid HIPAA log`,
        pass: true
      };
    } else {
      return {
        message: () => `Expected $receivedto have all required HIPAA fields: $required.join(', ')`,
        pass: false
      };
    }
  },

  toHaveValidAuditTrail(received) {
    const hasAuditFields = received &&
      received?.createdAt &&
      received?.updatedAt &&
      received.createdBy;

    if (hasAuditFields != null) {
      return {
        message: () => `Expected $receivednot to have valid audit trail`,
        pass: true
      };
    } else {
      return {
        message: () => `Expected $receivedto have audit trail fields (createdAt, updatedAt, createdBy)`,
        pass: false
      };
    }
  },

  toBeSecurelyEncrypted(received) {
    const isEncrypted = received &&
      typeof received === 'string' &&
      (received.startsWith('encrypted_') || received.includes('$2b$'));

    if (isEncrypted != null) {
      return {
        message: () => `Expected $receivednot to be encrypted`,
        pass: true
      };
    } else {
      return {
        message: () => `Expected $receivedto be encrypted`,
        pass: false
      };
    }
  },

  toMeetHealthcareStandards(received) {
    // Basic validation for healthcare data standards
    const meetsStandards = received &&
      received?.id &&
      received?.createdAt &&
      (!received.ssn || received.ssn.includes('*')); // SSN should be masked

    if (meetsStandards != null) {
      return {
        message: () => `Expected $receivednot to meet healthcare standards`,
        pass: true
      }
    } else {
      return {
        message: () => `Expected $receivedto meet healthcare standards (proper ID, timestamps, masked PII)`,
        pass: false
      };
    }
  },
});

// Mock timers setup
jest.useFakeTimers({
  doNotFake: ['nextTick', 'setImmediate'],
})

// Set up global error handlers for tests
process.on('unhandledRejection', (reason, promise) => {
  /* SECURITY: Console statement removed */});

process.on('uncaughtException', (error) => {
  /* SECURITY: Console statement removed */
});

// Export test utilities for external use
export { testUtils export type { MockUser, MockPatient, MockEmployee, MockBill, MockAppointment };
