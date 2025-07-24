package com.hms.analytics.exception;

/**
 * Data Ingestion Exception
 */
public class DataIngestionException extends AnalyticsException {

    public DataIngestionException(String message) {
        super(message);
    }

    public DataIngestionException(String message, Throwable cause) {
        super(message, cause);
    }

    public DataIngestionException(String errorCode, String message) {
        super(errorCode, message);
    }

    public DataIngestionException(String errorCode, String message, Throwable cause) {
        super(errorCode, message, cause);
    }
}
