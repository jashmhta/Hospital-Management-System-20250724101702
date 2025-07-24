package com.hospital.hms.graphql.controller;

import com.hospital.hms.graphql.dto.SchemaRegistrationDto;
import com.hospital.hms.graphql.dto.FederationStatsDto;
import com.hospital.hms.graphql.service.GraphQLFederationService;
import graphql.ExecutionResult;
import io.micrometer.core.annotation.Timed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SubscriptionMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * GraphQL Federation Controller
 * 
 * Provides REST and GraphQL endpoints for managing the federation gateway.
 * Handles schema federation, query routing, and real-time subscriptions.
 * 
 * Features:
 * - Unified GraphQL API across all microservices
 * - Schema stitching and federation
 * - Real-time subscriptions via WebSocket
 * - Query optimization and caching
 * - Load balancing and circuit breakers
 * - Performance monitoring and analytics
 * - Security and authentication
 * - Error handling and debugging
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/graphql")
@RequiredArgsConstructor
public class GraphQLFederationController {

    private final GraphQLFederationService federationService;

    /**
     * Execute GraphQL query
     */
    @PostMapping("/query")
    @Timed(value = "graphql.federation.query", description = "Time taken to execute GraphQL query")
    public Mono<ResponseEntity<ExecutionResult>> executeQuery(
            @RequestBody Map<String, Object> request) {
        
        String query = (String) request.get("query");
        Map<String, Object> variables = (Map<String, Object>) request.get("variables");
        String operationName = (String) request.get("operationName");
        
        log.info("Executing GraphQL query - Operation: {}", operationName);
        
        return federationService.executeQuery(query, variables, operationName)
                .map(result -> {
                    log.info("GraphQL query executed successfully");
                    return ResponseEntity.ok(result);
                })
                .onErrorResume(error -> {
                    log.error("Error executing GraphQL query", error);
                    return Mono.just(ResponseEntity.badRequest().build());
                });
    }

    /**
     * Register a new service schema with the federation
     */
    @PostMapping("/schemas/register")
    @PreAuthorize("hasRole('ADMIN')")
    @Timed(value = "graphql.federation.schema.register", description = "Time taken to register schema")
    public ResponseEntity<Void> registerSchema(@Valid @RequestBody SchemaRegistrationDto schemaDto) {
        log.info("Registering schema for service: {}", schemaDto.getServiceName());
        
        federationService.registerSchema(schemaDto);
        
        log.info("Successfully registered schema for service: {}", schemaDto.getServiceName());
        return ResponseEntity.ok().build();
    }

    /**
     * Update existing service schema
     */
    @PutMapping("/schemas/{serviceName}")
    @PreAuthorize("hasRole('ADMIN')")
    @Timed(value = "graphql.federation.schema.update", description = "Time taken to update schema")
    public ResponseEntity<Void> updateSchema(
            @PathVariable String serviceName,
            @Valid @RequestBody SchemaRegistrationDto schemaDto) {
        log.info("Updating schema for service: {}", serviceName);
        
        federationService.updateSchema(serviceName, schemaDto);
        
        log.info("Successfully updated schema for service: {}", serviceName);
        return ResponseEntity.ok().build();
    }

    /**
     * Unregister service schema from federation
     */
    @DeleteMapping("/schemas/{serviceName}")
    @PreAuthorize("hasRole('ADMIN')")
    @Timed(value = "graphql.federation.schema.unregister", description = "Time taken to unregister schema")
    public ResponseEntity<Void> unregisterSchema(@PathVariable String serviceName) {
        log.info("Unregistering schema for service: {}", serviceName);
        
        federationService.unregisterSchema(serviceName);
        
        log.info("Successfully unregistered schema for service: {}", serviceName);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all registered schemas
     */
    @GetMapping("/schemas")
    @Timed(value = "graphql.federation.schemas.list", description = "Time taken to list schemas")
    public ResponseEntity<List<SchemaRegistrationDto>> getAllSchemas() {
        log.info("Fetching all registered schemas");
        
        List<SchemaRegistrationDto> schemas = federationService.getAllSchemas();
        
        log.info("Retrieved {} registered schemas", schemas.size());
        return ResponseEntity.ok(schemas);
    }

    /**
     * Get federated schema SDL
     */
    @GetMapping("/schema/sdl")
    @Timed(value = "graphql.federation.schema.sdl", description = "Time taken to get schema SDL")
    public ResponseEntity<String> getFederatedSchemaSDL() {
        log.info("Fetching federated schema SDL");
        
        String sdl = federationService.getFederatedSchemaSDL();
        
        log.info("Retrieved federated schema SDL");
        return ResponseEntity.ok(sdl);
    }

    /**
     * Get federation statistics and health metrics
     */
    @GetMapping("/stats")
    @Timed(value = "graphql.federation.stats", description = "Time taken to get federation stats")
    public ResponseEntity<FederationStatsDto> getFederationStats() {
        log.info("Fetching federation statistics");
        
        FederationStatsDto stats = federationService.getFederationStatistics();
        
        log.info("Retrieved federation statistics");
        return ResponseEntity.ok(stats);
    }

    /**
     * Validate federated schema
     */
    @PostMapping("/schema/validate")
    @PreAuthorize("hasRole('ADMIN')")
    @Timed(value = "graphql.federation.schema.validate", description = "Time taken to validate schema")
    public ResponseEntity<Map<String, Object>> validateFederatedSchema() {
        log.info("Validating federated schema");
        
        Map<String, Object> validation = federationService.validateFederatedSchema();
        
        log.info("Schema validation completed");
        return ResponseEntity.ok(validation);
    }

    /**
     * Refresh federation cache
     */
    @PostMapping("/cache/refresh")
    @PreAuthorize("hasRole('ADMIN')")
    @Timed(value = "graphql.federation.cache.refresh", description = "Time taken to refresh cache")
    public ResponseEntity<Map<String, Object>> refreshCache() {
        log.info("Refreshing federation cache");
        
        Map<String, Object> result = federationService.refreshCache();
        
        log.info("Federation cache refreshed successfully");
        return ResponseEntity.ok(result);
    }

    /**
     * Get query execution plan
     */
    @PostMapping("/query/plan")
    @Timed(value = "graphql.federation.query.plan", description = "Time taken to get query plan")
    public ResponseEntity<Map<String, Object>> getQueryExecutionPlan(
            @RequestBody Map<String, Object> request) {
        
        String query = (String) request.get("query");
        Map<String, Object> variables = (Map<String, Object>) request.get("variables");
        
        log.info("Generating query execution plan");
        
        Map<String, Object> plan = federationService.getQueryExecutionPlan(query, variables);
        
        log.info("Query execution plan generated");
        return ResponseEntity.ok(plan);
    }

    // GraphQL Queries and Mutations

    /**
     * GraphQL Query: Get patient information
     */
    @QueryMapping
    public Mono<Map<String, Object>> patient(@Argument String id) {
        log.info("Fetching patient with ID: {}", id);
        return federationService.getPatient(id);
    }

    /**
     * GraphQL Query: Search patients
     */
    @QueryMapping
    public Mono<List<Map<String, Object>>> searchPatients(
            @Argument String searchTerm,
            @Argument Integer limit,
            @Argument Integer offset) {
        log.info("Searching patients with term: {}, limit: {}, offset: {}", searchTerm, limit, offset);
        return federationService.searchPatients(searchTerm, limit, offset);
    }

    /**
     * GraphQL Query: Get appointment information
     */
    @QueryMapping
    public Mono<Map<String, Object>> appointment(@Argument String id) {
        log.info("Fetching appointment with ID: {}", id);
        return federationService.getAppointment(id);
    }

    /**
     * GraphQL Query: Get doctor information
     */
    @QueryMapping
    public Mono<Map<String, Object>> doctor(@Argument String id) {
        log.info("Fetching doctor with ID: {}", id);
        return federationService.getDoctor(id);
    }

    /**
     * GraphQL Query: Get medical record
     */
    @QueryMapping
    public Mono<Map<String, Object>> medicalRecord(@Argument String patientId) {
        log.info("Fetching medical record for patient: {}", patientId);
        return federationService.getMedicalRecord(patientId);
    }

    /**
     * GraphQL Mutation: Create appointment
     */
    @MutationMapping
    public Mono<Map<String, Object>> createAppointment(@Argument Map<String, Object> appointment) {
        log.info("Creating new appointment");
        return federationService.createAppointment(appointment);
    }

    /**
     * GraphQL Mutation: Update patient
     */
    @MutationMapping
    public Mono<Map<String, Object>> updatePatient(
            @Argument String id,
            @Argument Map<String, Object> patient) {
        log.info("Updating patient with ID: {}", id);
        return federationService.updatePatient(id, patient);
    }

    /**
     * GraphQL Mutation: Cancel appointment
     */
    @MutationMapping
    public Mono<Boolean> cancelAppointment(@Argument String id, @Argument String reason) {
        log.info("Cancelling appointment with ID: {}", id);
        return federationService.cancelAppointment(id, reason);
    }

    // GraphQL Subscriptions

    /**
     * GraphQL Subscription: Real-time appointment updates
     */
    @SubscriptionMapping
    public Flux<Map<String, Object>> appointmentUpdates(@Argument String patientId) {
        log.info("Starting appointment updates subscription for patient: {}", patientId);
        return federationService.subscribeToAppointmentUpdates(patientId);
    }

    /**
     * GraphQL Subscription: Real-time patient vitals
     */
    @SubscriptionMapping
    public Flux<Map<String, Object>> patientVitals(@Argument String patientId) {
        log.info("Starting patient vitals subscription for patient: {}", patientId);
        return federationService.subscribeToPatientVitals(patientId);
    }

    /**
     * GraphQL Subscription: Real-time notifications
     */
    @SubscriptionMapping
    public Flux<Map<String, Object>> notifications(@Argument String userId) {
        log.info("Starting notifications subscription for user: {}", userId);
        return federationService.subscribeToNotifications(userId);
    }

    /**
     * GraphQL Subscription: Real-time bed availability
     */
    @SubscriptionMapping
    public Flux<Map<String, Object>> bedAvailability(@Argument String wardId) {
        log.info("Starting bed availability subscription for ward: {}", wardId);
        return federationService.subscribeToBedAvailability(wardId);
    }

    /**
     * GraphQL Subscription: Real-time emergency alerts
     */
    @SubscriptionMapping
    public Flux<Map<String, Object>> emergencyAlerts(@Argument String department) {
        log.info("Starting emergency alerts subscription for department: {}", department);
        return federationService.subscribeToEmergencyAlerts(department);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = federationService.getHealth();
        return ResponseEntity.ok(health);
    }

    /**
     * Get federation metrics
     */
    @GetMapping("/metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        Map<String, Object> metrics = federationService.getMetrics();
        return ResponseEntity.ok(metrics);
    }
}
