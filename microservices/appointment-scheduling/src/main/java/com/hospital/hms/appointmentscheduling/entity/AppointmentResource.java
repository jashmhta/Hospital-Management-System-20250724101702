package com.hospital.hms.appointmentscheduling.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Appointment Resource Entity
 * 
 * Represents resources required for healthcare appointments.
 * Includes rooms, equipment, and other facilities.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Entity
@Table(name = "appointment_resources", indexes = {
    @Index(name = "idx_resource_appointment", columnList = "appointment_id"),
    @Index(name = "idx_resource_id", columnList = "resource_id"),
    @Index(name = "idx_resource_type", columnList = "resource_type"),
    @Index(name = "idx_resource_status", columnList = "status")
})
@EntityListeners(AuditingEntityListener.class)
public class AppointmentResource {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(name = "resource_id", nullable = false)
    @NotNull(message = "Resource ID is required")
    private UUID resourceId;

    @Column(name = "resource_name", nullable = false, length = 200)
    @NotBlank(message = "Resource name is required")
    @Size(max = 200, message = "Resource name must not exceed 200 characters")
    private String resourceName;

    @Column(name = "resource_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Resource type is required")
    private ResourceType resourceType;

    @Column(name = "resource_identifier", length = 100)
    @Size(max = 100, message = "Resource identifier must not exceed 100 characters")
    private String resourceIdentifier;

    @Column(name = "location", length = 200)
    @Size(max = 200, message = "Location must not exceed 200 characters")
    private String location;

    @Column(name = "department", length = 100)
    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;

    @Column(name = "floor", length = 10)
    @Size(max = 10, message = "Floor must not exceed 10 characters")
    private String floor;

    @Column(name = "building", length = 100)
    @Size(max = 100, message = "Building must not exceed 100 characters")
    private String building;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Resource status is required")
    private ResourceStatus status;

    @Column(name = "required", nullable = false)
    private Boolean required = true;

    @Column(name = "reserved", nullable = false)
    private Boolean reserved = false;

    @Column(name = "reservation_start")
    private LocalDateTime reservationStart;

    @Column(name = "reservation_end")
    private LocalDateTime reservationEnd;

    @Column(name = "setup_time_minutes")
    @Min(value = 0, message = "Setup time must be non-negative")
    private Integer setupTimeMinutes;

    @Column(name = "cleanup_time_minutes")
    @Min(value = 0, message = "Cleanup time must be non-negative")
    private Integer cleanupTimeMinutes;

    @Column(name = "capacity")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @Column(name = "accessibility_features", columnDefinition = "TEXT")
    private String accessibilityFeatures;

    @Column(name = "equipment_specifications", columnDefinition = "TEXT")
    private String equipmentSpecifications;

    @Column(name = "usage_instructions", columnDefinition = "TEXT")
    private String usageInstructions;

    @Column(name = "maintenance_notes", columnDefinition = "TEXT")
    private String maintenanceNotes;

    @Column(name = "last_maintenance_date")
    private LocalDateTime lastMaintenanceDate;

    @Column(name = "next_maintenance_date")
    private LocalDateTime nextMaintenanceDate;

    @Column(name = "availability_start")
    private LocalDateTime availabilityStart;

    @Column(name = "availability_end")
    private LocalDateTime availabilityEnd;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "cost_per_hour")
    @DecimalMin(value = "0.0", message = "Cost per hour must be non-negative")
    private java.math.BigDecimal costPerHour;

    @Column(name = "booking_lead_time_hours")
    @Min(value = 0, message = "Booking lead time must be non-negative")
    private Integer bookingLeadTimeHours;

    @Column(name = "cancellation_lead_time_hours")
    @Min(value = 0, message = "Cancellation lead time must be non-negative")
    private Integer cancellationLeadTimeHours;

    @Column(name = "priority_booking", nullable = false)
    private Boolean priorityBooking = false;

    @Column(name = "external_booking_required", nullable = false)
    private Boolean externalBookingRequired = false;

    @Column(name = "external_booking_contact", length = 200)
    @Size(max = 200, message = "External booking contact must not exceed 200 characters")
    private String externalBookingContact;

    @Column(name = "resource_manager_id")
    private UUID resourceManagerId;

    @Column(name = "resource_manager_name", length = 200)
    @Size(max = 200, message = "Resource manager name must not exceed 200 characters")
    private String resourceManagerName;

    @Column(name = "resource_manager_contact", length = 100)
    @Size(max = 100, message = "Resource manager contact must not exceed 100 characters")
    private String resourceManagerContact;

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
    public AppointmentResource() {
        this.id = UUID.randomUUID();
    }

    public AppointmentResource(Appointment appointment, UUID resourceId, String resourceName, 
                              ResourceType resourceType) {
        this();
        this.appointment = appointment;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.resourceType = resourceType;
        this.status = ResourceStatus.AVAILABLE;
    }

    // Business Methods
    
    /**
     * Reserve the resource for the appointment
     */
    public void reserve() {
        this.reserved = true;
        this.status = ResourceStatus.RESERVED;
        this.reservationStart = appointment.getAppointmentDateTime();
        this.reservationEnd = appointment.getEndDateTime();
    }

    /**
     * Release the resource reservation
     */
    public void release() {
        this.reserved = false;
        this.status = ResourceStatus.AVAILABLE;
        this.reservationStart = null;
        this.reservationEnd = null;
    }

    /**
     * Mark resource as in use
     */
    public void markInUse() {
        this.status = ResourceStatus.IN_USE;
    }

    /**
     * Mark resource as available
     */
    public void markAvailable() {
        this.status = ResourceStatus.AVAILABLE;
        this.reserved = false;
    }

    /**
     * Mark resource as under maintenance
     */
    public void markUnderMaintenance() {
        this.status = ResourceStatus.MAINTENANCE;
        this.lastMaintenanceDate = LocalDateTime.now();
    }

    /**
     * Mark resource as out of service
     */
    public void markOutOfService() {
        this.status = ResourceStatus.OUT_OF_SERVICE;
    }

    /**
     * Check if resource is available for the given time period
     */
    public boolean isAvailableFor(LocalDateTime start, LocalDateTime end) {
        if (status != ResourceStatus.AVAILABLE) {
            return false;
        }
        
        if (availabilityStart != null && start.isBefore(availabilityStart)) {
            return false;
        }
        
        if (availabilityEnd != null && end.isAfter(availabilityEnd)) {
            return false;
        }
        
        return true;
    }

    /**
     * Check if resource needs maintenance
     */
    public boolean needsMaintenance() {
        return nextMaintenanceDate != null && 
               LocalDateTime.now().isAfter(nextMaintenanceDate);
    }

    /**
     * Calculate total reservation time including setup and cleanup
     */
    public LocalDateTime getEffectiveReservationStart() {
        if (reservationStart == null) {
            return null;
        }
        
        int totalSetupTime = setupTimeMinutes != null ? setupTimeMinutes : 0;
        return reservationStart.minusMinutes(totalSetupTime);
    }

    /**
     * Calculate total reservation end time including cleanup
     */
    public LocalDateTime getEffectiveReservationEnd() {
        if (reservationEnd == null) {
            return null;
        }
        
        int totalCleanupTime = cleanupTimeMinutes != null ? cleanupTimeMinutes : 0;
        return reservationEnd.plusMinutes(totalCleanupTime);
    }

    /**
     * Check if resource can be cancelled with the given lead time
     */
    public boolean canBeCancelled() {
        if (cancellationLeadTimeHours == null) {
            return true;
        }
        
        LocalDateTime cancellationDeadline = reservationStart.minusHours(cancellationLeadTimeHours);
        return LocalDateTime.now().isBefore(cancellationDeadline);
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }

    public UUID getResourceId() { return resourceId; }
    public void setResourceId(UUID resourceId) { this.resourceId = resourceId; }

    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }

    public ResourceType getResourceType() { return resourceType; }
    public void setResourceType(ResourceType resourceType) { this.resourceType = resourceType; }

    public String getResourceIdentifier() { return resourceIdentifier; }
    public void setResourceIdentifier(String resourceIdentifier) { this.resourceIdentifier = resourceIdentifier; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public ResourceStatus getStatus() { return status; }
    public void setStatus(ResourceStatus status) { this.status = status; }

    public Boolean getRequired() { return required; }
    public void setRequired(Boolean required) { this.required = required; }

    public Boolean getReserved() { return reserved; }
    public void setReserved(Boolean reserved) { this.reserved = reserved; }

    public LocalDateTime getReservationStart() { return reservationStart; }
    public void setReservationStart(LocalDateTime reservationStart) { this.reservationStart = reservationStart; }

    public LocalDateTime getReservationEnd() { return reservationEnd; }
    public void setReservationEnd(LocalDateTime reservationEnd) { this.reservationEnd = reservationEnd; }

    public Integer getSetupTimeMinutes() { return setupTimeMinutes; }
    public void setSetupTimeMinutes(Integer setupTimeMinutes) { this.setupTimeMinutes = setupTimeMinutes; }

    public Integer getCleanupTimeMinutes() { return cleanupTimeMinutes; }
    public void setCleanupTimeMinutes(Integer cleanupTimeMinutes) { this.cleanupTimeMinutes = cleanupTimeMinutes; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getAccessibilityFeatures() { return accessibilityFeatures; }
    public void setAccessibilityFeatures(String accessibilityFeatures) { this.accessibilityFeatures = accessibilityFeatures; }

    public String getEquipmentSpecifications() { return equipmentSpecifications; }
    public void setEquipmentSpecifications(String equipmentSpecifications) { this.equipmentSpecifications = equipmentSpecifications; }

    public String getUsageInstructions() { return usageInstructions; }
    public void setUsageInstructions(String usageInstructions) { this.usageInstructions = usageInstructions; }

    public String getMaintenanceNotes() { return maintenanceNotes; }
    public void setMaintenanceNotes(String maintenanceNotes) { this.maintenanceNotes = maintenanceNotes; }

    public LocalDateTime getLastMaintenanceDate() { return lastMaintenanceDate; }
    public void setLastMaintenanceDate(LocalDateTime lastMaintenanceDate) { this.lastMaintenanceDate = lastMaintenanceDate; }

    public LocalDateTime getNextMaintenanceDate() { return nextMaintenanceDate; }
    public void setNextMaintenanceDate(LocalDateTime nextMaintenanceDate) { this.nextMaintenanceDate = nextMaintenanceDate; }

    public LocalDateTime getAvailabilityStart() { return availabilityStart; }
    public void setAvailabilityStart(LocalDateTime availabilityStart) { this.availabilityStart = availabilityStart; }

    public LocalDateTime getAvailabilityEnd() { return availabilityEnd; }
    public void setAvailabilityEnd(LocalDateTime availabilityEnd) { this.availabilityEnd = availabilityEnd; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public java.math.BigDecimal getCostPerHour() { return costPerHour; }
    public void setCostPerHour(java.math.BigDecimal costPerHour) { this.costPerHour = costPerHour; }

    public Integer getBookingLeadTimeHours() { return bookingLeadTimeHours; }
    public void setBookingLeadTimeHours(Integer bookingLeadTimeHours) { this.bookingLeadTimeHours = bookingLeadTimeHours; }

    public Integer getCancellationLeadTimeHours() { return cancellationLeadTimeHours; }
    public void setCancellationLeadTimeHours(Integer cancellationLeadTimeHours) { this.cancellationLeadTimeHours = cancellationLeadTimeHours; }

    public Boolean getPriorityBooking() { return priorityBooking; }
    public void setPriorityBooking(Boolean priorityBooking) { this.priorityBooking = priorityBooking; }

    public Boolean getExternalBookingRequired() { return externalBookingRequired; }
    public void setExternalBookingRequired(Boolean externalBookingRequired) { this.externalBookingRequired = externalBookingRequired; }

    public String getExternalBookingContact() { return externalBookingContact; }
    public void setExternalBookingContact(String externalBookingContact) { this.externalBookingContact = externalBookingContact; }

    public UUID getResourceManagerId() { return resourceManagerId; }
    public void setResourceManagerId(UUID resourceManagerId) { this.resourceManagerId = resourceManagerId; }

    public String getResourceManagerName() { return resourceManagerName; }
    public void setResourceManagerName(String resourceManagerName) { this.resourceManagerName = resourceManagerName; }

    public String getResourceManagerContact() { return resourceManagerContact; }
    public void setResourceManagerContact(String resourceManagerContact) { this.resourceManagerContact = resourceManagerContact; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AppointmentResource)) return false;
        AppointmentResource that = (AppointmentResource) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "AppointmentResource{" +
                "id=" + id +
                ", resourceName='" + resourceName + '\'' +
                ", resourceType=" + resourceType +
                ", status=" + status +
                ", reserved=" + reserved +
                '}';
    }
}
