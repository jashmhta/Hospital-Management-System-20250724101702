package com.hms.patientportal.exception;

/**
 * Base Patient Portal Exception
 * 
 * Root exception class for all patient portal related exceptions
 */
public class PatientPortalException extends RuntimeException {

    private String errorCode;
    private Object[] errorArgs;

    public PatientPortalException(String message) {
        super(message);
    }

    public PatientPortalException(String message, Throwable cause) {
        super(message, cause);
    }

    public PatientPortalException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public PatientPortalException(String message, String errorCode, Object... errorArgs) {
        super(message);
        this.errorCode = errorCode;
        this.errorArgs = errorArgs;
    }

    public PatientPortalException(String message, Throwable cause, String errorCode) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public Object[] getErrorArgs() {
        return errorArgs;
    }
}
