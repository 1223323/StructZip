package com.jash.folder_structure_generator.controller;


import com.jash.folder_structure_generator.dto.StructureRequest;
import com.jash.folder_structure_generator.model.User;
import com.jash.folder_structure_generator.service.FileStructureService;
import com.jash.folder_structure_generator.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FileStructureController {

    private final FileStructureService fileStructureService;
    private final UserService userService;

    @Autowired
    public FileStructureController(FileStructureService fileStructureService, UserService userService) {
        this.fileStructureService = fileStructureService;
        this.userService = userService;
    }

    @PostMapping("/generate-structure")
    public ResponseEntity<?> generateStructure(@RequestBody StructureRequest request,
                                               Authentication authentication) {
        try {
            // Get current user
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Validate input
            if (request.getStructureContent() == null || request.getStructureContent().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Structure content is required");
            }

            String structureName = request.getStructureName();
            if (structureName == null || structureName.trim().isEmpty()) {
                structureName = "generated-structure-" + System.currentTimeMillis();
            }

            // Generate ZIP
            byte[] zipData = fileStructureService.generateZipFromStructure(
                    request.getStructureContent(),
                    structureName,
                    user
            );

            // Prepare response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", structureName + ".zip");
            headers.setContentLength(zipData.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(zipData);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to generate structure: " + e.getMessage());
        }
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<?> deleteHistoryItem(@PathVariable Long id, Authentication authentication) {
        try {
            // Get current user
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Delete the history item
            fileStructureService.deleteHistoryItem(id, user);

            return ResponseEntity.ok().body("History item deleted successfully");

        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("Unauthorized access to history item");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Failed to delete history item: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete history item: " + e.getMessage());
        }
    }
}