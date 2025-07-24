package com.hospital.hms.servicediscovery.repository;

import com.hospital.hms.servicediscovery.entity.ServiceMetadataEntity;
import com.hospital.hms.servicediscovery.entity.ServiceRegistryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Service Metadata Repository
 * 
 * Repository for managing service metadata and custom properties.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Repository
public interface ServiceMetadataRepository extends JpaRepository<ServiceMetadataEntity, String> {

    /**
     * Find all metadata for a service
     */
    List<ServiceMetadataEntity> findByServiceRegistry(ServiceRegistryEntity serviceRegistry);

    /**
     * Find metadata by key for a service
     */
    Optional<ServiceMetadataEntity> findByServiceRegistryAndMetadataKey(
            ServiceRegistryEntity serviceRegistry, String metadataKey);

    /**
     * Find metadata by type
     */
    List<ServiceMetadataEntity> findByMetadataType(String metadataType);

    /**
     * Find services with specific metadata key
     */
    @Query("SELECT DISTINCT m.serviceRegistry FROM ServiceMetadataEntity m WHERE m.metadataKey = :key")
    List<ServiceRegistryEntity> findServicesByMetadataKey(@Param("key") String key);

    /**
     * Find services with metadata key-value pair
     */
    @Query("SELECT DISTINCT m.serviceRegistry FROM ServiceMetadataEntity m " +
           "WHERE m.metadataKey = :key AND m.metadataValue = :value")
    List<ServiceRegistryEntity> findServicesByMetadataKeyValue(
            @Param("key") String key, 
            @Param("value") String value);

    /**
     * Count metadata entries by type
     */
    @Query("SELECT m.metadataType, COUNT(m) FROM ServiceMetadataEntity m GROUP BY m.metadataType")
    List<Object[]> countMetadataByType();

    /**
     * Find metadata by value pattern
     */
    @Query("SELECT m FROM ServiceMetadataEntity m WHERE m.metadataValue LIKE %:pattern%")
    List<ServiceMetadataEntity> findByMetadataValuePattern(@Param("pattern") String pattern);
}
