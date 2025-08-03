package com.jash.folder_structure_generator.controller;

import com.jash.folder_structure_generator.dto.ChatRequest;
import com.jash.folder_structure_generator.dto.ChatResponse;
import com.jash.folder_structure_generator.service.GeminiService;
import com.jash.folder_structure_generator.model.User;
import com.jash.folder_structure_generator.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class GeminiController {

    private final GeminiService geminiService;
    private final UserService userService;

    @Autowired
    public GeminiController(GeminiService geminiService, UserService userService) {
        this.geminiService = geminiService;
        this.userService = userService;
    }

    @PostMapping("/gemini-chat")
    public ResponseEntity<?> chatWithGemini(@RequestBody ChatRequest request, Authentication authentication) {
        try {
            // Get current user
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Validate input
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Message is required");
            }

            // Get response from Gemini
            String response = geminiService.chatWithGemini(request.getMessage());

            return ResponseEntity.ok(new ChatResponse(response));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get AI response: " + e.getMessage());
        }
    }
} 