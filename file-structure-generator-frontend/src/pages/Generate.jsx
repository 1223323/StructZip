// Generate.jsx - Fixed version
import React, { useState, useEffect, useRef } from 'react';
import api from '../service/api';
import { Download, FileText, AlertCircle, Sparkles, X, Check, LayoutGrid, Zap, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GeminiChat from '../components/GeminiChat';
import TemplateGallery from '../components/TemplateGallery';
import TemplatesInlineSection from '../components/TemplatesInlineSection';

const containerVariants = { 
  hidden: { opacity: 0 }, 
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 } 
  } 
};

const itemVariants = { 
  hidden: { opacity: 0, y: 20 }, 
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: 'easeOut' } 
  } 
};

const FormatSwitcher = ({ format, setFormat }) => (
  <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
    {['json', 'text'].map((f) => (
      <button 
        key={f} 
        onClick={() => setFormat(f)}
        className={`relative flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all ${
          format === f 
            ? 'text-slate-900 dark:text-white shadow-sm' 
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        {f.toUpperCase()}
        {format === f && (
          <motion.div 
            className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm -z-10" 
            layoutId="format-switcher-active" 
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} 
          />
        )}
      </button>
    ))}
  </div>
);

const Generate = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [structureInput, setStructureInput] = useState('');
  const [structureName, setStructureName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputFormat, setInputFormat] = useState('text');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedZip, setGeneratedZip] = useState(null);
  const [highlightEditor, setHighlightEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesError, setTemplatesError] = useState('');

  const modalRef = useRef(null);
  const editorRef = useRef(null);

  // Fetch templates once and share with children
  useEffect(() => {
    let active = true;
    const fetchTemplates = async () => {
      try {
        setTemplatesLoading(true);
        const res = await api.get('/api/templates');
        const data = Array.isArray(res.data) ? res.data : [];
        if (active) {
          setTemplates(data);
          setTemplatesError('');
        }
      } catch (e) {
        console.error('Failed to load templates:', e);
        if (active) {
          setTemplatesError('Could not load templates.');
          setTemplates([]);
        }
      } finally {
        if (active) setTemplatesLoading(false);
      }
    };
    fetchTemplates();
    return () => { active = false; };
  }, []);

  // Enhanced example structures with better formatting
  const exampleTextStructure = `src/
  components/
    Button.jsx
    Card.jsx
    Layout/
      Header.jsx
      Footer.jsx
  pages/
    Home.jsx
    About.jsx
    Contact.jsx
  hooks/
    useApi.js
  utils/
    helpers.js
  App.jsx
  index.css
  main.jsx
public/
  index.html
  favicon.ico
package.json
README.md
.gitignore`;

  const exampleJsonStructure = JSON.stringify({
    "src": {
      "components": {
        "Button.jsx": "// React Button Component",
        "Card.jsx": "// React Card Component",
        "Layout": {
          "Header.jsx": null,
          "Footer.jsx": null
        }
      },
      "pages": {
        "Home.jsx": "// Home Page Component",
        "About.jsx": null,
        "Contact.jsx": null
      },
      "hooks": {
        "useApi.js": "// Custom API Hook"
      },
      "utils": {
        "helpers.js": "// Utility Functions"
      },
      "App.jsx": "// Main App Component",
      "index.css": "/* Global Styles */",
      "main.jsx": "// App Entry Point"
    },
    "public": {
      "index.html": "<!DOCTYPE html>...",
      "favicon.ico": null
    },
    "package.json": "{\n  \"name\": \"my-project\",\n  \"version\": \"1.0.0\"\n}",
    "README.md": "# My Project\n\nProject description here...",
    ".gitignore": "node_modules/\n.env\ndist/"
  }, null, 2);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setStructureName(template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    setStructureInput(template.content);
    setInputFormat(template.format);
    setError('');

    // Smooth scroll to editor with better timing
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
    
    // Enhanced highlight effect
    setHighlightEditor(true);
    setTimeout(() => setHighlightEditor(false), 2000);
  };

  const handleClearTemplate = () => {
    setSelectedTemplate(null);
    setStructureInput('');
    setStructureName('');
    setError('');
  };

  const handleGenerate = async () => {
    if (!structureInput.trim()) {
      setError('Please provide a file structure.');
      return;
    }

    // Validate JSON format if selected
    if (inputFormat === 'json') {
      try {
        JSON.parse(structureInput);
      } catch (e) {
        setError('Invalid JSON format. Please check your structure.');
        return;
      }
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/api/generate-structure', { 
        structureContent: structureInput, 
        structureName: structureName || 'generated-structure',
        format: inputFormat
      }, { 
        responseType: 'blob',
        timeout: 30000 // 30 seconds timeout
      });
      
      const zipBlob = new Blob([response.data], { type: 'application/zip' });
      const zipUrl = window.URL.createObjectURL(zipBlob);
      setGeneratedZip({ 
        url: zipUrl, 
        name: `${structureName || 'generated-structure'}.zip` 
      });
      setShowSuccessModal(true);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again with a smaller structure.');
      } else {
        setError(err.response?.data?.error || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedZip) return;
    const link = document.createElement('a');
    link.href = generatedZip.url;
    link.setAttribute('download', generatedZip.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      window.URL.revokeObjectURL(generatedZip.url);
      setGeneratedZip(null);
      setShowSuccessModal(false);
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowSuccessModal(false);
      }
    };
    if (showSuccessModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuccessModal]);

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-12 px-4">
      {/* Hero Section */}
      <motion.div 
        className="text-center" 
        initial="hidden" 
        animate="visible" 
        variants={itemVariants}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
          Create Your 
          <span className="text-indigo-600 dark:text-indigo-400 block md:inline md:ml-4">
            Structure
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Instantly scaffold any project from a template or your own design. 
          Generate organized file structures with a single click.
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl" 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Step 1: Templates */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-2xl text-slate-900 dark:text-white mb-2">
                1. Start with a Template
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Choose from our curated collection or browse all templates
              </p>
            </div>
            <button 
              onClick={() => setIsGalleryOpen(true)} 
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all flex items-center space-x-2 hover:scale-105"
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Browse All</span>
            </button>
          </div>
          <TemplatesInlineSection 
            onSelectTemplate={handleSelectTemplate}
            templates={templates}
            loading={templatesLoading}
            error={templatesError}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center my-12">
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
          <span className="mx-6 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
            OR CUSTOMIZE
          </span>
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
        </div>

        {/* Step 2: Customization */}
        <div 
          ref={editorRef} 
          className={`space-y-8 transition-all duration-700 rounded-2xl p-6 ${
            highlightEditor 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/20 border-2 border-indigo-300 dark:border-indigo-600' 
              : 'bg-transparent'
          }`}
        >
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-2xl text-slate-900 dark:text-white mb-6">
              2. Customize Your Project
            </h3>
            
            {/* Selected Template Info */}
            <AnimatePresence>
              {selectedTemplate && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        Using template: <strong>{selectedTemplate.name}</strong>
                      </span>
                    </div>
                    <button
                      onClick={handleClearTemplate}
                      className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded-full transition-colors"
                      title="Clear template"
                    >
                      <X size={16} className="text-indigo-600 dark:text-indigo-400" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Project Name */}
            <div className="mb-6">
              <label htmlFor="structureName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Project Name
              </label>
              <input 
                id="structureName" 
                type="text" 
                className="w-full py-3 px-4 text-base bg-white/70 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all" 
                placeholder="my-awesome-project" 
                value={structureName} 
                onChange={(e) => setStructureName(e.target.value)} 
              />
            </div>

            {/* Format Selection and Editor */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  File Structure Definition
                </label>
                <FormatSwitcher format={inputFormat} setFormat={setInputFormat} />
              </div>
              
              {/* Enhanced Editor */}
              <div className="relative">
                <AnimatePresence>
                  {structureInput.length === 0 && (
                    <motion.pre
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-0 left-0 p-6 font-mono text-sm text-slate-400 dark:text-slate-500 select-none pointer-events-none w-full h-full overflow-hidden leading-relaxed z-10"
                      aria-hidden="true"
                    >
                      {inputFormat === 'text' ? exampleTextStructure : exampleJsonStructure}
                    </motion.pre>
                  )}
                </AnimatePresence>
                <textarea
                  id="structureInput"
                  className="relative z-20 w-full h-96 p-6 font-mono text-sm bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all duration-300 leading-relaxed resize-none"
                  value={structureInput}
                  onChange={(e) => setStructureInput(e.target.value)}
                  placeholder={`Enter your ${inputFormat} structure here...`}
                />
                
                {/* Character count */}
                <div className="absolute bottom-3 right-3 text-xs text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded">
                  {structureInput.length} characters
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center" 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Generate */}
        <motion.div 
          className="flex flex-col items-center justify-center pt-12" 
          variants={itemVariants}
        >
          <h3 className="font-bold text-2xl text-slate-900 dark:text-white mb-6">
            3. Generate Your ZIP
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-center max-w-md">
            Your project structure will be generated and packaged into a downloadable ZIP file
          </p>
          
          <button 
            onClick={handleGenerate} 
            disabled={loading || !structureInput.trim()} 
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.span 
                  key="loading" 
                  className="flex items-center" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                >
                  <RefreshCw className="animate-spin h-5 w-5 mr-3" />
                  Generating...
                </motion.span>
              ) : (
                <motion.span 
                  key="generate" 
                  className="flex items-center" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                >
                  <Sparkles className="h-5 w-5 mr-3" />
                  Generate & Download
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </motion.div>
      
      {/* Template Gallery Modal */}
      <TemplateGallery 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
        onSelectTemplate={handleSelectTemplate}
        templates={templates}
        loading={templatesLoading}
        error={templatesError}
      />
      
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <motion.div 
              ref={modalRef} 
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 border border-black/10 dark:border-white/10" 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center space-y-6">
                <motion.div 
                  className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                >
                  <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
                </motion.div>
                
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    Structure Generated!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Your project structure has been successfully created and is ready to download.
                  </p>
                </div>
                
                <div className="bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-4 flex items-center justify-between text-left">
                  <div className="flex items-center min-w-0">
                    <FileText className="h-6 w-6 text-slate-600 dark:text-slate-400 mr-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {generatedZip?.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        ZIP Archive
                      </p>
                    </div>
                  </div>
                  <Zap className="h-6 w-6 text-green-500 flex-shrink-0" />
                </div>
                
                <button 
                  onClick={handleDownload} 
                  className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-3" />
                  Download ZIP
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* AI Chat Component */}
      <GeminiChat />
    </div>
  );
};

export default Generate;