package com.hospital.hms.patientmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Patient Address Entity
 * 
 * Represents a patient's address information.
 * Based on FHIR R4 Address data type.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "patient_addresses", indexes = {
    @Index(name = "idx_address_patient", columnList = "patient_id"),
    @Index(name = "idx_address_type", columnList = "address_type"),
    @Index(name = "idx_address_primary", columnList = "is_primary"),
    @Index(name = "idx_address_postal", columnList = "postal_code")
})
@EntityListeners(AuditingEntityListener.class)
public class PatientAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "address_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Address type is required")
    private AddressType addressType;

    @Column(name = "is_primary", nullable = false)
    private Boolean primary = false;

    @Column(name = "address_line_1", nullable = false, length = 200)
    @NotBlank(message = "Address line 1 is required")
    @Size(max = 200, message = "Address line 1 must not exceed 200 characters")
    private String addressLine1;

    @Column(name = "address_line_2", length = 200)
    @Size(max = 200, message = "Address line 2 must not exceed 200 characters")
    private String addressLine2;

    @Column(name = "city", nullable = false, length = 100)
    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Column(name = "state_province", length = 100)
    @Size(max = 100, message = "State/Province must not exceed 100 characters")
    private String stateProvince;

    @Column(name = "postal_code", length = 20)
    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    private String postalCode;

    @Column(name = "country", nullable = false, length = 100)
    @NotBlank(message = "Country is required")
    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    @Column(name = "district", length = 100)
    @Size(max = 100, message = "District must not exceed 100 characters")
    private String district;

    @Column(name = "period_start")
    private LocalDateTime periodStart;

    @Column(name = "period_end")
    private LocalDateTime periodEnd;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    // Audit fields
    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @Version
    @Column(name = "version")
    private Long version;

    // Constructors
    public PatientAddress() {
        this.id = UUID.randomUUID();
    }

    public PatientAddress(Patient patient, AddressType addressType, String addressLine1, String city, String country) {
        this();
        this.patient = patient;
        this.addressType = addressType;
        this.addressLine1 = addressLine1;
        this.city = city;
        this.country = country;
    }

    // Business Methods
    
    /**
     * Get formatted address as a single string
     */
    public String getFormattedAddress() {
        StringBuilder formatted = new StringBuilder();
        
        if (addressLine1 != null && !addressLine1.trim().isEmpty()) {
            formatted.append(addressLine1);
        }
        
        if (addressLine2 != null && !addressLine2.trim().isEmpty()) {
            if (formatted.length() > 0) formatted.append(", ");
            formatted.append(addressLine2);
        }
        
        if (city != null && !city.trim().isEmpty()) {
            if (formatted.length() > 0) formatted.append(", ");
            formatted.append(city);
        }
        
        if (stateProvince != null && !stateProvince.trim().isEmpty()) {
            if (formatted.length() > 0) formatted.append(", ");
            formatted.append(stateProvince);
        }
        
        if (postalCode != null && !postalCode.trim().isEmpty()) {
            if (formatted.length() > 0) formatted.append(" ");
            formatted.append(postalCode);
        }
        
        if (country != null && !country.trim().isEmpty()) {
            if (formatted.length() > 0) formatted.append(", ");
            formatted.append(country);
        }
        
        return formatted.toString();
    }

    /**
     * Check if address is currently valid based on period
     */
    public boolean isCurrentlyValid() {
        LocalDateTime now = LocalDateTime.now();
        
        if (periodStart != null && now.isBefore(periodStart)) {
            return false;
        }
        
        if (periodEnd != null && now.isAfter(periodEnd)) {
            return false;
        }
        
        return active;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public AddressType getAddressType() { return addressType; }
    public void setAddressType(AddressType addressType) { this.addressType = addressType; }

    public Boolean isPrimary() { return primary; }
    public void setPrimary(Boolean primary) { this.primary = primary; }

    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }

    public String getAddressLine2() { return addressLine2; }
    public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getStateProvince() { return stateProvince; }
    public void setStateProvince(String stateProvince) { this.stateProvince = stateProvince; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public LocalDateTime getPeriodStart() { return periodStart; }
    public void setPeriodStart(LocalDateTime periodStart) { this.periodStart = periodStart; }

    public LocalDateTime getPeriodEnd() { return periodEnd; }
    public void setPeriodEnd(LocalDateTime periodEnd) { this.periodEnd = periodEnd; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PatientAddress)) return false;
        PatientAddress that = (PatientAddress) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "PatientAddress{" +
                "id=" + id +
                ", addressType=" + addressType +
                ", primary=" + primary +
                ", formattedAddress='" + getFormattedAddress() + '\'' +
                '}';
    }
}

/**
 * Address Type enumeration based on FHIR R4 Address Use value set
 */
enum AddressType {
    HOME("home", "Home"),
    WORK("work", "Work"),
    TEMP("temp", "Temporary"),
    OLD("old", "Old/Incorrect"),
    BILLING("billing", "Billing");

    private final String code;
    private final String display;

    AddressType(String code, String display) {
        this.code = code;
        this.display = display;
    }

    public String getCode() {
        return code;
    }

    public String getDisplay() {
        return display;
    }

    public static AddressType fromCode(String code) {
        for (AddressType type : AddressType.values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown address type code: " + code);
    }
}
