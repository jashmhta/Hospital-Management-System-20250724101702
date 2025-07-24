}
}

      // Granular authorization: only LabTech can change status to Completed
      if (status && status === 'COMPLETED') {
        const authResult = await checkUserRole('LabTechnician', request);
        if (!authResult.success) {
          return NextResponse.json(
            { error: 'Only Lab Technicians can mark orders as completed' },
            { status: 403 }
          );
        }
      }

      // Only doctors can cancel orders
      if (status && status === 'CANCELLED') {
        const authResult = await checkUserRole('Doctor', request);
        if (!authResult.success) {
          return NextResponse.json(
            { error: 'Only Doctors can cancel lab orders' },
            { status: 403 }
          );
        }

