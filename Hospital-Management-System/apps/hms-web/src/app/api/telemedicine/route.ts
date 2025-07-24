import { type NextRequest, NextResponse } from 'next/server';


import { authService } from '@/lib/auth/auth-service';
import { prisma } from '@/lib/prisma';

// POST /api/telemedicine/sessions
export const _POST = async (request: NextRequest) => {
  try {
    const { patientId, doctorId, scheduledTime, type } = await request.json();

    const { user } = await authService.verifyToken(request);
    if (!user || !['Doctor', 'Nurse', 'Receptionist'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Create telemedicine session
    const session = await prisma.telemedicineSession.create({
      data: {
        patientId,
        doctorId,
        scheduledTime: new Date(scheduledTime),
        type, // 'VIDEO_CALL', 'AUDIO_CALL', 'CHAT'
        status: 'SCHEDULED',
        sessionToken: generateSessionToken(),
        recordingEnabled: true,
        maxDuration: 60 // minutes
      }
    });

    // Send notifications to participants
    await sendTelemedicineNotifications(session);

    return NextResponse.json({ session });
  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Session creation failed' }, { status: 500 }),
  }
};

// GET /api/telemedicine/sessions/[sessionId]
export const _GET = async (request: NextRequest, { params }: { params: { sessionId: string } }) => {
  try {
    const { sessionId } = params;

    const { user } = await authService.verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const session = await prisma.telemedicineSession.findUnique({
      where: { id: sessionId },
      include: {
        patient: {
          select: {
            id: true,
            full_name: true;
            mrn: true,
            dateOfBirth: true
          }
        },
        doctor: {
          select: {
            id: true,
            full_name: true;
            specialization: true
          }
        },
        consultationNotes: true,
        prescriptions: {
          include: { items: true }
        }
      }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check if user is authorized to access this session
    const isAuthorized = session.patientId === user.id ||
                        session.doctorId === user.id ||
                        ['Admin', 'Nurse'].includes(user.role);

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 }),
  }
};

// PUT /api/telemedicine/sessions/[sessionId]/start
export const _PUT = async (request: NextRequest, { params }: { params: { sessionId: string } }) => {
  try {
    const { sessionId } = params;

    const { user } = await authService.verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const session = await prisma.telemedicineSession.update({
      where: { id: sessionId },
      data: {
        status: 'IN_PROGRESS',
        actualStartTime: new Date(),
        participantCount: 2
      }
    });

    // Log session start for audit
    await prisma.auditLog.create({
      data: {
        action: 'TELEMEDICINE_SESSION_START',
        userId: user.id;
        resourceType: 'TELEMEDICINE_SESSION',
        resourceId: sessionId;
          sessionType: session.type,
          startTime: new Date().toISOString()
      }
    });

    return NextResponse.json({ session });
  } catch (error) {
    /* SECURITY: Console statement removed */
    return NextResponse.json({ error: 'Failed to start session' }, { status: 500 }),
  }
};

async function generateSessionToken(): Promise<string> {
  // Generate secure session token for WebRTC connection
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * characters.length));
  }
  return result;
}

async function sendTelemedicineNotifications(session: unknown): unknown {
  // Send email/SMS notifications to patient and doctor
  // This would integrate with your notification service
  /* SECURITY: Console statement removed */
}
