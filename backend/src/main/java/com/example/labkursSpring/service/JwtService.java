package com.example.labkursSpring.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class JwtService {

    @Value("${jwt.secret:}")
    private String jwtSecret; // set in application.properties

    private volatile Key secretKey; // lazy init

    private final long accessTokenValidity = 15 * 60 * 1000; // 15 minutes
    private final long refreshTokenValidity = 7 * 24 * 60 * 60 * 1000; // 7 days

    private Key getSecretKey() {
        if (secretKey == null) {
            synchronized (this) {
                if (secretKey == null) {
                    try {
                        byte[] keyBytes;
                        if (jwtSecret != null && !jwtSecret.trim().isEmpty()) {
                            try {
                                keyBytes = Base64.getDecoder().decode(jwtSecret.trim());
                            } catch (IllegalArgumentException ex) {
                                keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
                            }
                            if (keyBytes.length < 32) {
                                MessageDigest md = MessageDigest.getInstance("SHA-256");
                                keyBytes = md.digest(keyBytes);
                            }
                            secretKey = Keys.hmacShaKeyFor(keyBytes);
                        } else {
                            secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
                        }
                    } catch (Exception e) {
                        secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
                    }
                }
            }
        }
        return secretKey;
    }

    public String generateAccessToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // include roles/authorities in token
        claims.put("roles", userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .map(s -> s.startsWith("ROLE_") ? s.substring(5) : s) // normalize to role names without ROLE_ prefix
                .collect(Collectors.toList()));
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenValidity))
                .signWith(getSecretKey())
                .compact();
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenValidity))
                .signWith(getSecretKey())
                .compact();
    }

    public Boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSecretKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            Object rolesObj = claims.get("roles");
            if (rolesObj instanceof List) {
                return ((List<?>) rolesObj).stream().map(Object::toString).collect(Collectors.toList());
            }
        } catch (Exception e) {
            // ignore and return empty
        }
        return Collections.emptyList();
    }
}