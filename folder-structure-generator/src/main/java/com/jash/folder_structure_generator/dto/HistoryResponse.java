package com.jash.folder_structure_generator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class HistoryResponse {
    private Long id;
    private String structureName;
    private String structureContent;
    private LocalDateTime createdAt;
}