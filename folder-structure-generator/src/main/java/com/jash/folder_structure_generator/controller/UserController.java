package com.jash.folder_structure_generator.controller;


import com.jash.folder_structure_generator.dto.HistoryResponse;
import com.jash.folder_structure_generator.model.FileStructureHistory;
import com.jash.folder_structure_generator.model.User;
import com.jash.folder_structure_generator.service.FileStructureService;
import com.jash.folder_structure_generator.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final FileStructureService fileStructureService;
    private final UserService userService;

    @Autowired
    public UserController(FileStructureService fileStructureService, UserService userService) {
        this.fileStructureService = fileStructureService;
        this.userService = userService;
    }

    @GetMapping("/history")
    public ResponseEntity<?> getUserHistory(Authentication authentication) {
        try {
            // Get current user
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get user history
            List<FileStructureHistory> history = fileStructureService.getUserHistory(user);

            // Convert to response DTOs
            List<HistoryResponse> historyResponse = history.stream()
                    .map(h -> new HistoryResponse(
                            h.getId(),
                            h.getStructureName(),
                            h.getStructureContent(),
                            h.getCreatedAt()
                    ))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(historyResponse);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get history: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/history/{id}")
    public ResponseEntity<?> deleteHistoryItem(@PathVariable Long id, Authentication authentication) {
        try {
            // Get current user
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Delete history item
            fileStructureService.deleteHistoryItem(id, user);

            return ResponseEntity.ok().body(Map.of("message", "History item deleted successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete history item: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        try {
            // Get current user
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(new UserProfileResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getCreatedAt()
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get profile: " + e.getMessage());
        }
    }

    // Inner class for user profile response
    public static class UserProfileResponse {
        public Long id;
        public String username;
        public String email;
        public java.time.LocalDateTime createdAt;

        public UserProfileResponse(Long id, String username, String email, java.time.LocalDateTime createdAt) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.createdAt = createdAt;
        }
    }
}