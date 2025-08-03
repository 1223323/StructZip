import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Download, FileText, Code2, AlertCircle, Zap, X, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GeminiChat from '../components/GeminiChat';

// Reusable animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Custom styled format switcher component
const FormatSwitcher = ({ format, setFormat }) => (
  <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800/50">
    {['json', 'text'].map((f) => (
      <button
        key={f}
        onClick={() => setFormat(f)}
        className={`relative w-full py-1.5 px-3 text-sm font-semibold rounded-md transition-colors ${
          format === f ? 'text-[--text]' : 'text-[--text-muted] hover:text-[--text]'
        }`}
      >
        {f.toUpperCase()}
        {format === f && (
          <motion.div
            className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-sm -z-10"
            layoutId="format-switcher-active"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
    ))}
  </div>
);

const Generate = () => {
  const [structureInput, setStructureInput] = useState('');
  const [structureName, setStructureName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputFormat, setInputFormat] = useState('json');
  const [showModal, setShowModal] = useState(false);
  const [generatedZip, setGeneratedZip] = useState(null);
  const modalRef = useRef(null);

  const exampleTextStructure = `src/\n  components/\n    Button.jsx\n    Card.jsx\n  pages/\n    Home.jsx\n    About.jsx\n  App.jsx\n  index.css\npublic/\n  index.html\npackage.json\nREADME.md`;
  const exampleJsonStructure = JSON.stringify({
    "src": {
      "components": ["Button.jsx", "Card.jsx"],
      "pages": ["Home.jsx", "About.jsx"],
      "files": ["App.jsx", "index.css"]
    },
    "public": ["index.html"],
    "package.json": null,
    "README.md": "# My New Project"
  }, null, 2);

  const handleExampleLoad = () => {
    if (inputFormat === 'text') {
      setStructureInput(exampleTextStructure);
      setStructureName('example-text-project');
    } else {
      setStructureInput(exampleJsonStructure);
      setStructureName('example-json-project');
    }
    setError('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenerate = async () => {
    if (!structureInput.trim()) {
      setError('Please provide a file structure.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/generate-structure', {
        structureContent: structureInput,
        structureName: structureName || 'generated-structure'
      }, { responseType: 'blob' });
      const zipBlob = new Blob([response.data], { type: 'application/zip' });
      const zipUrl = window.URL.createObjectURL(zipBlob);
      setGeneratedZip({
        url: zipUrl,
        name: `${structureName || 'generated-structure'}.zip`
      });
      setShowModal(true);
    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred.');
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
      setShowModal(false);
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-24 py-12 px-4 overflow-x-hidden">
      <motion.div 
        className="text-center"
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[--text]">
          Create Your Structure
        </h1>
        <p className="text-lg text-[--text-muted] max-w-2xl mx-auto">
          Instantly scaffold any project. Define your structure using text or JSON and get a downloadable ZIP archive in seconds.
        </p>
      </motion.div>

      <motion.div 
        className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl"
        variants={containerVariants}
      >
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <label htmlFor="structureName" className="block text-sm font-medium text-[--text-muted] mb-2">
              Project Name (optional)
            </label>
            <input
              id="structureName"
              type="text"
              className="w-full py-2.5 px-4 text-base bg-white/50 dark:bg-slate-800/50 border border-[--border] rounded-lg transition-all duration-300 focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/20 focus:outline-none"
              placeholder="e.g., my-awesome-project"
              value={structureName}
              onChange={(e) => setStructureName(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-[--text-muted]">
                File Structure Definition
              </label>
              <div className="flex items-center space-x-3">
                <FormatSwitcher format={inputFormat} setFormat={setInputFormat} />
                <button
                  type="button"
                  onClick={handleExampleLoad}
                  className="btn btn-secondary text-sm px-3 py-1.5"
                >
                  Load Example
                </button>
              </div>
            </div>
            <textarea
              id="structureInput"
              className="w-full h-72 p-4 font-mono text-sm bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/20 focus:outline-none transition-colors duration-300"
              placeholder={inputFormat === 'text' ? exampleTextStructure : exampleJsonStructure}
              value={structureInput}
              onChange={(e) => setStructureInput(e.target.value)}
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                className="alert alert-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div className="flex justify-center pt-4" variants={itemVariants}>
            <button
              onClick={handleGenerate}
              disabled={loading || !structureInput.trim()}
              className="btn btn-primary btn-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span key="loading" className="flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                    Generating...
                  </motion.span>
                ) : (
                  <motion.span key="generate" className="flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate & Download
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              ref={modalRef}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-8 border border-black/10 dark:border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-500/20">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-[--text] mb-2">
                    Structure Generated!
                  </h3>
                  <p className="text-[--text-muted]">
                    Your project is ready. Download the ZIP file to get started.
                  </p>
                </div>
                
                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 flex items-center justify-between text-left">
                  <div className="flex items-center min-w-0">
                    <FileText className="h-5 w-5 text-[--text-muted] mr-3 flex-shrink-0" />
                    <span className="text-sm font-medium text-[--text] truncate">
                      {generatedZip?.name}
                    </span>
                  </div>
                  <Zap className="h-5 w-5 text-green-500 flex-shrink-0" />
                </div>
                
                <button
                  onClick={handleDownload}
                  className="w-full btn btn-primary py-3 text-base font-medium"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download ZIP
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <GeminiChat />
    </div>
  );
};

export default Generate;
