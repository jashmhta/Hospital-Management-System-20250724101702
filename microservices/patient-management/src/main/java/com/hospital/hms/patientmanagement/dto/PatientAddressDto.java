package com.hospital.hms.patientmanagement.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * DTO for patient address information
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Schema(description = "Patient address information")
public class PatientAddressDto {

    @Schema(description = "Address unique identifier")
    private UUID id;

    @Schema(description = "Address use type", example = "home", allowableValues = {"home", "work", "temp", "billing"})
    @Size(max = 20, message = "Address use must not exceed 20 characters")
    private String use;

    @Schema(description = "Address type", example = "physical", allowableValues = {"postal", "physical", "both"})
    @Size(max = 20, message = "Address type must not exceed 20 characters")
    private String type;

    @Schema(description = "Street address line 1", example = "123 Main Street", required = true)
    @NotBlank(message = "Street address line 1 is required")
    @Size(max = 255, message = "Street address line 1 must not exceed 255 characters")
    private String line1;

    @Schema(description = "Street address line 2", example = "Apt 4B")
    @Size(max = 255, message = "Street address line 2 must not exceed 255 characters")
    private String line2;

    @Schema(description = "City", example = "Springfield", required = true)
    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Schema(description = "State or province", example = "IL", required = true)
    @NotBlank(message = "State is required")
    @Size(max = 50, message = "State must not exceed 50 characters")
    private String state;

    @Schema(description = "Postal code", example = "62701", required = true)
    @NotBlank(message = "Postal code is required")
    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    private String postalCode;

    @Schema(description = "Country", example = "US")
    @Size(max = 50, message = "Country must not exceed 50 characters")
    private String country;

    @Schema(description = "Whether this is the primary address", example = "true")
    private Boolean primary = false;

    @Schema(description = "Period when address was/is in use")
    private String period;

    // Constructors
    public PatientAddressDto() {}

    public PatientAddressDto(String use, String line1, String city, String state, String postalCode) {
        this.use = use;
        this.line1 = line1;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUse() {
        return use;
    }

    public void setUse(String use) {
        this.use = use;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLine1() {
        return line1;
    }

    public void setLine1(String line1) {
        this.line1 = line1;
    }

    public String getLine2() {
        return line2;
    }

    public void setLine2(String line2) {
        this.line2 = line2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Boolean getPrimary() {
        return primary;
    }

    public void setPrimary(Boolean primary) {
        this.primary = primary;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }
}
