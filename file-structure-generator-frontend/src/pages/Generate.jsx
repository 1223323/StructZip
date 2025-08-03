import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Download, FileText, Code2, AlertCircle, ArrowRight, Zap, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GeminiChat from '../components/GeminiChat';

const Generate = () => {
  const [structureInput, setStructureInput] = useState('');
  const [structureName, setStructureName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputFormat, setInputFormat] = useState('json');
  const [showModal, setShowModal] = useState(false);
  const [generatedZip, setGeneratedZip] = useState(null);
  const modalRef = useRef(null);

  const exampleTextStructure = `src/
  main/
    java/
      com/example/App.java
      com/example/controller/UserController.java
    resources/
      application.properties
  test/
    java/
      com/example/AppTest.java
docs/
  README.md
  API.md
frontend/
  src/
    components/
      Header.jsx
      Footer.jsx
    pages/
      Home.jsx
    App.jsx
  package.json`;

  const exampleJsonStructure = `{
  "src": {
    "main": {
      "java": {
        "com": {
          "example": ["App.java", "UserController.java"]
        }
      },
      "resources": ["application.properties"]
    },
    "test": {
      "java": {
        "com": {
          "example": ["AppTest.java"]
        }
      }
    }
  },
  "docs": ["README.md", "API.md"],
  "frontend": {
    "src": {
      "components": ["Header.jsx", "Footer.jsx"],
      "pages": ["Home.jsx"]
    }
  },
  "package.json": null
}`;

  const handleExampleLoad = () => {
    if (inputFormat === 'text') {
      setStructureInput(exampleTextStructure);
      setStructureName('spring-boot-project');
    } else {
      setStructureInput(exampleJsonStructure);
      setStructureName('full-stack-project');
    }
    setError('');
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  const handleGenerate = async () => {
    if (!structureInput.trim()) {
      setError('Please enter a file structure');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/generate-structure', {
        structureContent: structureInput,
        structureName: structureName || 'generated-structure'
      }, {
        responseType: 'blob'
      });

      // Store the generated zip data
      const zipBlob = new Blob([response.data]);
      const zipUrl = window.URL.createObjectURL(zipBlob);
      
      setGeneratedZip({
        url: zipUrl,
        name: `${structureName || 'generated-structure'}.zip`
      });
      
      // Show the download modal
      setShowModal(true);
      
    } catch (error) {
      console.error('Generation error:', error);
      setError(error.response?.data || 'Failed to generate structure');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!generatedZip) return;
    
    // Create download link
    const link = document.createElement('a');
    link.href = generatedZip.url;
    link.setAttribute('download', generatedZip.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Clean up
    setShowModal(false);
    setStructureInput('');
    setStructureName('');
    
    // Revoke the object URL after a delay to ensure download starts
    setTimeout(() => {
      window.URL.revokeObjectURL(generatedZip.url);
      setGeneratedZip(null);
    }, 100);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-16">
      <motion.div 
        className="text-center px-6"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Generate File Structure
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Define your file structure using text or JSON format and download it as a ZIP file
        </p>
      </motion.div>

      <motion.div 
        className="card p-8 shadow-md hover:shadow-lg transition-all duration-300"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="structureName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Structure Name (optional)
            </label>
            <input
              id="structureName"
              type="text"
              className="input-field"
              placeholder="e.g., my-project"
              value={structureName}
              onChange={(e) => setStructureName(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="structureInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                File Structure
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Format:</label>
                  <select
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="json">JSON</option>
                    <option value="text">Text</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleExampleLoad}
                  className="btn-secondary text-sm"
                >
                  Load Example
                </button>
              </div>
            </div>
            <textarea
              id="structureInput"
              className="input-field h-64 font-mono text-sm"
              placeholder={inputFormat === 'text' 
                ? "Enter your file structure:\n\nsrc/\n  main/\n    java/\n      App.java\n  test/\n    AppTest.java\nREADME.md"
                : "Enter JSON structure (recommended for better results):\n\n{\n  \"src\": {\n    \"main\": [\"App.java\"],\n    \"test\": [\"AppTest.java\"]\n  },\n  \"README.md\": null\n}"
              }
              value={structureInput}
              onChange={(e) => setStructureInput(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <motion.button
              onClick={handleGenerate}
              disabled={loading || !structureInput.trim()}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>Generate Structure</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="grid md:grid-cols-2 gap-8 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div 
          className="card p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
          variants={fadeIn}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Text Format
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Use indented text to define your file structure. Folders end with '/', files have extensions.
            Simple and intuitive for basic structures.
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto shadow-inner">
{`src/
  main/
    java/
      App.java
  test/
    AppTest.java
README.md`}
          </pre>
        </motion.div>

        <motion.div 
          className="card p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
          variants={fadeIn}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center mb-4">
            <Code2 className="h-6 w-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              JSON Format (Recommended)
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Use JSON objects for folders and arrays for files. Null values create empty files. 
            <span className="font-semibold text-primary-600">Recommended for better results and more precise structure generation.</span>
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto shadow-inner">
{`{
  "src": {
    "main": ["App.java"],
    "test": ["AppTest.java"]
  },
  "README.md": null
}`}
          </pre>
        </motion.div>
      </motion.div>
      
      {/* Download Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              ref={modalRef}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Download className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Your structure is ready!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click the button below to download your ZIP file containing the generated file structure.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {generatedZip?.name}
                    </span>
                  </div>
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                
                <motion.button
                  onClick={handleDownload}
                  className="w-full btn-primary py-3 text-base font-medium flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="h-5 w-5" />
                  <span>Click to Download Zip File</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Gemini AI Chat Assistant */}
      <GeminiChat />
    </div>
  );
};

export default Generate;