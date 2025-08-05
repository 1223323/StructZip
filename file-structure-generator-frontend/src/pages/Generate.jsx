import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Download, FileText, AlertCircle, Sparkles, X, Check, LayoutGrid, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GeminiChat from '../components/GeminiChat';
import TemplateGallery from '../components/TemplateGallery';
import TemplatesInlineSection from '../components/TemplatesInlineSection';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

const FormatSwitcher = ({ format, setFormat }) => (
    <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800/50">
        {['json', 'text'].map((f) => (
            <button key={f} onClick={() => setFormat(f)}
                className={`relative w-full py-1.5 px-3 text-sm font-semibold rounded-md transition-colors ${format === f ? 'text-[--text]' : 'text-[--text-muted] hover:text-[--text]'}`}>
                {f.toUpperCase()}
                {format === f && <motion.div className="absolute inset-0 bg-white dark:bg-slate-700 rounded-md shadow-sm -z-10" layoutId="format-switcher-active" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />}
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

    const modalRef = useRef(null);
    const editorRef = useRef(null); // Ref for the editor section

    // Define example structures for the background hint
    const exampleTextStructure = `src/\n  components/\n    Button.jsx\n    Card.jsx\n  pages/\n    Home.jsx\n    About.jsx\n  App.jsx\n  index.css\npublic/\n  index.html\npackage.json\nREADME.md`;
    const exampleJsonStructure = JSON.stringify({
        "src": {
            "components": ["Button.jsx", "Card.jsx"],
            "pages": ["Home.jsx", "About.jsx"],
            "App.jsx": null,
            "index.css": null
        },
        "public": ["index.html"],
        "package.json": null,
        "README.md": "# My New Project"
    }, null, 2);


    const handleSelectTemplate = (template) => {
        setStructureName(template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
        setStructureInput(template.content);
        setInputFormat(template.format);
        setError('');

        editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setHighlightEditor(true);
        setTimeout(() => setHighlightEditor(false), 1500);
    };

    const handleGenerate = async () => {
        if (!structureInput.trim()) {
            setError('Please provide a file structure.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/api/generate-structure', { structureContent: structureInput, structureName: structureName || 'generated-structure' }, { responseType: 'blob' });
            const zipBlob = new Blob([response.data], { type: 'application/zip' });
            const zipUrl = window.URL.createObjectURL(zipBlob);
            setGeneratedZip({ url: zipUrl, name: `${structureName || 'generated-structure'}.zip` });
            setShowSuccessModal(true);
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
            setShowSuccessModal(false);
        }, 100);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowSuccessModal(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-16 py-12 px-4">
            <motion.div className="text-center" initial="hidden" animate="visible" variants={itemVariants}>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[--text]">Create Your Structure</h1>
                <p className="text-lg text-[--text-muted] max-w-2xl mx-auto">Instantly scaffold any project from a template or your own design.</p>
            </motion.div>

            <motion.div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl" variants={containerVariants}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-xl text-[--text]">1. Start with a Template</h3>
                    <button onClick={() => setIsGalleryOpen(true)} className="btn btn-secondary btn-sm flex items-center"><LayoutGrid className="h-4 w-4 mr-2" />Browse All</button>
                </div>
                <TemplatesInlineSection onSelectTemplate={handleSelectTemplate} />

                <div className="flex items-center my-8">
                    <div className="flex-grow h-px bg-[--border]"></div>
                    <span className="mx-4 text-sm font-semibold text-[--text-muted]">OR</span>
                    <div className="flex-grow h-px bg-[--border]"></div>
                </div>

                <div ref={editorRef} className="space-y-6 transition-all duration-500 rounded-lg" style={highlightEditor ? { boxShadow: `0 0 20px 5px var(--primary-light)` } : {}}>
                    <motion.div variants={itemVariants}>
                        <label htmlFor="structureName" className="block text-sm font-medium text-[--text-muted] mb-2">2. Customize Your Project</label>
                        <input id="structureName" type="text" className="w-full py-2.5 px-4 text-base bg-white/50 dark:bg-slate-800/50 border border-[--border] rounded-lg focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/20 outline-none" placeholder="Enter project name..." value={structureName} onChange={(e) => setStructureName(e.target.value)} />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-[--text-muted]">File Structure Definition</label>
                            <FormatSwitcher format={inputFormat} setFormat={setInputFormat} />
                        </div>
                        {/* EDITOR WITH BACKGROUND HINT */}
                        <div className="relative">
                            <AnimatePresence>
                                {structureInput.length === 0 && (
                                    <motion.pre
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute top-0 left-0 p-4 font-mono text-sm text-slate-300 dark:text-slate-600 select-none pointer-events-none w-full h-full overflow-hidden leading-relaxed"
                                        aria-hidden="true"
                                    >
                                        {inputFormat === 'text' ? exampleTextStructure : exampleJsonStructure}
                                    </motion.pre>
                                )}
                            </AnimatePresence>
                            <textarea
                                id="structureInput"
                                className="relative z-10 w-full h-80 p-4 font-mono text-sm bg-transparent border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/20 outline-none transition-colors duration-300 leading-relaxed"
                                value={structureInput}
                                onChange={(e) => setStructureInput(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {error && <motion.div className="alert alert-error mt-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><AlertCircle className="h-5 w-5 mr-2" />{error}</motion.div>}
                </AnimatePresence>

                <motion.div className="flex flex-col items-center justify-center pt-8" variants={itemVariants}>
                    <label className="block text-sm font-medium text-[--text-muted] mb-2">3. Generate Your ZIP</label>
                    <button onClick={handleGenerate} disabled={loading || !structureInput.trim()} className="btn btn-primary btn-lg disabled:opacity-60">
                        <AnimatePresence mode="wait">
                            {loading ? <motion.span key="loading" className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />Generating...</motion.span>
                                : <motion.span key="generate" className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Sparkles className="h-5 w-5 mr-2" />Generate & Download</motion.span>}
                        </AnimatePresence>
                    </button>
                </motion.div>
            </motion.div>
            
            <TemplateGallery isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} onSelectTemplate={handleSelectTemplate} />
            
            <AnimatePresence>
              {showSuccessModal && (
                  <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <motion.div ref={modalRef} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-8 border border-black/10 dark:border-white/10" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                          <div className="text-center space-y-6">
                              <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-500/20"><Check className="h-8 w-8 text-green-600 dark:text-green-400" /></div>
                              <div>
                                  <h3 className="text-xl font-semibold text-[--text] mb-2">Structure Generated!</h3>
                                  <p className="text-[--text-muted]">Your project is ready to download.</p>
                              </div>
                              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 flex items-center justify-between text-left">
                                  <div className="flex items-center min-w-0"><FileText className="h-5 w-5 text-[--text-muted] mr-3 flex-shrink-0" /><span className="text-sm font-medium text-[--text] truncate">{generatedZip?.name}</span></div>
                                  <Zap className="h-5 w-5 text-green-500 flex-shrink-0" />
                              </div>
                              <button onClick={handleDownload} className="w-full btn btn-primary py-3 text-base font-medium"><Download className="h-5 w-5 mr-2" />Download ZIP</button>
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
