package com.jash.folder_structure_generator.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GeminiService() {
        this.webClient = WebClient.builder().build();
        this.objectMapper = new ObjectMapper();
    }

    public String validateAndCorrectStructure(String structureContent) throws IOException {
        logger.info("Starting Gemini validation for structure content");
        
        if ("YOUR_GEMINI_API_KEY_HERE".equals(apiKey) || apiKey == null || apiKey.trim().isEmpty()) {
            logger.warn("Gemini API key not configured, using basic improvement");
            return basicStructureImprovement(structureContent);
        }
        
        try {
            // Create the request payload for Gemini API
            ObjectNode requestBody = objectMapper.createObjectNode();
            
            // Create contents array
            ArrayNode contents = objectMapper.createArrayNode();
            ObjectNode content = objectMapper.createObjectNode();
            
            // Create parts array
            ArrayNode parts = objectMapper.createArrayNode();
            ObjectNode part = objectMapper.createObjectNode();
            part.put("text", createValidationPrompt(structureContent));
            parts.add(part);
            
            content.set("parts", parts);
            contents.add(content);
            requestBody.set("contents", contents);
            
            // Add generation config for better results
            ObjectNode generationConfig = objectMapper.createObjectNode();
            generationConfig.put("temperature", 0.1);
            generationConfig.put("topK", 40);
            generationConfig.put("topP", 0.95);
            generationConfig.put("maxOutputTokens", 2048);
            requestBody.set("generationConfig", generationConfig);
            
            logger.info("Sending request to Gemini API");
            
            // Make the API call
            String response = webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .bodyValue(requestBody.toString())
                .retrieve()
                .bodyToMono(String.class)
                .block();
            
            if (response != null) {
                JsonNode responseJson = objectMapper.readTree(response);
                
                // Extract the generated text from the response
                if (responseJson.has("candidates") && responseJson.get("candidates").isArray() && 
                    responseJson.get("candidates").size() > 0) {
                    
                    JsonNode candidate = responseJson.get("candidates").get(0);
                    if (candidate.has("content") && candidate.get("content").has("parts") && 
                        candidate.get("content").get("parts").isArray() && 
                        candidate.get("content").get("parts").size() > 0) {
                        
                        String validatedStructure = candidate.get("content").get("parts").get(0).get("text").asText();
                        logger.info("Successfully validated structure with Gemini");
                        return validatedStructure.trim();
                    }
                }
                
                logger.warn("Unexpected response format from Gemini API: {}", response);
            }
            
            logger.warn("No valid response from Gemini, returning original structure");
            return structureContent;
            
        } catch (Exception e) {
            logger.error("Error validating structure with Gemini: {}", e.getMessage(), e);
            logger.info("Falling back to original structure due to Gemini error");
            return structureContent; // Fallback to original structure
        }
    }
    
    private String basicStructureImprovement(String structureContent) {
        // Basic improvements without AI
        String improved = structureContent;
        
        // Add README.md if not present and it looks like a project structure
        if (!improved.contains("README.md") && (improved.contains("src/") || improved.contains("package.json"))) {
            if (improved.contains("\n")) {
                improved += "\nREADME.md";
            } else {
                improved += "README.md";
            }
        }
        
        // Add .gitignore if not present and it looks like a project structure
        if (!improved.contains(".gitignore") && (improved.contains("src/") || improved.contains("node_modules"))) {
            if (improved.contains("\n")) {
                improved += "\n.gitignore";
            } else {
                improved += ".gitignore";
            }
        }
        
        return improved;
    }
    
    private String createValidationPrompt(String structureContent) {
        return String.format("""
                You are an expert software architect and file structure validator.
                
                Your task is to analyze and process the following input, which could be a file/folder structure (in text or JSON format) or just high-level project ideas.
                
                Perform the following:
                	1.	Generate or validate the structure:
                	•	If the input is only an idea or project description, generate a relevant and realistic file/folder structure.
                	•	If the input is a structure, validate if it represents a correct directory/file hierarchy.
                	2.	Fix any issues:
                	•	Correct syntax errors, invalid characters, and nesting problems.
                	•	Ensure consistent formatting and structure integrity.
                	3.	Improve organization:
                	•	Organize related files/folders logically.
                	•	Group, rename, or restructure items if it improves clarity and maintainability.
                	4.	Add essential/common files:
                	•	Include files like README.md, .gitignore, package.json, Dockerfile, or requirements.txt based on the project type or context.
                	5.	Maintain input format:
                	•	If the input is in indented text format, return the output using 2-space indentation.
                	•	If the input is in JSON format, return valid, properly formatted JSON.
                
                Output Instructions:
                	•	Return only the corrected or generated file structure.
                	•	Do not include explanations, extra formatting, or markdown.
                	•	Always return the final structure in the same format as the input (text or JSON).
            **Return only the corrected/improved structure without any explanations, markdown formatting, or code blocks.**
            """, structureContent);
    }
    

}
