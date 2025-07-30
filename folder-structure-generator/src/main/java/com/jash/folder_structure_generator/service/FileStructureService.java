package com.jash.folder_structure_generator.service;

import com.jash.folder_structure_generator.model.FileStructureHistory;
import com.jash.folder_structure_generator.model.User;
import com.jash.folder_structure_generator.repository.FileStructureHistoryRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.util.stream.Stream;

@Service
public class FileStructureService {

    private static final Logger log = LoggerFactory.getLogger(FileStructureService.class);
    private final FileStructureHistoryRepository historyRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public FileStructureService(FileStructureHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
        this.objectMapper = new ObjectMapper();
    }

    public byte[] generateZipFromStructure(String structureInput, String structureName, User user) throws IOException {
        // Save to history
        FileStructureHistory history = new FileStructureHistory();
        history.setStructureName(structureName);
        history.setStructureContent(structureInput);
        history.setUser(user);
        historyRepository.save(history);

        // Create temporary directory
        Path tempDir = Files.createTempDirectory("file-structure-");

        try {
            // Parse and create structure
            if (isJsonFormat(structureInput)) {
                createStructureFromJson(structureInput, tempDir);
            } else {
                createStructureFromText(structureInput, tempDir);
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
            // IMPROVED: Catch a more specific exception
            objectMapper.readTree(input);
            return true;
        } catch (JsonProcessingException e) {
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

            // IMPROVED: Logic is cleaner and driven by JSON value type
            if (value.isObject()) {
                // It's a directory with nested content
                Files.createDirectories(itemPath);
                processJsonNode(value, itemPath);
            } else if (value.isArray()) {
                // It's a directory containing a list of files
                Files.createDirectories(itemPath);
                for (JsonNode arrayItem : value) {
                    if (arrayItem.isTextual()) {
                        String fileName = arrayItem.asText();
                        createFileWithContent(itemPath.resolve(fileName));
                    }
                }
            } else {
                // It's a file (value is null, text, number, etc.)
                createFileWithContent(itemPath);
            }
        }
    }

    // FIXED: The entire logic for creating structure from text is rewritten to be correct.
    private void createStructureFromText(String textInput, Path baseDir) throws IOException {
        Map<Integer, Path> pathByIndent = new HashMap<>();
        pathByIndent.put(0, baseDir);

        // IMPROVED: Using stream handles different line endings (e.g., \n and \r\n)
        String[] lines = textInput.split("\r?\n");
        for (String line : lines) {
            if (line.trim().isEmpty()) continue;

            int indentLevel = getIndentationLevel(line);
            String name = line.trim();

            Path parentPath = pathByIndent.get(indentLevel);
            if (parentPath == null) {
                // This indicates a likely malformed indentation.
                // Default to the previous level's path.
                int lastKey = pathByIndent.keySet().stream().max(Integer::compareTo).orElse(0);
                parentPath = pathByIndent.get(lastKey);
            }

            Path currentPath = parentPath.resolve(name);

            if (isFile(name)) {
                createFileWithContent(currentPath);
                // A file can also serve as a parent for the next level of indentation
                pathByIndent.put(indentLevel + 1, currentPath.getParent());
            } else {
                Files.createDirectories(currentPath);
                pathByIndent.put(indentLevel + 1, currentPath);
            }
        }
    }

    private int getIndentationLevel(String line) {
        int level = 0;
        for (char c : line.toCharArray()) {
            if (c == ' ' || c == '\t') { // Simple count; assuming consistent indentation
                level++;
            } else {
                break;
            }
        }
        // A common convention is 4 spaces = 1 logical level. Adjust if needed.
        return level / 4;
    }

    private void createFileWithContent(Path filePath) throws IOException {
        Files.createDirectories(filePath.getParent());
        if (!Files.exists(filePath)) {
            Files.createFile(filePath);
            String content = getDefaultFileContent(filePath.getFileName().toString());
            if (!content.isEmpty()) {
                Files.write(filePath, content.getBytes());
            }
        }
    }

    private boolean isFile(String name) {
        return name.contains(".");
    }

    // ... (getDefaultFileContent and its helpers remain the same) ...
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
    // FIXED: Zipping logic now correctly includes empty directories.
    private byte[] createZipFromDirectory(Path sourceDir) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            Files.walkFileTree(sourceDir, new SimpleFileVisitor<>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                    Path relativePath = sourceDir.relativize(file);
                    zos.putNextEntry(new ZipEntry(relativePath.toString().replace('\\', '/')));
                    Files.copy(file, zos);
                    zos.closeEntry();
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                    if (!sourceDir.equals(dir)) {
                        Path relativePath = sourceDir.relativize(dir);
                        zos.putNextEntry(new ZipEntry(relativePath.toString().replace('\\', '/') + "/"));
                        zos.closeEntry();
                    }
                    return FileVisitResult.CONTINUE;
                }
            });
        }
        return baos.toByteArray();
    }

    private void deleteDirectory(Path directory) throws IOException {
        if (Files.exists(directory)) {
            try (Stream<Path> walk = Files.walk(directory)) {
                walk.sorted((a, b) -> b.compareTo(a)) // Delete files before directories
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                // IMPROVED: Log the error instead of silently ignoring it.
                                log.error("Failed to delete path: " + path, e);
                            }
                        });
            }
        }
    }

    public List<FileStructureHistory> getUserHistory(User user) {
        return historyRepository.findByUserOrderByCreatedAtDesc(user);
    }
}