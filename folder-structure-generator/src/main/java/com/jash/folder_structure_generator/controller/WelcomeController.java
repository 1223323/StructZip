package com.jash.folder_structure_generator.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public Map<String, Object> welcome() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Folder Structure Generator API");
        response.put("version", "1.0.0");
        response.put("status", "running");

        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("register", "POST /api/auth/register");
        endpoints.put("login", "POST /api/auth/login");
        endpoints.put("generate", "POST /api/generate-structure");
        endpoints.put("history", "GET /api/user/history");
        endpoints.put("profile", "GET /api/user/profile");

        response.put("endpoints", endpoints);
        return response;
    }

    @GetMapping("/api")
    public Map<String, String> apiInfo() {
        Map<String, String> info = new HashMap<>();
        info.put("message", "Folder Structure Generator API v1.0");
        info.put("documentation", "Use POST requests for auth endpoints");
        return info;
    }
}