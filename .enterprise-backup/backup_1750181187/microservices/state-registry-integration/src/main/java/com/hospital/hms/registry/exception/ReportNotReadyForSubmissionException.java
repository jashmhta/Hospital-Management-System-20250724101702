package com.hospital.hms.registry.exception;

/**
 * Exception thrown when a report is not ready for submission
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class ReportNotReadyForSubmissionException extends RuntimeException {

    public ReportNotReadyForSubmissionException(String message) {
        super(message);
    }

    public ReportNotReadyForSubmissionException(String message, Throwable cause) {
        super(message, cause);
    }
}
