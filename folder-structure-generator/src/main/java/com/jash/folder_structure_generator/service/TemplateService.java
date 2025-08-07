package com.jash.folder_structure_generator.service;

import com.jash.folder_structure_generator.dto.Template;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class TemplateService {

    public List<Template> getTemplates() {
        return Arrays.asList(
                // --- Existing Templates ---
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
                ),

                // --- New Templates (50+) ---

                // --- Frontend ---
                new Template(
                        "react-vite-ts",
                        "React + Vite + TypeScript",
                        "A modern frontend template with React, Vite, and TypeScript.",
                        "{\n  \"src\": {\n    \"assets\": [],\n    \"components\": {\n      \"HelloWorld.tsx\": null\n    },\n    \"App.tsx\": null,\n    \"index.css\": null,\n    \"main.tsx\": null,\n    \"vite-env.d.ts\": null\n  },\n  \"public\": {\n    \"vite.svg\": null\n  },\n  \"index.html\": null,\n  \"package.json\": \"{\\n  \\\"name\\\": \\\"react-vite-ts-project\\\",\\n  \\\"private\\\": true,\\n  \\\"version\\\": \\\"0.0.0\\\",\\n  \\\"type\\\": \\\"module\\\",\\n  \\\"scripts\\\": {\\n    \\\"dev\\\": \\\"vite\\\",\\n    \\\"build\\\": \\\"tsc && vite build\\\",\\n    \\\"preview\\\": \\\"vite preview\\\"\\n  },\\n  \\\"dependencies\\\": {\\n    \\\"react\\\": \\\"^18.2.0\\\",\\n    \\\"react-dom\\\": \\\"^18.2.0\\\"\\n  },\\n  \\\"devDependencies\\\": {\\n    \\\"@types/react\\\": \\\"^18.2.15\\\",\\n    \\\"@types/react-dom\\\": \\\"^18.2.7\\\",\\n    \\\"@vitejs/plugin-react\\\": \\\"^4.0.3\\\",\\n    \\\"typescript\\\": \\\"^5.0.2\\\",\\n    \\\"vite\\\": \\\"^4.4.5\\\"\\n  }\\n}\",\n  \"tsconfig.json\": \"{\\n  \\\"compilerOptions\\\": {\\n    \\\"target\\\": \\\"ES2020\\\",\\n    \\\"useDefineForClassFields\\\": true,\\n    \\\"lib\\\": [\\\"ES2020\\\", \\\"DOM\\\", \\\"DOM.Iterable\\\"],\\n    \\\"module\\\": \\\"ESNext\\\",\\n    \\\"skipLibCheck\\\": true,\\n    \\\"moduleResolution\\\": \\\"bundler\\\",\\n    \\\"allowImportingTsExtensions\\\": true,\\n    \\\"resolveJsonModule\\\": true,\\n    \\\"isolatedModules\\\": true,\\n    \\\"noEmit\\\": true,\\n    \\\"jsx\\\": \\\"react-jsx\\\",\\n    \\\"strict\\\": true,\\n    \\\"noUnusedLocals\\\": true,\\n    \\\"noUnusedParameters\\\": true,\\n    \\\"noFallthroughCasesInSwitch\\\": true\\n  },\\n  \\\"include\\\": [\\\"src\\\"],\\n  \\\"references\\\": [{\\n    \\\"path\\\": \\\"./tsconfig.node.json\\\"\\n  }]\\n}\",\n  \"tsconfig.node.json\": \"{\\n  \\\"compilerOptions\\\": {\\n    \\\"composite\\\": true,\\n    \\\"skipLibCheck\\\": true,\\n    \\\"module\\\": \\\"ESNext\\\",\\n    \\\"moduleResolution\\\": \\\"bundler\\\",\\n    \\\"allowSyntheticDefaultImports\\\": true\\n  },\\n  \\\"include\\\": [\\\"vite.config.ts\\\"]\\n}\",\n  \"vite.config.ts\": null,\n  \"README.md\": \"# React + Vite + TypeScript Project\"\n}",
                        "json"
                ),
                new Template(
                        "vue-vite",
                        "Vue + Vite",
                        "A lightweight and fast Vue.js project setup with Vite.",
                        "src/\n  assets/\n    vue.svg\n  components/\n    HelloWorld.vue\n  App.vue\n  main.js\n  style.css\npublic/\n  vite.svg\nindex.html\npackage.json\nREADME.md",
                        "text"
                ),
                new Template(
                        "angular-cli",
                        "Angular CLI Project",
                        "A standard Angular project generated with Angular CLI.",
                        "{\n  \"src\": {\n    \"app\": {\n      \"app.component.css\": null,\n      \"app.component.html\": null,\n      \"app.component.spec.ts\": null,\n      \"app.component.ts\": null,\n      \"app.module.ts\": null\n    },\n    \"assets\": [],\n    \"environments\": {\n      \"environment.prod.ts\": null,\n      \"environment.ts\": null\n    },\n    \"favicon.ico\": null,\n    \"index.html\": null,\n    \"main.ts\": null,\n    \"polyfills.ts\": null,\n    \"styles.css\": null,\n    \"test.ts\": null\n  },\n  \".editorconfig\": null,\n  \".gitignore\": null,\n  \"angular.json\": \"{... angular config ...}\",\n  \"package.json\": \"{... angular dependencies ...}\",\n  \"tsconfig.app.json\": null,\n  \"tsconfig.json\": null,\n  \"tsconfig.spec.json\": null,\n  \"README.md\": \"# Angular Project\"\n}",
                        "json"
                ),
                new Template(
                        "nextjs-app",
                        "Next.js App Router",
                        "A modern Next.js project using the App Router.",
                        "app/\n  favicon.ico\n  globals.css\n  layout.tsx\n  page.tsx\npublic/\n  next.svg\n  vercel.svg\n.gitignore\nnext.config.js\npackage.json\nREADME.md\ntsconfig.json",
                        "text"
                ),
                new Template(
                        "svelte-kit",
                        "SvelteKit Project",
                        "A full-stack Svelte application using SvelteKit.",
                        "src/\n  lib/\n    index.js\n  routes/\n    +page.svelte\n    +layout.svelte\napp.html\npackage.json\nsvelte.config.js\nvite.config.js\nREADME.md",
                        "text"
                ),
                new Template(
                        "html5-boilerplate",
                        "HTML5 Boilerplate",
                        "A professional front-end template for a fast, robust, and adaptable web app.",
                        "css/\n  main.css\n  normalize.css\ndoc/\njs/\n  main.js\n  vendor/\n    modernizr-3.11.2.min.js\n.gitignore\n404.html\nindex.html\nicon.png\nsite.webmanifest\nrobots.txt",
                        "text"
                ),
                new Template(
                        "astro-build",
                        "Astro Project",
                        "A basic Astro project for content-driven websites.",
                        "src/\n  components/\n    Card.astro\n  layouts/\n    Layout.astro\n  pages/\n    index.astro\n  styles/\n    global.css\npublic/\n  favicon.svg\nastro.config.mjs\npackage.json\nREADME.md\ntsconfig.json",
                        "text"
                ),
                new Template(
                        "gatsby-starter",
                        "Gatsby Starter",
                        "A starter template for building static sites with Gatsby.",
                        "src/\n  components/\n    layout.js\n    seo.js\n  images/\n    gatsby-icon.png\n  pages/\n    404.js\n    index.js\n.gitignore\ngatsby-config.js\npackage.json\nREADME.md",
                        "text"
                ),

                // --- Backend ---
                new Template(
                        "nestjs-api",
                        "NestJS API",
                        "A progressive Node.js framework for building efficient and scalable server-side applications.",
                        "{\n  \"src\": {\n    \"app.controller.spec.ts\": null,\n    \"app.controller.ts\": null,\n    \"app.module.ts\": null,\n    \"app.service.ts\": null,\n    \"main.ts\": null\n  },\n  \"test\": {\n    \"app.e2e-spec.ts\": null,\n    \"jest-e2e.json\": null\n  },\n  \".eslintrc.js\": null,\n  \".gitignore\": null,\n  \".prettierrc\": null,\n  \"nest-cli.json\": null,\n  \"package.json\": \"{\\\"name\\\": \\\"nest-api\\\", ...}\",\n  \"tsconfig.build.json\": null,\n  \"tsconfig.json\": null,\n  \"README.md\": \"# NestJS API\"\n}",
                        "json"
                ),
                new Template(
                        "flask-api",
                        "Python Flask API",
                        "A minimal Flask application for building a REST API.",
                        "app/\n  __init__.py\n  routes.py\n  models.py\ninstance/\n  config.py\n.flaskenv\nconfig.py\nrequirements.txt\nrun.py\nREADME.md",
                        "text"
                ),
                new Template(
                        "fastapi-app",
                        "Python FastAPI App",
                        "A modern, fast (high-performance) web framework for building APIs with Python 3.7+.",
                        "app/\n  __init__.py\n  main.py\n  dependencies.py\n  routers/\n    items.py\n    users.py\n  internal/\n    admin.py\n.gitignore\nrequirements.txt\nREADME.md",
                        "text"
                ),
                new Template(
                        "ruby-on-rails",
                        "Ruby on Rails API",
                        "A standard Ruby on Rails project for building a backend API.",
                        "app/\n  controllers/\n    api/\n      v1/\n        items_controller.rb\n  models/\n    item.rb\nconfig/\n  routes.rb\ndb/\n  migrate/\n    create_items.rb\nGemfile\nRakefile\nREADME.md",
                        "text"
                ),
                new Template(
                        "laravel-api",
                        "PHP Laravel API",
                        "A standard Laravel project structure for a RESTful API.",
                        "app/\n  Http/\n    Controllers/\n      Api/\n        PostController.php\n  Models/\n    Post.php\nroutes/\n  api.php\n.env.example\nartisan\ncomposer.json\nREADME.md",
                        "text"
                ),
                new Template(
                        "go-gin-api",
                        "Go Gin API",
                        "A REST API project using the Gin framework in Go.",
                        "cmd/\n  api/\n    main.go\ninternal/\n  handlers/\n    item_handler.go\n  models/\n    item.go\n  routes/\n    routes.go\n.gitignore\ngo.mod\nREADME.md",
                        "text"
                ),
                new Template(
                        "rust-actix-web",
                        "Rust Actix-Web API",
                        "A simple REST API built with Rust and the Actix-Web framework.",
                        "src/\n  main.rs\n  handlers.rs\n  models.rs\n.gitignore\nCargo.toml\nREADME.md",
                        "text"
                ),
                new Template(
                        "ktor-api",
                        "Kotlin Ktor API",
                        "A web application framework for Kotlin. Asynchronous and lightweight.",
                        "src/\n  main/\n    kotlin/\n      com/example/\n        Application.kt\n        plugins/\n          Routing.kt\n          Serialization.kt\n    resources/\n      application.conf\n      logback.xml\n.gitignore\nbuild.gradle.kts\ngradlew\nREADME.md",
                        "text"
                ),
                new Template(
                        "quarkus-api",
                        "Java Quarkus API",
                        "A Supersonic Subatomic Java Framework for building fast-launching, low-memory applications.",
                        "src/\n  main/\n    java/\n      org/acme/\n        GreetingResource.java\n    resources/\n      application.properties\n.gitignore\nmvnw\npom.xml\nREADME.md",
                        "text"
                ),

                // --- Full Stack ---
                new Template(
                        "mern-stack",
                        "MERN Stack",
                        "A full-stack application with MongoDB, Express, React, and Node.js.",
                        "{\n  \"client\": {\n    \"public\": {\n      \"index.html\": null\n    },\n    \"src\": {\n      \"App.js\": null,\n      \"index.js\": null\n    },\n    \"package.json\": \"{\\\"name\\\": \\\"client\\\", ...}\"\n  },\n  \"server\": {\n    \"controllers\": {\n      \"itemController.js\": null\n    },\n    \"models\": {\n      \"Item.js\": null\n    },\n    \"routes\": {\n      \"api.js\": null\n    },\n    \"config.js\": null,\n    \"package.json\": \"{\\\"name\\\": \\\"server\\\", ...}\",\n    \"server.js\": null\n  },\n  \".gitignore\": null,\n  \"README.md\": \"# MERN Stack Project\"\n}",
                        "json"
                ),
                new Template(
                        "mean-stack",
                        "MEAN Stack",
                        "A full-stack application with MongoDB, Express, Angular, and Node.js.",
                        "client/\n  src/\n    app/\n      app.module.ts\n    main.ts\n  angular.json\nserver/\n  models/\n    user.model.js\n  routes/\n    user.route.js\n  server.js\npackage.json\nREADME.md",
                        "text"
                ),
                new Template(
                        "mevn-stack",
                        "MEVN Stack",
                        "A full-stack application with MongoDB, Express, Vue, and Node.js.",
                        "client/\n  src/\n    components/\n      HelloWorld.vue\n    App.vue\n  vite.config.js\nserver/\n  controllers/\n    post.controller.js\n  models/\n    post.model.js\n  server.js\npackage.json\nREADME.md",
                        "text"
                ),
                new Template(
                        "django-react",
                        "Django + React",
                        "A project with Django serving a REST API and a React frontend.",
                        "backend/\n  api/\n    serializers.py\n    views.py\n  project/\n    settings.py\n  manage.py\nfrontend/\n  src/\n    components/\n    App.js\n  package.json\nREADME.md",
                        "text"
                ),

                // --- Mobile ---
                new Template(
                        "react-native-cli",
                        "React Native CLI",
                        "A basic React Native project structure.",
                        "android/\nios/\nsrc/\n  components/\n  screens/\n  navigation/\n  App.js\n.gitignore\npackage.json\nREADME.md",
                        "text"
                ),
                new Template(
                        "flutter-app",
                        "Flutter Application",
                        "A standard Flutter application structure.",
                        "android/\nios/\nlib/\n  main.dart\n  screens/\n  widgets/\n  models/\ntest/\n.gitignore\npubspec.yaml\nREADME.md",
                        "text"
                ),
                new Template(
                        "swift-ios-app",
                        "Swift iOS App",
                        "A basic iOS application structure using Swift and UIKit.",
                        "AppName/\n  AppDelegate.swift\n  SceneDelegate.swift\n  ViewController.swift\n  Base.lproj/\n    LaunchScreen.storyboard\n    Main.storyboard\n  Assets.xcassets/\nInfo.plist",
                        "text"
                ),
                new Template(
                        "kotlin-android-app",
                        "Kotlin Android App",
                        "A basic Android application structure using Kotlin and XML.",
                        "app/\n  src/\n    main/\n      java/com/example/app/\n        MainActivity.kt\n      res/\n        drawable/\n        layout/\n          activity_main.xml\n        values/\n          colors.xml\n          strings.xml\n          themes.xml\n      AndroidManifest.xml\n  build.gradle\n.gitignore",
                        "text"
                ),

                // --- Desktop ---
                new Template(
                        "electron-app",
                        "Electron App",
                        "A cross-platform desktop application using Electron, HTML, CSS, and JS.",
                        "{\n  \"src\": {\n    \"main.js\": \"// Main process\",\n    \"preload.js\": \"// Preload script\",\n    \"renderer.js\": \"// Renderer process\"\n  },\n  \"index.html\": null,\n  \"package.json\": \"{\\n  \\\"name\\\": \\\"electron-app\\\",\\n  \\\"version\\\": \\\"1.0.0\\\",\\n  \\\"main\\\": \\\"src/main.js\\\",\\n  \\\"scripts\\\": {\\n    \\\"start\\\": \\\"electron .\\\"\\n  },\\n  \\\"devDependencies\\\": {\\n    \\\"electron\\\": \\\"^25.0.0\\\"\\n  }\\n}\",\n  \"README.md\": \"# Electron App\"\n}",
                        "json"
                ),
                new Template(
                        "tauri-app",
                        "Tauri App",
                        "A secure, fast, and small desktop application with a Rust backend and web frontend.",
                        "src-tauri/\n  src/\n    main.rs\n  tauri.conf.json\n  build.rs\nsrc/\n  main.jsx\n  style.css\n.gitignore\nindex.html\npackage.json",
                        "text"
                ),

                // --- Data Science & ML ---
                new Template(
                        "python-datascience",
                        "Python Data Science Project",
                        "A standard structure for a data science project in Python.",
                        "data/\n  raw/\n  processed/\nnotebooks/\n  1.0-data-exploration.ipynb\n  2.0-feature-engineering.ipynb\n  3.0-model-training.ipynb\nsrc/\n  __init__.py\n  data/\n    make_dataset.py\n  features/\n    build_features.py\n  models/\n    predict_model.py\n    train_model.py\n  visualization/\n    visualize.py\n.gitignore\nrequirements.txt\nREADME.md",
                        "text"
                ),
                new Template(
                        "pytorch-project",
                        "PyTorch Project",
                        "A basic structure for a deep learning project using PyTorch.",
                        "data/\nmodels/\n  model.py\nsrc/\n  dataset.py\n  engine.py\n  train.py\nconfig.py\nrequirements.txt\nREADME.md",
                        "text"
                ),
                new Template(
                        "tensorflow-project",
                        "TensorFlow Project",
                        "A basic structure for a deep learning project using TensorFlow/Keras.",
                        "data/\nnotebooks/\n  eda.ipynb\nsrc/\n  data_loader.py\n  model_builder.py\n  train.py\n  evaluate.py\nrequirements.txt\nREADME.md",
                        "text"
                ),

                // --- DevOps & Infrastructure ---
                new Template(
                        "docker-compose-app",
                        "Docker Compose App",
                        "A multi-container application defined with Docker Compose.",
                        "{\n  \"backend\": {\n    \"Dockerfile\": null,\n    \"app.py\": null,\n    \"requirements.txt\": null\n  },\n  \"frontend\": {\n    \"Dockerfile\": null,\n    \"src\": [],\n    \"package.json\": null\n  },\n  \"docker-compose.yml\": \"version: '3.8'\\nservices:\\n  backend:\\n    build: ./backend\\n    ports:\\n      - \\\"5000:5000\\\"\\n  frontend:\\n    build: ./frontend\\n    ports:\\n      - \\\"3000:3000\\\"\\n\",\n  \"README.md\": \"# Docker Compose App\"\n}",
                        "json"
                ),
                new Template(
                        "terraform-aws",
                        "Terraform AWS S3",
                        "A basic Terraform configuration to provision an S3 bucket on AWS.",
                        "modules/\n  s3-bucket/\n    main.tf\n    variables.tf\n    outputs.tf\n.gitignore\nmain.tf\nproviders.tf\nterraform.tfvars\nvariables.tf\nREADME.md",
                        "text"
                ),
                new Template(
                        "kubernetes-manifests",
                        "Kubernetes Manifests",
                        "A set of Kubernetes YAML manifests for deploying an application.",
                        "base/\n  deployment.yaml\n  service.yaml\n  configmap.yaml\n  kustomization.yaml\noverlays/\n  production/\n    kustomization.yaml\n    patch.yaml\n  staging/\n    kustomization.yaml\n    patch.yaml\nREADME.md",
                        "text"
                ),
                new Template(
                        "ansible-playbook",
                        "Ansible Playbook",
                        "A basic Ansible structure for server configuration.",
                        "group_vars/\n  all.yml\nhost_vars/\n  server1.yml\nroles/\n  common/\n    tasks/\n      main.yml\n  webserver/\n    tasks/\n      main.yml\n    templates/\n      httpd.conf.j2\n.gitignore\ninventory\nplaybook.yml\nansible.cfg\nREADME.md",
                        "text"
                ),
                new Template(
                        "github-action-ci",
                        "GitHub Action CI",
                        "A basic CI pipeline for a Node.js project using GitHub Actions.",
                        ".github/\n  workflows/\n    ci.yml\nsrc/\n  index.js\n  index.test.js\n.gitignore\npackage.json\nREADME.md",
                        "text"
                ),

                // --- Libraries & Packages ---
                new Template(
                        "npm-package",
                        "NPM Package",
                        "A boilerplate for creating a new NPM package with TypeScript.",
                        "{\n  \"dist\": [],\n  \"src\": {\n    \"index.ts\": null\n  },\n  \".gitignore\": null,\n  \"package.json\": \"{\\n  \\\"name\\\": \\\"my-awesome-package\\\",\\n  \\\"version\\\": \\\"1.0.0\\\",\\n  \\\"main\\\": \\\"dist/index.js\\\",\\n  \\\"types\\\": \\\"dist/index.d.ts\\\",\\n  \\\"scripts\\\": {\\n    \\\"build\\\": \\\"tsc\\\"\\n  },\\n  \\\"devDependencies\\\": {\\n    \\\"typescript\\\": \\\"^5.0.0\\\"\\n  }\\n}\",\n  \"tsconfig.json\": null,\n  \"README.md\": \"# My Awesome Package\"\n}",
                        "json"
                ),
                new Template(
                        "python-package-pyproject",
                        "Python Package (pyproject.toml)",
                        "A modern Python package structure using pyproject.toml and setuptools.",
                        "src/\n  my_package/\n    __init__.py\n    module.py\ntests/\n  test_module.py\n.gitignore\npyproject.toml\nREADME.md",
                        "text"
                ),
                new Template(
                        "rust-library",
                        "Rust Library",
                        "A standard Rust library (crate) structure.",
                        "src/\n  lib.rs\n  main.rs  # for examples\n.gitignore\nCargo.toml\nREADME.md",
                        "text"
                ),
                new Template(
                        "go-module",
                        "Go Module/Library",
                        "A basic structure for a reusable Go module.",
                        "utils/\n  strings.go\n  strings_test.go\n.gitignore\ngo.mod\nLICENSE\nREADME.md",
                        "text"
                ),

                // --- Specialized Applications ---
                new Template(
                        "chrome-extension",
                        "Chrome Extension",
                        "A minimal boilerplate for a browser extension for Google Chrome.",
                        "{\n  \"icons\": {\n    \"icon16.png\": null,\n    \"icon48.png\": null,\n    \"icon128.png\": null\n  },\n  \"background.js\": null,\n  \"content.js\": null,\n  \"manifest.json\": \"{\\n  \\\"manifest_version\\\": 3,\\n  \\\"name\\\": \\\"My Extension\\\",\\n  \\\"version\\\": \\\"1.0\\\",\\n  \\\"description\\\": \\\"A simple Chrome extension.\\\",\\n  \\\"permissions\\\": [\\\"storage\\\"],\\n  \\\"action\\\": {\\n    \\\"default_popup\\\": \\\"popup.html\\\"\\n  }\\n}\",\n  \"popup.html\": null,\n  \"popup.js\": null,\n  \"README.md\": \"# Chrome Extension\"\n}",
                        "json"
                ),
                new Template(
                        "vscode-extension",
                        "VS Code Extension",
                        "A template for building a Visual Studio Code extension with TypeScript.",
                        "src/\n  test/\n    runTest.ts\n    suite/\n      extension.test.ts\n      index.ts\n  extension.ts\n.vscodeignore\n.gitignore\npackage.json\ntsconfig.json\nREADME.md",
                        "text"
                ),
                new Template(
                        "discord-bot-js",
                        "Discord.js Bot",
                        "A basic Discord bot using the Discord.js library for Node.js.",
                        "commands/\n  utility/\n    ping.js\nevents/\n  interactionCreate.js\n  ready.js\n.env\n.gitignore\nconfig.json\ndeploy-commands.js\nindex.js\npackage.json\nREADME.md",
                        "text"
                ),
                new Template(
                        "discord-bot-py",
                        "Discord.py Bot",
                        "A basic Discord bot using the discord.py library for Python.",
                        "cogs/\n  greetings.py\nbot.py\nconfig.py\nrequirements.txt\nREADME.md",
                        "text"
                ),
                new Template(
                        "telegram-bot-py",
                        "Python Telegram Bot",
                        "A template for a bot on the Telegram platform using python-telegram-bot.",
                        "bot.py\nconfig.ini\nrequirements.txt\nREADME.md",
                        "text"
                ),
                new Template(
                        "graphql-yoga",
                        "GraphQL Yoga Server",
                        "A simple, spec-compliant GraphQL server using GraphQL Yoga.",
                        "src/\n  schema.ts\n  index.ts\n.gitignore\npackage.json\ntsconfig.json\nREADME.md",
                        "text"
                ),
                new Template(
                        "docusaurus-site",
                        "Docusaurus Site",
                        "A project for building optimized websites quickly, especially documentation sites.",
                        "blog/\n  2024-01-01-welcome.md\ndocs/\n  intro.md\nsrc/\n  css/\n    custom.css\n  pages/\n    index.js\nstatic/\n  img/\n    logo.svg\ndocusaurus.config.js\npackage.json\nsidebars.js\nREADME.md",
                        "text"
                ),

                // --- Game Development ---
                new Template(
                        "godot-project",
                        "Godot Project",
                        "A basic folder structure for a game project in the Godot Engine.",
                        "assets/\n  fonts/\n  music/\n  sprites/\nscenes/\n  main_menu.tscn\n  player.tscn\nscripts/\n  player.gd\n.gitignore\nicon.svg\nproject.godot\nREADME.md",
                        "text"
                ),
                new Template(
                        "unity-project",
                        "Unity Project",
                        "A standard folder structure for a game project in the Unity Engine.",
                        "Assets/\n  _Scenes/\n  _Scripts/\n  _Prefabs/\n  _Materials/\n  _Textures/\n  _Audio/\nProjectSettings/\nPackages/\n.gitignore\nREADME.md",
                        "text"
                ),
                new Template(
                        "bevy-game",
                        "Bevy Game (Rust)",
                        "A simple game project structure using the Bevy engine for Rust.",
                        "assets/\n  sprites/\n  audio/\nsrc/\n  main.rs\n  player.rs\n  camera.rs\n.gitignore\nCargo.toml\nREADME.md",
                        "text"
                ),

                // --- Miscellaneous ---
                new Template(
                        "markdown-book",
                        "Markdown Book (mdBook)",
                        "A project for creating a book from Markdown files.",
                        "book.toml\nsrc/\n  SUMMARY.md\n  chapter_1.md\n  chapter_2.md\nREADME.md",
                        "text"
                ),
                new Template(
                        "jekyll-site",
                        "Jekyll Site",
                        "A static site generated with Jekyll, perfect for blogs and portfolios.",
                        "_config.yml\n_includes/\n_layouts/\n  default.html\n  post.html\n_posts/\n  2024-01-01-welcome-to-jekyll.markdown\n_sass/\nassets/\n.gitignore\nabout.md\nindex.md\nGemfile",
                        "text"
                ),
                new Template(
                        "phoenix-framework",
                        "Elixir Phoenix Framework",
                        "A productive web framework that does not compromise speed and maintainability.",
                        "lib/\n  my_app/\n  my_app_web/\n    controllers/\n    templates/\n    views/\n    router.ex\n  my_app.ex\n  my_app_web.ex\nassets/\n  css/\n  js/\n.gitignore\nmix.exs\nREADME.md",
                        "text"
                ),
                new Template(
                        "deno-api",
                        "Deno Oak API",
                        "A REST API built with Deno and the Oak middleware framework.",
                        "deps.ts\ndev_deps.ts\nmod.ts\nrouter.ts\ncontrollers/\n  userController.ts\n.gitignore\nREADME.md",
                        "text"
                )

        );
    }
}