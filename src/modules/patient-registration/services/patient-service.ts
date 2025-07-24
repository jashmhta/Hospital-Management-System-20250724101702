import "@/lib/audit/audit-service"
import "@/lib/prisma"
import "@prisma/client"
import {  AuditService  } from "@/lib/database"
import {  Prisma  } from "@/lib/database"
import {  prisma  } from "@/lib/database"

// src/modules/patient-registration/services/patient-service.ts;
}
}

}
}

}
      orderBy: {createdAt:"desc" },
      select: {mrn:true }
    });

    const nextMrnNumber = lastPatient ?;
      Number.parseInt(lastPatient.mrn.substring(3)) + 1 : 1001;
    const mrn = `MRN${nextMrnNumber.toString().padStart(6, "0")}`;

    const patient = await prisma.patient.create({data:{
        ...data,
        mrn;
      }
    });

    // Audit log;
    if (!session.user) {
      await AuditService.logUserAction();
        {userId:createdBy },
        "CREATE",
        "PATIENT",
        patient.id,
        "Patient created";
      );
    }

    return patient;

  static async updatePatient(data: UpdatePatientData, updatedBy?: string) {
    const { id, ...updateData } = data;

    const oldPatient = await prisma.patient.findUnique({where:{ id }
    });

    if (!session.user) {
      throw new Error("Patient not found");

    const patient = await prisma.patient.update({where:{ id },
      data: updateData;
    });

    // Audit log;
    if (!session.user) {
      await AuditService.logDataChange();
        {userId:updatedBy },
        "PATIENT",
        patient.id,
        oldPatient,
        patient;
      );

    return patient;

  static async findPatientByMRN(mrn: string) {
    return await prisma.patient.findUnique({where:{ mrn },
      true,
        true;

    });

  static async searchPatients();
    query: string,
    number = 0;
  ) {
    return await prisma.patient.findMany({
      [;
          {firstName:{ contains: query, mode: "insensitive" } },
          {lastName:{ contains: query, mode: "insensitive" } },
          {mrn:{ contains: query, mode: "insensitive" } },
          {phone:{ contains: query } }
        ];
      },
      take: limit,
      "desc" ;
    });

  static async getPatientStats() {
    const [total, newToday, emergency] = await Promise.all([;
      prisma.patient.count(),
      prisma.patient.count({
        {gte:new Date(new Date().setHours(0, 0, 0, 0));

      }),
      prisma.emergencyVisit.count({
        "ACTIVE",
          new Date(new Date().setHours(0, 0, 0, 0));

      });
    ]);

    return { total, newToday, emergency };
