package com.hospital.hms.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.List;
import java.util.stream.Collectors;

/**
 * JWT Authentication Filter for API Gateway
 * 
 * Validates JWT tokens and sets security context for downstream services.
 * Extracts user information and authorities from JWT claims.
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
public class JwtAuthenticationFilter implements WebFilter {

    private final SecretKey secretKey;
    private static final String TOKEN_PREFIX = "Bearer ";
    private static final String TOKEN_HEADER = HttpHeaders.AUTHORIZATION;

    public JwtAuthenticationFilter(String jwtSecret) {
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = extractToken(exchange);
        
        if (token == null) {
            return chain.filter(exchange);
        }

        try {
            Claims claims = validateToken(token);
            Authentication authentication = createAuthentication(claims);
            
            // Add user context headers for downstream services
            ServerWebExchange modifiedExchange = addUserHeaders(exchange, claims);
            
            return chain.filter(modifiedExchange)
                .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication));
                
        } catch (Exception e) {
            // Invalid token - return unauthorized
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    /**
     * Extract JWT token from Authorization header
     */
    private String extractToken(ServerWebExchange exchange) {
        String authHeader = exchange.getRequest().getHeaders().getFirst(TOKEN_HEADER);
        
        if (authHeader != null && authHeader.startsWith(TOKEN_PREFIX)) {
            return authHeader.substring(TOKEN_PREFIX.length());
        }
        
        return null;
    }

    /**
     * Validate JWT token and extract claims
     */
    private Claims validateToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    /**
     * Create Spring Security Authentication from JWT claims
     */
    private Authentication createAuthentication(Claims claims) {
        String username = claims.getSubject();
        
        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) claims.get("roles");
        
        List<SimpleGrantedAuthority> authorities = roles != null ? 
            roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .collect(Collectors.toList()) :
            List.of();

        return new UsernamePasswordAuthenticationToken(username, null, authorities);
    }

    /**
     * Add user context headers for downstream services
     */
    private ServerWebExchange addUserHeaders(ServerWebExchange exchange, Claims claims) {
        return exchange.mutate()
            .request(builder -> {
                // Add user identification headers
                builder.header("X-User-ID", claims.getSubject());
                builder.header("X-User-Name", (String) claims.get("name"));
                builder.header("X-User-Email", (String) claims.get("email"));
                
                // Add role headers
                @SuppressWarnings("unchecked")
                List<String> roles = (List<String>) claims.get("roles");
                if (roles != null) {
                    builder.header("X-User-Roles", String.join(",", roles));
                }
                
                // Add organization/tenant context
                String organizationId = (String) claims.get("organizationId");
                if (organizationId != null) {
                    builder.header("X-Organization-ID", organizationId);
                }
                
                String departmentId = (String) claims.get("departmentId");
                if (departmentId != null) {
                    builder.header("X-Department-ID", departmentId);
                }
                
                // Add permissions
                @SuppressWarnings("unchecked")
                List<String> permissions = (List<String>) claims.get("permissions");
                if (permissions != null) {
                    builder.header("X-User-Permissions", String.join(",", permissions));
                }
                
                // Add session information
                builder.header("X-Session-ID", (String) claims.get("sessionId"));
                builder.header("X-Token-TYPE", "JWT");
                
                // Add timestamp
                builder.header("X-Auth-Time", String.valueOf(System.currentTimeMillis()));
            })
            .build();
    }
}
