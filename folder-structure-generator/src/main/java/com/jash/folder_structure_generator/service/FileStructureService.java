package com.jash.folder_structure_generator.service;

import com.jash.folder_structure_generator.model.FileStructureHistory;
import com.jash.folder_structure_generator.model.User;
import com.jash.folder_structure_generator.repository.FileStructureHistoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class FileStructureService {

    private final FileStructureHistoryRepository historyRepository;
    private final ObjectMapper objectMapper;
    private final GeminiService geminiService;

    @Autowired
    public FileStructureService(FileStructureHistoryRepository historyRepository, GeminiService geminiService) {
        this.historyRepository = historyRepository;
        this.objectMapper = new ObjectMapper();
        this.geminiService = geminiService;
    }

    public byte[] generateZipFromStructure(String structureInput, String structureName, User user) throws IOException {
        // First, validate and correct the structure using the Gemini API
        String correctedStructure = geminiService.validateAndCorrectStructure(structureInput);
        
        // Save to history with the corrected structure
        FileStructureHistory history = new FileStructureHistory();
        history.setStructureName(structureName);
        history.setStructureContent(correctedStructure);
        history.setUser(user);
        historyRepository.save(history);

        // Create temporary directory
        Path tempDir = Files.createTempDirectory("file-structure-");

        try {
            // Parse and create structure from the corrected content
            if (isJsonFormat(correctedStructure)) {
                createStructureFromJson(correctedStructure, tempDir);
            } else {
                createStructureFromText(correctedStructure, tempDir);
            }

            // Create ZIP
            return createZipFromDirectory(tempDir);
        } finally {
            // Clean up temporary directory
            deleteDirectory(tempDir);
        }
    }

    private boolean isJsonFormat(String input) {
        try {
            objectMapper.readTree(input);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private void createStructureFromJson(String jsonInput, Path baseDir) throws IOException {
        JsonNode rootNode = objectMapper.readTree(jsonInput);
        processJsonNode(rootNode, baseDir);
    }

    private void processJsonNode(JsonNode node, Path currentDir) throws IOException {
        Iterator<Map.Entry<String, JsonNode>> fields = node.fields();

        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> field = fields.next();
            String name = field.getKey();
            JsonNode value = field.getValue();

            Path itemPath = currentDir.resolve(name);

            if (value.isNull() || isFile(name)) {
                // Create file
                Files.createDirectories(itemPath.getParent());
                Files.createFile(itemPath);

                // Add some default content based on file type
                String content = getDefaultFileContent(name);
                if (!content.isEmpty()) {
                    Files.write(itemPath, content.getBytes());
                }
            } else if (value.isArray()) {
                // Create directory and process array items
                Files.createDirectories(itemPath);
                for (JsonNode arrayItem : value) {
                    if (arrayItem.isTextual()) {
                        String fileName = arrayItem.asText();
                        Path filePath = itemPath.resolve(fileName);
                        Files.createFile(filePath);

                        String content = getDefaultFileContent(fileName);
                        if (!content.isEmpty()) {
                            Files.write(filePath, content.getBytes());
                        }
                    }
                }
            } else if (value.isObject()) {
                // Create directory and process nested object
                Files.createDirectories(itemPath);
                processJsonNode(value, itemPath);
            }
        }
    }

    private void createStructureFromText(String textInput, Path baseDir) throws IOException {
        String[] lines = textInput.split("\n");
        java.util.Stack<Path> pathStack = new java.util.Stack<>();
        pathStack.push(baseDir);

        for (String line : lines) {
            if (line.trim().isEmpty()) continue;

            // Count indentation level
            int indentLevel = 0;
            for (char c : line.toCharArray()) {
                if (c == ' ') indentLevel++;
                else if (c == '\t') indentLevel += 4;
                else break;
            }

            String itemName = line.trim();
            if (itemName.isEmpty()) continue;

            // Adjust path stack based on indentation level
            while (pathStack.size() > indentLevel + 1) {
                pathStack.pop();
            }

            Path currentDir = pathStack.peek();
            Path itemPath = currentDir.resolve(itemName.replaceAll("/", ""));

            if (isFile(itemName)) {
                // Create file
                Files.createDirectories(itemPath.getParent());
                if (!Files.exists(itemPath)) {
                    Files.createFile(itemPath);

                    String content = getDefaultFileContent(itemName);
                    if (!content.isEmpty()) {
                        Files.write(itemPath, content.getBytes());
                    }
                }
            } else {
                // Create directory and add to path stack
                Files.createDirectories(itemPath);
                pathStack.push(itemPath);
            }
        }
    }



    private boolean isFile(String name) {
        return name.contains(".") && !name.endsWith("/");
    }

    private String getDefaultFileContent(String fileName) {
        String extension = getFileExtension(fileName).toLowerCase();

        switch (extension) {
            case "java":
                return "public class " + getClassName(fileName) + " {\n    // TODO: Implement\n}\n";
            case "js":
                return "// " + fileName + "\nconsole.log('Hello from " + fileName + "');\n";
            case "py":
                return "# " + fileName + "\nprint('Hello from " + fileName + "')\n";
            case "html":
                return "<!DOCTYPE html>\n<html>\n<head>\n    <title>" + fileName + "</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>\n";
            case "css":
                return "/* " + fileName + " */\nbody {\n    font-family: Arial, sans-serif;\n}\n";
            case "md":
                return "# " + fileName.replace(".md", "") + "\n\nThis is a markdown file.\n";
            case "txt":
                return "This is a text file: " + fileName + "\n";
            case "json":
                return "{\n    \"name\": \"" + fileName + "\",\n    \"description\": \"Generated JSON file\"\n}\n";
            case "xml":
                return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<root>\n    <message>Hello from " + fileName + "</message>\n</root>\n";
            default:
                return "";
        }
    }

    private String getFileExtension(String fileName) {
        int lastDot = fileName.lastIndexOf('.');
        return lastDot > 0 ? fileName.substring(lastDot + 1) : "";
    }

    private String getClassName(String fileName) {
        String nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        return nameWithoutExtension.substring(0, 1).toUpperCase() + nameWithoutExtension.substring(1);
    }

    private byte[] createZipFromDirectory(Path sourceDir) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            Files.walk(sourceDir)
                    .filter(path -> !Files.isDirectory(path))
                    .forEach(path -> {
                        ZipEntry zipEntry = new ZipEntry(sourceDir.relativize(path).toString());
                        try {
                            zos.putNextEntry(zipEntry);
                            Files.copy(path, zos);
                            zos.closeEntry();
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    });
        }

        return baos.toByteArray();
    }

    private void deleteDirectory(Path directory) throws IOException {
        if (Files.exists(directory)) {
            Files.walk(directory)
                    .sorted((a, b) -> b.compareTo(a)) // Delete files before directories
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            // Log error but continue cleanup
                        }
                    });
        }
    }

    public List<FileStructureHistory> getUserHistory(User user) {
        return historyRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    public void deleteHistoryItem(Long id, User user) {
        FileStructureHistory history = historyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("History item not found"));
        
        // Verify that the history item belongs to the user
        if (!history.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to history item");
        }
        
        historyRepository.deleteById(id);
    }
}