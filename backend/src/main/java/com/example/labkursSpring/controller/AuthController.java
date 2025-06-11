package com.example.labkursSpring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.labkursSpring.dto.AuthRequest;
import com.example.labkursSpring.dto.AuthResponse;
import com.example.labkursSpring.dto.RefreshRequest;
import com.example.labkursSpring.service.JwtService;
import com.example.labkursSpring.repository.DoktoriRepo;
import com.example.labkursSpring.model.Doktori;
import com.example.labkursSpring.model.Users;
import com.example.labkursSpring.repository.UserRepo;
import com.example.labkursSpring.repository.InfermieriRepo;
import com.example.labkursSpring.model.Infermieri;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private InfermieriRepo infermieriRepo;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private DoktoriRepo doktoriRepo;
    @Autowired
    private UserRepo userRepo;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) throws Exception {
        System.out.println("[DEBUG] Login attempt: email=" + request.getEmail() + ", password=" + request.getPassword());
        authenticate(request.getEmail(), request.getPassword());

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        // Fetch user entity
        Users user = userRepo.findByEmail(request.getEmail()).orElse(null);
        Doktori doktori = null;
        Infermieri infermieri = null;
        if (user != null) {
            doktori = doktoriRepo.findAll().stream()
                .filter(d -> d.getUser() != null && d.getUser().getUserId().equals(user.getUserId()))
                .findFirst().orElse(null);
            if (doktori == null) {
                infermieri = infermieriRepo.findAll().stream()
                    .filter(i -> i.getUser() != null && i.getUser().getUserId().equals(user.getUserId()))
                    .findFirst().orElse(null);
            }
        }

        if (doktori != null) {
            System.out.println("[DEBUG] Authenticated as DOCTOR: id=" + doktori.getDoktoriId() + ", emriMbiemri=" + doktori.getEmriMbiemri());
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, "DOCTOR", doktori.getDoktoriId(), doktori.getEmriMbiemri()));
        } else if (infermieri != null) {
            System.out.println("[DEBUG] Authenticated as INFERMIER: id=" + infermieri.getInfermieriID() + ", emriMbiemri=" + infermieri.getEmriMbiemri());
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, "INFERMIER", infermieri.getInfermieriID(), infermieri.getEmriMbiemri()));
        } else {
            System.out.println("[DEBUG] Authenticated as USER");
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, "USER", null, null));
        }
    } 


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshRequest request) {
        if (!jwtService.isTokenValid(request.refreshToken())) { 
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = jwtService.extractUsername(request.refreshToken()); 
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String newAccessToken = jwtService.generateAccessToken(userDetails);

        // Use null/defaults for role/id/emriMbiemri in refresh
        return ResponseEntity.ok(new AuthResponse(newAccessToken, request.refreshToken(), null, null, null));
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}
