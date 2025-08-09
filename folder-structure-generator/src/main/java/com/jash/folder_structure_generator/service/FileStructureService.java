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
import java.util.AbstractMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class FileStructureService {

    private final FileStructureHistoryRepository historyRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public FileStructureService(FileStructureHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
        this.objectMapper = new ObjectMapper();
    }

    public byte[] generateZipFromStructure(String structureInput, String structureName, User user) throws IOException {
        // Save to history with the original structure
        FileStructureHistory history = new FileStructureHistory();
        history.setStructureName(structureName);
        history.setStructureContent(structureInput);
        history.setUser(user);
        historyRepository.save(history);

        // Create temporary directory
        Path tempDir = Files.createTempDirectory("file-structure-");

        try {
            // Parse and create structure from the input content
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

            Path itemPath = currentDir.resolve(name.replaceAll("[/\\\\]$", ""));

            if (value.isNull() || isFile(name)) {
                // Create file
                Files.createDirectories(itemPath.getParent());
                if (!Files.exists(itemPath)) {
                    Files.createFile(itemPath);
                    String content = getDefaultFileContent(name);
                    if (!content.isEmpty()) {
                        Files.write(itemPath, content.getBytes());
                    }
                }
            } else if (value.isArray()) {
                // Create directory and process array items
                Files.createDirectories(itemPath);
                for (JsonNode arrayItem : value) {
                    if (arrayItem.isTextual()) {
                        String fileName = arrayItem.asText();
                        Path filePath = itemPath.resolve(fileName);
                        if (!Files.exists(filePath)) {
                            Files.createFile(filePath);
                            String content = getDefaultFileContent(fileName);
                            if (!content.isEmpty()) {
                                Files.write(filePath, content.getBytes());
                            }
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

    /**
     * Creates a file and directory structure from an indented text string.
     * This corrected version uses a stack that holds both the indentation level and the path,
     * making it much more robust at determining the correct parent for each item.
     *
     * @param textInput The indented text representing the folder structure.
     * @param baseDir   The base directory to create the structure in.
     * @throws IOException if an I/O error occurs.
     */
    private void createStructureFromText(String textInput, Path baseDir) throws IOException {
        String[] lines = textInput.split("\n");
        // The stack now stores a pair: the indentation level and the path.
        java.util.Stack<Map.Entry<Integer, Path>> pathStack = new java.util.Stack<>();
        // Start with a root-level entry with an indentation of -1.
        pathStack.push(new AbstractMap.SimpleEntry<>(-1, baseDir));

        for (String line : lines) {
            if (line.trim().isEmpty()) {
                continue;
            }

            // --- Calculate the current line's indentation level ---e
            int indentLevel = 0;
            for (char c : line.toCharArray()) {
                if (c == ' ') {
                    indentLevel++;
                } else if (c == '\t') {
                    indentLevel += 4; // Treat a tab as 4 spaces for consistency.
                } else {
                    break;
                }
            }

            String itemName = line.trim();

            // --- Find the correct parent directory ---
            // Pop from the stack until we find a directory with a smaller indentation level.
            // This is the parent of the current item.
            while (pathStack.peek().getKey() >= indentLevel) {
                pathStack.pop();
            }
            Path parentDir = pathStack.peek().getValue();

            // --- Create the file or directory ---
            if (isFile(itemName)) {
                Path filePath = parentDir.resolve(itemName);
                Files.createDirectories(filePath.getParent()); // Ensure parent exists
                if (!Files.exists(filePath)) {
                    Files.createFile(filePath);
                    String content = getDefaultFileContent(itemName);
                    if (!content.isEmpty()) {
                        Files.write(filePath, content.getBytes());
                    }
                }
            } else {
                // It's a directory.
                // Remove any trailing slashes to prevent issues with path resolution.
                Path dirPath = parentDir.resolve(itemName.replaceAll("[/\\\\]$", ""));
                Files.createDirectories(dirPath);
                // Push the new directory onto the stack with its indentation level.
                pathStack.push(new AbstractMap.SimpleEntry<>(indentLevel, dirPath));
            }
        }
    }


    /**
     * A more robust check to determine if a given name is a file or a directory.
     * - If it ends with a slash, it's a directory.
     * - Otherwise, if it contains a dot, we assume it's a file.
     * - Otherwise, it's a directory.
     */
    private boolean isFile(String name) {
        String trimmedName = name.trim();
        if (trimmedName.endsWith("/") || trimmedName.endsWith("\\")) {
            return false; // Definitely a directory
        }
        // A simple but effective heuristic: if it has a file extension, it's a file.
        // This handles cases like "com.example.project" correctly being a directory.
        if (trimmedName.lastIndexOf('.') > trimmedName.lastIndexOf('/')) {
            return true;
        }
        return false;
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
        int lastDot = fileName.lastIndexOf('.');
        if (lastDot == -1) {
            return fileName.substring(0, 1).toUpperCase() + fileName.substring(1);
        }
        String nameWithoutExtension = fileName.substring(0, lastDot);
        return nameWithoutExtension.substring(0, 1).toUpperCase() + nameWithoutExtension.substring(1);
    }

    private byte[] createZipFromDirectory(Path sourceDir) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            Files.walk(sourceDir)
                    .filter(path -> !Files.isDirectory(path))
                    .forEach(path -> {
                        // We need to make sure the entry name uses forward slashes for compatibility
                        String entryName = sourceDir.relativize(path).toString().replace('\\', '/');
                        ZipEntry zipEntry = new ZipEntry(entryName);
                        try {
                            zos.putNextEntry(zipEntry);
                            Files.copy(path, zos);
                            zos.closeEntry();
                        } catch (IOException e) {
                            // Using a more specific runtime exception
                            throw new RuntimeException("Failed to add entry to zip: " + entryName, e);
                        }
                    });
        }

        return baos.toByteArray();
    }

    private void deleteDirectory(Path directory) {
        if (directory != null && Files.exists(directory)) {
            try {
                Files.walk(directory)
                        .sorted((a, b) -> b.compareTo(a)) // Delete files before directories
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                // Log or handle the error, but don't stop the cleanup process
                                System.err.println("Failed to delete: " + path + " - " + e.getMessage());
                            }
                        });
            } catch (IOException e) {
                System.err.println("Failed to walk directory for deletion: " + directory + " - " + e.getMessage());
            }
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
            throw new SecurityException("Unauthorized access to history item");
        }

        historyRepository.deleteById(id);
    }
}