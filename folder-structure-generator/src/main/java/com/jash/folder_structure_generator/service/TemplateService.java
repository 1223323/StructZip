package com.jash.folder_structure_generator.service;

import com.jash.folder_structure_generator.dto.Template;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class TemplateService {

    public List<Template> getTemplates() {
        return Arrays.asList(
            new Template(
                "react-vite",
                "React + Vite",
                "A modern frontend template with React and Vite.",
                "{\n  \"src\": {\n    \"assets\": [],\n    \"components\": {\n      \"HelloWorld.jsx\": null\n    },\n    \"App.jsx\": null,\n    \"index.css\": null,\n    \"main.jsx\": null\n  },\n  \"public\": {\n    \"vite.svg\": null\n  },\n  \"index.html\": null,\n  \"package.json\": \"{\\n  \\\"name\\\": \\\"react-vite-project\\\",\\n  \\\"private\\\": true,\\n  \\\"version\\\": \\\"0.0.0\\\",\\n  \\\"type\\\": \\\"module\\\",\\n  \\\"scripts\\\": {\\n    \\\"dev\\\": \\\"vite\\\",\\n    \\\"build\\\": \\\"vite build\\\",\\n    \\\"preview\\\": \\\"vite preview\\\"\\n  },\\n  \\\"dependencies\\\": {\\n    \\\"react\\\": \\\"^18.2.0\\\",\\n    \\\"react-dom\\\": \\\"^18.2.0\\\"\\n  },\\n  \\\"devDependencies\\\": {\\n    \\\"@vitejs/plugin-react\\\": \\\"^4.0.0\\\",\\n    \\\"vite\\\": \\\"^4.2.0\\\"\\n  }\\n}\",\n  \"README.md\": \"# React + Vite Project\"\n}",
                "json"
            ),
            new Template(
                "express-js",
                "Node.js + Express",
                "A basic backend structure for an Express.js API.",
                "src/\n  controllers/\n    userController.js\n  models/\n    userModel.js\n  routes/\n    userRoutes.js\n  app.js\n  server.js\n.env\n.gitignore\npackage.json\nREADME.md",
                "text"
            ),
            new Template(
                "spring-boot",
                "Spring Boot API",
                "A standard Maven project for a Spring Boot REST API.",
                "src/\n  main/\n    java/\n      com/\n        example/\n          demo/\n            controller/\n              ApiController.java\n            model/\n              Item.java\n            repository/\n              ItemRepository.java\n            service/\n              ApiService.java\n            DemoApplication.java\n    resources/\n      application.properties\n  test/\n    java/\n      com/\n        example/\n          demo/\n            DemoApplicationTests.java\npom.xml\nREADME.md",
                "text"
            ),
            new Template(
                "django-project",
                "Django Project",
                "A standard Django project with a single app.",
                "myproject/\n  __init__.py\n  asgi.py\n  settings.py\n  urls.py\n  wsgi.py\nmyapp/\n  __init__.py\n  admin.py\n  apps.py\n  migrations/\n    __init__.py\n  models.py\n  tests.py\n  views.py\n  urls.py\nmanage.py\nrequirements.txt\nREADME.md",
                "text"
            )
        );
}
