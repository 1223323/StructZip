package com.jash.folder_structure_generator.controller;

import com.jash.folder_structure_generator.dto.Template;
import com.jash.folder_structure_generator.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TemplateController {

    private final TemplateService templateService;

    @Autowired
    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping("/templates")
    public ResponseEntity<List<Template>> getTemplates() {
        return ResponseEntity.ok(templateService.getTemplates());
    }
}
