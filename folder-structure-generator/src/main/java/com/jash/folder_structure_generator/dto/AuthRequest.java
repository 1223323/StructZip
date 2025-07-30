package com.jash.folder_structure_generator.dto;


import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String email;
    private String password;
}