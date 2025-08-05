package com.jash.folder_structure_generator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Template {
    private String id;
    private String name;
    private String description;
    private String content;
    private String format; // "json" or "text"
}
