package com.hospital.hms.pacs.entity;

/**
 * DICOM Modality enumeration for medical imaging types
 * Based on DICOM standard modalities
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public enum DicomModality {
    CT,         // Computed Tomography
    MR,         // Magnetic Resonance
    XA,         // X-Ray Angiography
    CR,         // Computed Radiography
    DX,         // Digital Radiography
    MG,         // Mammography
    US,         // Ultrasound
    NM,         // Nuclear Medicine
    PT,         // Positron Emission Tomography
    RF,         // Radio Fluoroscopy
    SC,         // Secondary Capture
    OT,         // Other
    ES,         // Endoscopy
    XC,         // External-camera Photography
    GM,         // General Microscopy
    IO,         // Intra-Oral Radiography
    PX,         // Panoramic X-Ray
    RG,         // Radiographic imaging
    SM,         // Slide Microscopy
    TG,         // Thermography
    RTIMAGE,    // Radiotherapy Image
    RTDOSE,     // Radiotherapy Dose
    RTSTRUCT,   // Radiotherapy Structure Set
    RTPLAN,     // Radiotherapy Plan
    RTRECORD,   // RT Treatment Record
    HC,         // Hard Copy
    DG,         // Diaphanography
    LS,         // Laser surface scan
    VL,         // Visible Light
    AU,         // Audio
    EPS,        // Cardiac Electrophysiology
    HD,         // Hemodynamic Waveform
    SR,         // SR Document
    IVUS,       // Intravascular Ultrasound
    OP,         // Ophthalmic Photography
    OST,        // Optical Surface Topography
    EC          // Echocardiography
}

/**
 * Study Status enumeration for DICOM study lifecycle
 */
enum StudyStatus {
    SCHEDULED,
    ARRIVED,
    READY,
    STARTED,
    COMPLETED,
    DISCONTINUED,
    CANCELLED,
    UNKNOWN
}

/**
 * Study Priority enumeration
 */
enum StudyPriority {
    ROUTINE,
    HIGH,
    URGENT,
    STAT,
    ASAP,
    CALLBACK
}

/**
 * Archive Status enumeration for storage lifecycle
 */
enum ArchiveStatus {
    ONLINE,
    NEARLINE,
    ARCHIVED,
    PURGED,
    LOST
}

/**
 * Workflow State enumeration for study processing
 */
enum WorkflowState {
    RECEIVED,
    PENDING_REVIEW,
    IN_REVIEW,
    REVIEWED,
    APPROVED,
    REJECTED,
    FINALIZED,
    DISTRIBUTED
}