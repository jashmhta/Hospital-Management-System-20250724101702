package com.hospital.hms.patientmanagement.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Cache configuration for Patient Management Service
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Redis Cache Manager configuration
     */
    @Bean
    @Primary
    public CacheManager redisCacheManager(RedisConnectionFactory redisConnectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .entryTtl(Duration.ofHours(1))
                .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // Patient cache - 30 minutes TTL
        cacheConfigurations.put("patients", defaultConfig
                .entryTtl(Duration.ofMinutes(30)));
        
        // Patient search cache - 5 minutes TTL
        cacheConfigurations.put("patientSearch", defaultConfig
                .entryTtl(Duration.ofMinutes(5)));
        
        // Statistics cache - 1 hour TTL
        cacheConfigurations.put("patientStatistics", defaultConfig
                .entryTtl(Duration.ofHours(1)));
        
        // MRN existence cache - 24 hours TTL
        cacheConfigurations.put("mrnExists", defaultConfig
                .entryTtl(Duration.ofHours(24)));

        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }

    /**
     * Fallback in-memory cache manager for development/testing
     */
    @Bean("inMemoryCacheManager")
    public CacheManager inMemoryCacheManager() {
        return new ConcurrentMapCacheManager(
                "patients", 
                "patientSearch", 
                "patientStatistics", 
                "mrnExists"
        );
    }
}
