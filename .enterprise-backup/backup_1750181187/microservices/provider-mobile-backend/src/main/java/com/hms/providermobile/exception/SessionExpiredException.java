package com.hms.providermobile.exception;

/**
 * Session Expired Exception
 * 
 * Thrown when a mobile session has expired or is no longer valid.
 * Requires the user to re-authenticate.
 */
public class SessionExpiredException extends ProviderMobileException {

    public SessionExpiredException(String message) {
        super("SESSION_EXPIRED", message, "Your session has expired. Please log in again.");
    }

    public SessionExpiredException(String message, Throwable cause) {
        super("SESSION_EXPIRED", message, "Your session has expired. Please log in again.", cause);
    }
}
