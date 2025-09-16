package com.example.labkursSpring.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.*;

import com.example.labkursSpring.dto.AuthRequest;
import com.example.labkursSpring.dto.AuthResponse;
import com.example.labkursSpring.dto.RefreshRequest;
import com.example.labkursSpring.model.Doktori;
import com.example.labkursSpring.model.Infermieri;
import com.example.labkursSpring.model.Users;
import com.example.labkursSpring.repository.DoktoriRepo;
import com.example.labkursSpring.repository.InfermieriRepo;
import com.example.labkursSpring.repository.UserRepo;
import com.example.labkursSpring.service.JwtService;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.authentication.AuthenticationManager;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private DoktoriRepo doktoriRepo;

    @Autowired
    private InfermieriRepo infermieriRepo;

    // helper DTO
    private static class RoleInfo {
        String role;
        Long id;
        String emriMbiemri;
    }

    // robust role detection: try user link first, then username/email fallbacks
    private RoleInfo determineRoleInfo(Users user, String loginIdentifier) {
        RoleInfo info = new RoleInfo();

        // 1) If Users row is available, prefer Infermieri then Doktori by UserID
        if (user != null) {
            Long uid = user.getUserId();
            if (uid != null) {
                Optional<Infermieri> infOpt = infermieriRepo.findByUser_UserId(uid);
                if (infOpt.isPresent()) {
                    Infermieri i = infOpt.get();
                    info.role = "INFERMIER";
                    info.id = i.getInfermieriID();
                    info.emriMbiemri = i.getEmriMbiemri();
                    return info;
                }
                Optional<Doktori> dokOpt = doktoriRepo.findByUser_UserId(uid);
                if (dokOpt.isPresent()) {
                    Doktori d = dokOpt.get();
                    info.role = "DOCTOR";
                    info.id = d.getDoktoriId();
                    info.emriMbiemri = d.getEmriMbiemri();
                    return info;
                }
            }
        }

        // 2) Fallback: use login identifier (email or username) — prefer Infermieri then Doktori
        if (loginIdentifier != null && !loginIdentifier.isBlank()) {
            String ident = loginIdentifier.trim();

            Optional<Infermieri> infByUsername = infermieriRepo.findByUsernameIgnoreCase(ident);
            if (infByUsername.isPresent()) {
                Infermieri i = infByUsername.get();
                info.role = "INFERMIER";
                info.id = i.getInfermieriID();
                info.emriMbiemri = i.getEmriMbiemri();
                return info;
            }

            Optional<Doktori> dokByUsername = doktoriRepo.findByUsernameIgnoreCase(ident);
            if (dokByUsername.isPresent()) {
                Doktori d = dokByUsername.get();
                info.role = "DOCTOR";
                info.id = d.getDoktoriId();
                info.emriMbiemri = d.getEmriMbiemri();
                return info;
            }

            Optional<Infermieri> infByUserEmail = infermieriRepo.findByUser_EmailIgnoreCase(ident);
            if (infByUserEmail.isPresent()) {
                Infermieri i = infByUserEmail.get();
                info.role = "INFERMIER";
                info.id = i.getInfermieriID();
                info.emriMbiemri = i.getEmriMbiemri();
                return info;
            }

            Optional<Doktori> dokByUserEmail = doktoriRepo.findByUser_EmailIgnoreCase(ident);
            if (dokByUserEmail.isPresent()) {
                Doktori d = dokByUserEmail.get();
                info.role = "DOCTOR";
                info.id = d.getDoktoriId();
                info.emriMbiemri = d.getEmriMbiemri();
                return info;
            }
        }

        // default
        info.role = "USER";
        return info;
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) throws Exception {
        // authenticate and issue tokens
        authenticate(request.getEmail(), request.getPassword());
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        // find Users row by email (if exists)
        Users user = userRepo.findByEmail(request.getEmail()).orElse(null);
        RoleInfo roleInfo = determineRoleInfo(user, request.getEmail());
        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, roleInfo.role, roleInfo.id, roleInfo.emriMbiemri));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshRequest request) {
        // RefreshRequest is a record: use record accessor refreshToken()
        String refreshToken = request.refreshToken();
        if (refreshToken == null || !jwtService.isTokenValid(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized or invalid token");
        }

        String username = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String newAccessToken = jwtService.generateAccessToken(userDetails);

        Users user = userRepo.findByEmail(username).orElse(null);
        RoleInfo roleInfo = determineRoleInfo(user, username);
        return ResponseEntity.ok(new AuthResponse(newAccessToken, refreshToken, roleInfo.role, roleInfo.id, roleInfo.emriMbiemri));
    }
}