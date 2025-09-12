package com.example.labkursSpring.controller;

import com.example.labkursSpring.dto.ProfileUpdateRequest;
import com.example.labkursSpring.dto.ProfileResponse;
import com.example.labkursSpring.model.Doktori;
import com.example.labkursSpring.model.Infermieri;
import com.example.labkursSpring.model.Users;
import com.example.labkursSpring.repository.DoktoriRepo;
import com.example.labkursSpring.repository.InfermieriRepo;
import com.example.labkursSpring.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private DoktoriRepo doktoriRepo;

    @Autowired
    private InfermieriRepo infermieriRepo;

    @Autowired
    private AuthenticationManager authenticationManager;

    // GET /api/users/me
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Users> uOpt = userRepo.findByEmail(username);
        if (uOpt.isEmpty()) return ResponseEntity.status(404).body("User not found");

        Users user = uOpt.get();
        String emri = null;
        // try to find linked infermieri/doktori by userId
        Long uid = user.getUserId();
        if (uid != null) {
            Optional<Infermieri> inf = infermieriRepo.findByUser_UserId(uid);
            if (inf.isPresent()) emri = inf.get().getEmriMbiemri();
            else {
                Optional<Doktori> dok = doktoriRepo.findByUser_UserId(uid);
                if (dok.isPresent()) emri = dok.get().getEmriMbiemri();
            }
        }

        return ResponseEntity.ok(new ProfileResponse(user.getUserId(), user.getEmail(), emri));
    }

    // PUT /api/users/profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest req) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Users> uOpt = userRepo.findByEmail(username);
        if (uOpt.isEmpty()) return ResponseEntity.status(404).body("User not found");

        Users user = uOpt.get();

        // require current password to match
        if (req.getCurrentPassword() == null || req.getCurrentPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Current password is required");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), req.getCurrentPassword())
            );
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body("Current password is incorrect");
        }

        // apply changes
        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            user.setEmail(req.getEmail().trim());
        }
        if (req.getNewPassword() != null && !req.getNewPassword().isBlank()) {
            user.setPassword(req.getNewPassword());
        }
        userRepo.save(user);

        // update display name on linked infermieri/doktori if present
        Long uid = user.getUserId();
        String newEmri = req.getEmriMbiemri();
        if (uid != null && newEmri != null) {
            Optional<Infermieri> infOpt = infermieriRepo.findByUser_UserId(uid);
            if (infOpt.isPresent()) {
                Infermieri inf = infOpt.get();
                inf.setEmriMbiemri(newEmri);
                infermieriRepo.save(inf);
            } else {
                Optional<Doktori> dokOpt = doktoriRepo.findByUser_UserId(uid);
                if (dokOpt.isPresent()) {
                    Doktori dok = dokOpt.get();
                    dok.setEmriMbiemri(newEmri);
                    doktoriRepo.save(dok);
                }
            }
        }

        // return updated profile info
        String resultEmri = null;
        if (uid != null) {
            Optional<Infermieri> infGet = infermieriRepo.findByUser_UserId(uid);
            if (infGet.isPresent()) resultEmri = infGet.get().getEmriMbiemri();
            else {
                Optional<Doktori> dokGet = doktoriRepo.findByUser_UserId(uid);
                if (dokGet.isPresent()) resultEmri = dokGet.get().getEmriMbiemri();
            }
        }

        return ResponseEntity.ok(new com.example.labkursSpring.dto.ProfileResponse(user.getUserId(), user.getEmail(), resultEmri));
    }

    // DELETE /api/users/profile
    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Users> uOpt = userRepo.findByEmail(username);
        if (uOpt.isEmpty()) return ResponseEntity.status(404).body("User not found");

        Users user = uOpt.get();
        // optionally remove linked Doktori/Infermieri first if needed by constraints
        Long uid = user.getUserId();
        if (uid != null) {
            infermieriRepo.findByUser_UserId(uid).ifPresent(infermieriRepo::delete);
            doktoriRepo.findByUser_UserId(uid).ifPresent(doktoriRepo::delete);
        }
        userRepo.delete(user);
        return ResponseEntity.ok().build();
    }
}