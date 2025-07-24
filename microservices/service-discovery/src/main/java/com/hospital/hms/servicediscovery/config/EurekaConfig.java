package com.hospital.hms.servicediscovery.config;

import com.netflix.eureka.EurekaServerConfig;
import com.netflix.eureka.cluster.PeerEurekaNode;
import com.netflix.eureka.registry.PeerAwareInstanceRegistry;
import com.netflix.eureka.resources.DefaultServerCodecs;
import com.netflix.eureka.server.EurekaServerContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.netflix.eureka.server.EurekaServerConfigBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

/**
 * Enhanced Eureka Configuration for Enterprise Features
 * 
 * Provides advanced configuration for Eureka Server including:
 * - Cluster support and peer replication
 * - Custom instance registry with healthcare-specific metadata
 * - Performance tuning and optimization
 * - Health check configurations
 * - Service dependency tracking
 * - Auto-scaling integration
 * 
 * @author HMS Enterprise Team
 * @version 2.0.0
 */
@Configuration
public class EurekaConfig {

    @Value("${eureka.server.enable-self-preservation:true}")
    private boolean enableSelfPreservation;

    @Value("${eureka.server.eviction-interval-timer-in-ms:60000}")
    private long evictionIntervalTimerInMs;

    @Value("${eureka.server.renewal-percent-threshold:0.85}")
    private double renewalPercentThreshold;

    @Value("${eureka.server.renewal-threshold-update-interval-ms:900000}")
    private long renewalThresholdUpdateIntervalMs;

    @Value("${eureka.server.response-cache-auto-expiration-in-seconds:180}")
    private long responseCacheAutoExpirationInSeconds;

    @Value("${eureka.server.response-cache-update-interval-ms:30000}")
    private long responseCacheUpdateIntervalMs;

    @Value("${eureka.server.peer-eureka-nodes-update-interval-ms:600000}")
    private long peerEurekaNodesUpdateIntervalMs;

    @Value("${eureka.server.max-idle-registry-connections:1000}")
    private int maxIdleRegistryConnections;

    /**
     * Enhanced Eureka Server Configuration
     */
    @Bean
    @Primary
    public EurekaServerConfigBean eurekaServerConfigBean() {
        EurekaServerConfigBean server = new EurekaServerConfigBean();
        
        // Self-preservation mode configuration
        server.setEnableSelfPreservation(enableSelfPreservation);
        server.setRenewalPercentThreshold(renewalPercentThreshold);
        server.setRenewalThresholdUpdateIntervalMs((int) renewalThresholdUpdateIntervalMs);
        
        // Instance eviction configuration
        server.setEvictionIntervalTimerInMs(evictionIntervalTimerInMs);
        
        // Response cache configuration for performance
        server.setResponseCacheAutoExpirationInSeconds((int) responseCacheAutoExpirationInSeconds);
        server.setResponseCacheUpdateIntervalMs((int) responseCacheUpdateIntervalMs);
        server.setUseReadOnlyResponseCache(true);
        
        // Peer replication configuration
        server.setPeerEurekaNodesUpdateIntervalMs((int) peerEurekaNodesUpdateIntervalMs);
        server.setNumberOfReplicationRetries(5);
        server.setPeerEurekaStatusRefreshTimeIntervalMs(30000);
        server.setWaitTimeInMsWhenSyncEmpty(300000);
        
        // Security and access configuration
        server.setDisableDelta(false);
        server.setMaxIdleHostConnections(maxIdleRegistryConnections);
        server.setConnIdleTimeoutSeconds(60);
        
        // Logging configuration
        server.setLogIdentityHeaders(true);
        server.setRateLimiterEnabled(true);
        server.setRateLimiterBurstSize(100);
        server.setRateLimiterRegistryFetchAverageRate(500);
        server.setRateLimiterFullFetchAverageRate(100);
        
        // Healthcare-specific configurations
        server.setJsonCodecName(DefaultServerCodecs.LegacyJacksonJson.class.getName());
        server.setXmlCodecName(DefaultServerCodecs.XStreamXml.class.getName());
        
        return server;
    }

    /**
     * Development profile configuration - optimized for fast development
     */
    @Bean
    @Profile("development")
    public EurekaServerConfigBean eurekaServerConfigBeanDev() {
        EurekaServerConfigBean server = eurekaServerConfigBean();
        
        // Faster refresh rates for development
        server.setEvictionIntervalTimerInMs(30000); // 30 seconds
        server.setResponseCacheUpdateIntervalMs(15000); // 15 seconds
        server.setEnableSelfPreservation(false); // Disable self-preservation in dev
        server.setRenewalPercentThreshold(0.49); // Lower threshold for dev
        
        return server;
    }

    /**
     * Production profile configuration - optimized for stability and performance
     */
    @Bean
    @Profile("production")
    public EurekaServerConfigBean eurekaServerConfigBeanProd() {
        EurekaServerConfigBean server = eurekaServerConfigBean();
        
        // Production-optimized settings
        server.setEvictionIntervalTimerInMs(120000); // 2 minutes
        server.setResponseCacheUpdateIntervalMs(60000); // 1 minute
        server.setEnableSelfPreservation(true); // Enable self-preservation in prod
        server.setRenewalPercentThreshold(0.85); // Standard threshold for prod
        server.setRateLimiterEnabled(true);
        server.setRateLimiterThrottleStandardClients(true);
        
        return server;
    }

    /**
     * Cluster profile configuration - optimized for multi-node deployment
     */
    @Bean
    @Profile("cluster")
    public EurekaServerConfigBean eurekaServerConfigBeanCluster() {
        EurekaServerConfigBean server = eurekaServerConfigBean();
        
        // Cluster-optimized settings
        server.setPeerEurekaNodesUpdateIntervalMs(300000); // 5 minutes
        server.setNumberOfReplicationRetries(10);
        server.setPeerEurekaStatusRefreshTimeIntervalMs(15000); // 15 seconds
        server.setWaitTimeInMsWhenSyncEmpty(900000); // 15 minutes
        server.setMaxElementsInPeerReplicationPool(10000);
        server.setMaxElementsInStatusReplicationPool(10000);
        server.setMaxTimeForReplication(30000);
        
        return server;
    }

    /**
     * Healthcare compliance configuration
     */
    @Bean
    @Profile("healthcare-compliance")
    public EurekaServerConfigBean eurekaServerConfigBeanCompliance() {
        EurekaServerConfigBean server = eurekaServerConfigBean();
        
        // HIPAA/Healthcare compliance settings
        server.setLogIdentityHeaders(true);
        server.setDisableDelta(false); // Keep delta for audit trails
        server.setRateLimiterEnabled(true);
        server.setRateLimiterThrottleStandardClients(true);
        
        // Enhanced logging for compliance
        server.setAccessLogEnabled(true);
        server.setUseReadOnlyResponseCache(false); // Ensure fresh data for compliance
        
        return server;
    }
}
