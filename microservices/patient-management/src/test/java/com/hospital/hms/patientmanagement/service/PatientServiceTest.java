package com.hospital.hms.patientmanagement.service;

import com.hospital.hms.patientmanagement.dto.PatientCreateRequestDto;
import com.hospital.hms.patientmanagement.dto.PatientResponseDto;
import com.hospital.hms.patientmanagement.entity.Gender;
import com.hospital.hms.patientmanagement.entity.MaritalStatus;
import com.hospital.hms.patientmanagement.entity.Patient;
import com.hospital.hms.patientmanagement.exception.PatientNotFoundException;
import com.hospital.hms.patientmanagement.mapper.PatientMapper;
import com.hospital.hms.patientmanagement.repository.PatientRepository;
import com.hospital.hms.patientmanagement.service.impl.PatientServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for PatientService
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private PatientMapper patientMapper;

    @InjectMocks
    private PatientServiceImpl patientService;

    private Patient testPatient;
    private PatientCreateRequestDto createRequest;
    private PatientResponseDto responseDto;

    @BeforeEach
    void setUp() {
        // Setup test patient entity
        testPatient = new Patient();
        testPatient.setId(UUID.randomUUID());
        testPatient.setMedicalRecordNumber("MRN202501010001");
        testPatient.setFamilyName("Smith");
        testPatient.setGivenName("John");
        testPatient.setDateOfBirth(LocalDate.of(1990, 5, 15));
        testPatient.setGender(Gender.MALE);
        testPatient.setMaritalStatus(MaritalStatus.SINGLE);
        testPatient.setActive(true);
        testPatient.setEmail("john.smith@email.com");
        testPatient.setPhonePrimary("+1-555-123-4567");

        // Setup create request DTO
        createRequest = new PatientCreateRequestDto();
        createRequest.setFamilyName("Smith");
        createRequest.setGivenName("John");
        createRequest.setDateOfBirth(LocalDate.of(1990, 5, 15));
        createRequest.setGender(Gender.MALE);
        createRequest.setMaritalStatus(MaritalStatus.SINGLE);
        createRequest.setEmail("john.smith@email.com");
        createRequest.setPhonePrimary("+1-555-123-4567");

        // Setup response DTO
        responseDto = new PatientResponseDto();
        responseDto.setId(testPatient.getId());
        responseDto.setMedicalRecordNumber(testPatient.getMedicalRecordNumber());
        responseDto.setFamilyName(testPatient.getFamilyName());
        responseDto.setGivenName(testPatient.getGivenName());
        responseDto.setDateOfBirth(testPatient.getDateOfBirth());
        responseDto.setGender(testPatient.getGender());
        responseDto.setMaritalStatus(testPatient.getMaritalStatus());
        responseDto.setActive(testPatient.getActive());
        responseDto.setEmail(testPatient.getEmail());
        responseDto.setPhonePrimary(testPatient.getPhonePrimary());
        responseDto.setFullName("John Smith");
        responseDto.setAge(33);
    }

    @Test
    void createPatient_Success() {
        // Arrange
        when(patientMapper.toEntity(createRequest)).thenReturn(testPatient);
        when(patientRepository.existsByMedicalRecordNumber(anyString())).thenReturn(false);
        when(patientRepository.save(any(Patient.class))).thenReturn(testPatient);
        when(patientMapper.toResponseDto(testPatient)).thenReturn(responseDto);

        // Act
        PatientResponseDto result = patientService.createPatient(createRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Smith", result.getFamilyName());
        assertEquals("John", result.getGivenName());
        assertEquals("john.smith@email.com", result.getEmail());
        assertTrue(result.getActive());

        verify(patientRepository).save(any(Patient.class));
        verify(patientMapper).toEntity(createRequest);
        verify(patientMapper).toResponseDto(testPatient);
    }

    @Test
    void getPatientById_Success() {
        // Arrange
        UUID patientId = testPatient.getId();
        when(patientRepository.findById(patientId)).thenReturn(Optional.of(testPatient));
        when(patientMapper.toResponseDto(testPatient)).thenReturn(responseDto);

        // Act
        PatientResponseDto result = patientService.getPatientById(patientId);

        // Assert
        assertNotNull(result);
        assertEquals(patientId, result.getId());
        assertEquals("Smith", result.getFamilyName());
        assertEquals("John", result.getGivenName());

        verify(patientRepository).findById(patientId);
        verify(patientMapper).toResponseDto(testPatient);
    }

    @Test
    void getPatientById_NotFound() {
        // Arrange
        UUID patientId = UUID.randomUUID();
        when(patientRepository.findById(patientId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PatientNotFoundException.class, () -> {
            patientService.getPatientById(patientId);
        });

        verify(patientRepository).findById(patientId);
        verify(patientMapper, never()).toResponseDto(any());
    }

    @Test
    void getPatientByMrn_Success() {
        // Arrange
        String mrn = testPatient.getMedicalRecordNumber();
        when(patientRepository.findByMedicalRecordNumber(mrn)).thenReturn(Optional.of(testPatient));
        when(patientMapper.toResponseDto(testPatient)).thenReturn(responseDto);

        // Act
        PatientResponseDto result = patientService.getPatientByMrn(mrn);

        // Assert
        assertNotNull(result);
        assertEquals(mrn, result.getMedicalRecordNumber());
        assertEquals("Smith", result.getFamilyName());
        assertEquals("John", result.getGivenName());

        verify(patientRepository).findByMedicalRecordNumber(mrn);
        verify(patientMapper).toResponseDto(testPatient);
    }

    @Test
    void getPatientByMrn_NotFound() {
        // Arrange
        String mrn = "NONEXISTENT";
        when(patientRepository.findByMedicalRecordNumber(mrn)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PatientNotFoundException.class, () -> {
            patientService.getPatientByMrn(mrn);
        });

        verify(patientRepository).findByMedicalRecordNumber(mrn);
        verify(patientMapper, never()).toResponseDto(any());
    }

    @Test
    void generateMedicalRecordNumber_Success() {
        // Arrange
        when(patientRepository.existsByMedicalRecordNumber(anyString())).thenReturn(false);

        // Act
        String result = patientService.generateMedicalRecordNumber();

        // Assert
        assertNotNull(result);
        assertTrue(result.startsWith("MRN"));
        assertTrue(result.length() > 10);

        verify(patientRepository, atLeastOnce()).existsByMedicalRecordNumber(anyString());
    }

    @Test
    void medicalRecordNumberExists_True() {
        // Arrange
        String mrn = "MRN202501010001";
        when(patientRepository.existsByMedicalRecordNumber(mrn)).thenReturn(true);

        // Act
        boolean result = patientService.medicalRecordNumberExists(mrn);

        // Assert
        assertTrue(result);

        verify(patientRepository).existsByMedicalRecordNumber(mrn);
    }

    @Test
    void medicalRecordNumberExists_False() {
        // Arrange
        String mrn = "NONEXISTENT";
        when(patientRepository.existsByMedicalRecordNumber(mrn)).thenReturn(false);

        // Act
        boolean result = patientService.medicalRecordNumberExists(mrn);

        // Assert
        assertFalse(result);

        verify(patientRepository).existsByMedicalRecordNumber(mrn);
    }

    @Test
    void emailExists_True() {
        // Arrange
        String email = "john.smith@email.com";
        when(patientRepository.existsByEmail(email)).thenReturn(true);

        // Act
        boolean result = patientService.emailExists(email);

        // Assert
        assertTrue(result);

        verify(patientRepository).existsByEmail(email);
    }

    @Test
    void emailExists_False() {
        // Arrange
        String email = "nonexistent@email.com";
        when(patientRepository.existsByEmail(email)).thenReturn(false);

        // Act
        boolean result = patientService.emailExists(email);

        // Assert
        assertFalse(result);

        verify(patientRepository).existsByEmail(email);
    }

    @Test
    void deactivatePatient_Success() {
        // Arrange
        UUID patientId = testPatient.getId();
        when(patientRepository.findById(patientId)).thenReturn(Optional.of(testPatient));
        when(patientRepository.save(any(Patient.class))).thenReturn(testPatient);
        when(patientMapper.toResponseDto(any(Patient.class))).thenReturn(responseDto);

        // Act
        PatientResponseDto result = patientService.deactivatePatient(patientId);

        // Assert
        assertNotNull(result);
        assertFalse(testPatient.getActive()); // Verify patient was deactivated

        verify(patientRepository).findById(patientId);
        verify(patientRepository).save(testPatient);
        verify(patientMapper).toResponseDto(testPatient);
    }

    @Test
    void reactivatePatient_Success() {
        // Arrange
        UUID patientId = testPatient.getId();
        testPatient.setActive(false); // Start with inactive patient
        when(patientRepository.findById(patientId)).thenReturn(Optional.of(testPatient));
        when(patientRepository.save(any(Patient.class))).thenReturn(testPatient);
        when(patientMapper.toResponseDto(any(Patient.class))).thenReturn(responseDto);

        // Act
        PatientResponseDto result = patientService.reactivatePatient(patientId);

        // Assert
        assertNotNull(result);
        assertTrue(testPatient.getActive()); // Verify patient was reactivated

        verify(patientRepository).findById(patientId);
        verify(patientRepository).save(testPatient);
        verify(patientMapper).toResponseDto(testPatient);
    }
}
