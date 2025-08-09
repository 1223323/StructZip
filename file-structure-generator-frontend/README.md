# File Structure Generator Frontend

A modern React application for generating file structures from text or JSON input. Built with Vite, React, Tailwind CSS, and Lucide React icons.

## Features

- **User Authentication**: Login and registration with JWT tokens
- **File Structure Generation**: Create file structures from text or JSON input
- **Dark/Light Theme**: Toggle between dark and light themes
- **History Management**: View previously generated structures
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS

## Tech Stack

- **React 18.2.0** - UI framework
- **Vite 5.0.8** - Build tool and dev server
- **React Router DOM 6.8.0** - Client-side routing
- **Axios 1.6.0** - HTTP client
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Lucide React 0.263.1** - Icon library
- **PostCSS & Autoprefixer** - CSS processing

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd file-structure-generator-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## API Configuration

The frontend is configured to proxy API requests to `http://localhost:8080`. Make sure your backend server is running on that port, or update the proxy configuration in `vite.config.js`.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   └── ProtectedRoute.jsx # Route protection component
├── context/            # React context providers
│   ├── AuthContext.jsx # Authentication state management
│   └── ThemeContext.jsx # Theme state management
├── pages/              # Page components
│   ├── Home.jsx        # Main file structure generator
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   └── History.jsx     # User history page
├── App.jsx             # Main app component
├── main.jsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Authentication
- JWT-based authentication
- Automatic token management
- Protected routes
- Persistent login state

### File Structure Generation
- Support for both text and JSON input formats
- Example templates for quick start
- ZIP file download
- Real-time validation

### Theme System
- Dark and light mode support
- System preference detection
- Persistent theme selection
- Smooth transitions

### History Management
- View all generated structures
- Expandable content view
- Timestamp tracking
- Empty state handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is part of the StructZip application. 