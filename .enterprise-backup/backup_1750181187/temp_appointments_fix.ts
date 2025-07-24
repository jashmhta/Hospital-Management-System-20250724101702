
import { checkDoctorAvailability } from '@/lib/services/availability.service';
}
// Add this before the TODO comment replacement:
      // 2. Check Doctor Availability using availability service
      const availabilityCheck = await checkDoctorAvailability(;
        doctorId,
        {
          start: new Date(scheduledDateTime),
          end: new Date(new Date(scheduledDateTime).getTime() + (estimatedDuration || 30) * 60000)
        }
      );

      if (!availabilityCheck.available) {
        return NextResponse.json(;
            error: 'Doctor is not available at the requested time',
            conflicts: availabilityCheck.conflicts;
            suggestions: availabilityCheck.suggestedSlots,status: 409 
        );

