package com.hospital.hms.patientmanagement.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Service for handling security context operations
 * 
 * @author HMS Enterprise Team
 * @version 1.0.0
 */
@Service
public class SecurityContextService {

    /**
     * Get the current authenticated user
     * 
     * @return Current user identifier
     */
    public String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return "system";
        }
        
        // If authentication principal is a custom user object, extract username
        Object principal = authentication.getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            return ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
        }
        
        // If principal is a string (like in JWT tokens)
        if (principal instanceof String) {
            return (String) principal;
        }
        
        // Fallback to name from authentication
        return authentication.getName() != null ? authentication.getName() : "system";
    }

    /**
     * Get current user with role information
     * 
     * @return Current user with role context
     */
    public String getCurrentUserWithRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return "system";
        }
        
        String username = getCurrentUser();
        String roles = authentication.getAuthorities().toString();
        
        return String.format("%s (%s)", username, roles);
    }

    /**
     * Check if current user has a specific role
     * 
     * @param role Role to check
     * @return true if user has the role
     */
    public boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        return authentication.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + role) || 
                                 authority.getAuthority().equals(role));
    }

    /**
     * Check if current user is authenticated
     * 
     * @return true if authenticated
     */
    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() && 
               !"anonymousUser".equals(authentication.getPrincipal());
    }
}
