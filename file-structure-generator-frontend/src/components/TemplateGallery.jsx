// TemplateGallery.jsx - Fixed version
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Search, ServerCrash, CheckCircle, Download, FileText, Code, Filter, Grid, List } from 'lucide-react';

const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const formatTemplateForJSON = (template) => {
  const templateData = {
    id: template.id,
    name: template.name,
    description: template.description,
    format: template.format,
    content: template.format === 'json' ? JSON.parse(template.content) : template.content,
    metadata: { exportedAt: new Date().toISOString() }
  };
  return JSON.stringify(templateData, null, 2);
};

const formatTemplateForText = (template) => {
  const header = `# ${template.name}\n\n${template.description}\n\n`;
  const separator = '='.repeat(50) + '\n\n';
  const content = template.format === 'json' ? JSON.stringify(JSON.parse(template.content), null, 2) : template.content;
  return header + separator + content;
};

const FormatSelectionModal = ({ template, onSelect, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [previewContent, setPreviewContent] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const formats = [
    {
      type: 'text',
      icon: FileText,
      title: 'Text Format',
      description: 'Simple folder/file structure format',
      example: 'src/\n  components/\n    Button.jsx\n  App.jsx',
      color: 'blue',
      benefits: ['Easy to read', 'Simple structure', 'Quick editing']
    },
    {
      type: 'json',
      icon: Code,
      title: 'JSON Format',
      description: 'Structured JSON with content support',
      example: '{\n  "src": {\n    "components": ["Button.jsx"],\n    "App.jsx": null\n  }\n}',
      color: 'purple',
      benefits: ['Structured data', 'Content support', 'Programmatic use']
    }
  ];

  const convertTextToJson = (textContent) => {
    const lines = textContent.split('\n');
    const root = {};
    const stack = [{ dir: root, indent: -1 }];

    for (const line of lines) {
      if (!line.trim()) continue;

      const indent = line.search(/\S|$/);
      const name = line.trim();

      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
        stack.pop();
      }

      const parent = stack[stack.length - 1].dir;

      if (name.endsWith('/')) {
        const dirName = name.slice(0, -1);
        const newDir = {};
        parent[dirName] = newDir;
        stack.push({ dir: newDir, indent });
      } else {
        parent[name] = null;
      }
    }

    return JSON.stringify(root, null, 2);
  };

  const convertJsonToText = (jsonContent) => {
    try {
      const parsed = JSON.parse(jsonContent);
      return convertObjectToText(parsed, '');
    } catch {
      return jsonContent;
    }
  };

  const convertObjectToText = (obj, prefix) => {
    let result = '';
    for (const [key, value] of Object.entries(obj)) {
      if (value === null) {
        result += `${prefix}${key}\n`;
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        result += `${prefix}${key}/\n`;
        result += convertObjectToText(value, prefix + '  ');
      } else if (Array.isArray(value)) {
        result += `${prefix}${key}/\n`;
        value.forEach(item => {
          result += `${prefix}  ${item}\n`;
        });
      } else {
        result += `${prefix}${key}\n`;
      }
    }
    return result;
  };

  const handleFormatSelect = async (format) => {
    setSelectedFormat(format);
    setIsConverting(true);
    
    // Simulate conversion delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let convertedContent = template.content;
    
    if (template.format !== format.type) {
      if (format.type === 'json' && template.format === 'text') {
        convertedContent = convertTextToJson(template.content);
      } else if (format.type === 'text' && template.format === 'json') {
        convertedContent = convertJsonToText(template.content);
      }
    }
    
    setPreviewContent(convertedContent);
    setIsConverting(false);
  };

  const handleConfirm = () => {
    if (!selectedFormat) return;
    
    const templateWithFormat = {
      ...template,
      content: previewContent,
      format: selectedFormat.type
    };

    onSelect(templateWithFormat);
  };

  return (
    <motion.div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-6xl w-full h-[80vh] border border-black/10 dark:border-white/10 flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Choose & Preview Format</h3>
              <p className="text-slate-600 dark:text-slate-400">Select and preview how you want to structure <span className="font-semibold text-indigo-600 dark:text-indigo-400">{template.name}</span></p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Format Selection Sidebar */}
          <div className="w-80 border-r border-slate-200 dark:border-slate-700 p-6 flex-shrink-0 overflow-y-auto">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Available Formats</h4>
            <div className="space-y-3">
              {formats.map((format) => {
                const Icon = format.icon;
                const isSelected = selectedFormat?.type === format.type;
                return (
                  <motion.button
                    key={format.type}
                    onClick={() => handleFormatSelect(format)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-500/10' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-slate-900 dark:text-white mb-1">{format.title}</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{format.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {format.benefits.map((benefit, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="p-1 bg-green-500 rounded-full text-white"
                        >
                          <CheckCircle size={14} />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {selectedFormat ? `${selectedFormat.title} Preview` : 'Select a format to preview'}
                </h4>
                {selectedFormat && (
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className={`w-2 h-2 rounded-full ${
                      template.format === selectedFormat.type ? 'bg-green-500' : 'bg-amber-500'
                    }`}></div>
                    <span>
                      {template.format === selectedFormat.type ? 'Original format' : 'Converted format'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-hidden">
              {!selectedFormat ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="text-slate-600 dark:text-slate-400">
                    <Code size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Choose a Format</p>
                    <p className="text-sm">Select a format from the sidebar to see a live preview</p>
                  </div>
                </div>
              ) : isConverting ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" size={32} />
                    <p className="text-slate-600 dark:text-slate-400">Converting to {selectedFormat.title}...</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 flex-1 overflow-auto">
                    <pre className={`text-sm font-mono text-slate-900 dark:text-white whitespace-pre-wrap ${
                      selectedFormat.type === 'json' ? 'language-json' : 'language-text'
                    }`}>
                      {previewContent}
                    </pre>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-2">
                      <div className="p-1 bg-blue-500 rounded-full text-white flex-shrink-0 mt-0.5">
                        <CheckCircle size={12} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Preview Ready</p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          This is how your template will look in {selectedFormat.title.toLowerCase()}. 
                          {template.format !== selectedFormat.type && 'Content has been automatically converted.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {selectedFormat && (
              <span>Ready to use {selectedFormat.title.toLowerCase()} format</span>
            )}
          </div>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleConfirm} 
              disabled={!selectedFormat}
              className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors ${
                !selectedFormat ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Use This Format
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TemplateCard = ({ template, onSelect, isSelected, viewMode }) => {
  const [showFormatModal, setShowFormatModal] = useState(false);

  const handleExport = (format, e) => {
    e.stopPropagation();
    const filename = `${template.id}-template.${format}`;
    const content = format === 'json' ? formatTemplateForJSON(template) : formatTemplateForText(template);
    const mimeType = format === 'json' ? 'application/json' : 'text/plain';
    downloadFile(content, filename, mimeType);
  };

  const handleCardClick = () => {
    setShowFormatModal(true);
  };

  const handleFormatSelect = (templateWithFormat) => {
    onSelect(templateWithFormat);
    setShowFormatModal(false);
  };

  if (viewMode === 'list') {
    return (
      <>
        <motion.div
          onClick={handleCardClick}
          className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center space-x-4 ${
            isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-transparent bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200/70 dark:hover:bg-slate-700/50'
          }`}
          whileHover={{ x: 4 }}
        >
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{template.name}</h3>
              <div className="flex items-center space-x-2">
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1 bg-green-500 rounded-full text-white">
                    <CheckCircle size={16} />
                  </motion.div>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{template.description}</p>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button onClick={(e) => handleExport('txt', e)} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg" whileHover={{ scale: 1.1 }} title="Export as Text">
              <FileText size={14} />
            </motion.button>
            <motion.button onClick={(e) => handleExport('json', e)} className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg" whileHover={{ scale: 1.1 }} title="Export as JSON">
              <Code size={14} />
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showFormatModal && (
            <FormatSelectionModal
              template={template}
              onSelect={handleFormatSelect}
              onClose={() => setShowFormatModal(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        className={`group relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
          isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-transparent bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200/70 dark:hover:bg-slate-700/50'
        }`}
        whileHover={{ y: -5 }}
      >
        {isSelected && (
          <motion.div
            className="absolute top-2 right-2 p-1 bg-green-500 rounded-full text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <CheckCircle size={16} />
          </motion.div>
        )}
        <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button onClick={(e) => handleExport('txt', e)} className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg" whileHover={{ scale: 1.1 }} title="Export as Text">
            <FileText size={12} />
          </motion.button>
          <motion.button onClick={(e) => handleExport('json', e)} className="p-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg" whileHover={{ scale: 1.1 }} title="Export as JSON">
            <Code size={12} />
          </motion.button>
        </div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white pr-8">{template.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-6 line-clamp-2">{template.description}</p>
      </motion.div>

      <AnimatePresence>
        {showFormatModal && (
          <FormatSelectionModal
            template={template}
            onSelect={handleFormatSelect}
            onClose={() => setShowFormatModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const TemplateGallery = ({ isOpen, onClose, onSelectTemplate, templates: templatesProp, loading: loadingProp, error: errorProp }) => {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync external props into local state when provided
  useEffect(() => {
    if (typeof templatesProp !== 'undefined') {
      setTemplates(Array.isArray(templatesProp) ? templatesProp : []);
      setLoading(!!loadingProp);
      setError(errorProp || '');
    }
  }, [templatesProp, loadingProp, errorProp]);

  useEffect(() => {
    // If templates are provided by parent, skip internal fetch
    if (typeof templatesProp !== 'undefined') return;

    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/templates');
        // Ensure templates is always an array
        setTemplates(Array.isArray(response.data) ? response.data : []);
        setError('');
      } catch (err) {
        console.error('Template fetch error:', err);
        setError('Could not load templates.');
        setTemplates([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen, templatesProp]);

  const getTemplateCategory = (template) => {
    if (!template?.name) return 'other';
    const name = template.name.toLowerCase();
    if (name.includes('react') || name.includes('vue') || name.includes('angular') || name.includes('next')) return 'frontend';
    if (name.includes('express') || name.includes('spring') || name.includes('django') || name.includes('fastapi') || name.includes('rails') || name.includes('gin')) return 'backend';
    if (name.includes('native') || name.includes('flutter')) return 'mobile';
    if (name.includes('mern') || name.includes('full')) return 'fullstack';
    if (name.includes('electron')) return 'desktop';
    if (name.includes('kubernetes') || name.includes('terraform')) return 'devops';
    if (name.includes('data science')) return 'data science';
    return 'other';
  };
  
  const categories = ['all', 'frontend', 'backend', 'fullstack', 'mobile', 'desktop', 'data science', 'devops']
    .map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: cat === 'all' ? templates.length : templates.filter(t => getTemplateCategory(t) === cat).length,
   }))
   .filter(cat => cat.count > 0 || cat.id === 'all');

 const filteredTemplates = templates.filter(template => {
   if (!template) return false;
   const matchesSearch = (template.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                        (template.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
   const matchesCategory = selectedCategory === 'all' || getTemplateCategory(template) === selectedCategory;
   return matchesSearch && matchesCategory;
 });

 const handleSelect = (template) => {
   setSelected(template);
   onSelectTemplate(template);
   onClose();
 };

 if (!isOpen) return null;

 return (
   <motion.div
     className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
     initial={{ opacity: 0 }} 
     animate={{ opacity: 1 }} 
     exit={{ opacity: 0 }}
   >
      <motion.div
        className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col border border-black/10 dark:border-white/10"
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
      >
       {/* Header */}
       <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
         <div className="flex items-center space-x-3">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Template Gallery</h2>
           <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">
             {filteredTemplates.length} templates
           </span>
         </div>
         <div className="flex items-center space-x-2">
           <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
             <button
               onClick={() => setViewMode('grid')}
               className={`p-2 rounded transition-colors ${
                 viewMode === 'grid' 
                   ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                   : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
               }`}
               title="Grid view"
             >
               <Grid size={18} />
             </button>
             <button
               onClick={() => setViewMode('list')}
               className={`p-2 rounded transition-colors ${
                 viewMode === 'list' 
                   ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                   : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
               }`}
               title="List view"
             >
               <List size={18} />
             </button>
           </div>
           <button 
             onClick={onClose} 
             className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
           >
             <X size={20} />
           </button>
         </div>
       </div>

       {/* Filters */}
       <div className="p-6 border-b border-slate-200 dark:border-slate-700 space-y-4">
         <div className="relative">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400" />
           <input 
             type="text" 
             placeholder="Search templates..." 
             value={searchTerm} 
             onChange={(e) => setSearchTerm(e.target.value)} 
             className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
           />
         </div>
         
         <div className="flex items-center space-x-3">
           <Filter size={16} className="text-slate-600 dark:text-slate-400" />
           <div className="flex flex-wrap gap-2">
             {categories.map((cat) => (
               <motion.button 
                 key={cat.id} 
                 onClick={() => setSelectedCategory(cat.id)} 
                 className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                   selectedCategory === cat.id 
                     ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                     : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                 }`}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
               >
                 {cat.name} 
                 <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                   selectedCategory === cat.id 
                     ? 'bg-white/20' 
                     : 'bg-slate-200 dark:bg-slate-700'
                 }`}>
                   {cat.count}
                 </span>
               </motion.button>
             ))}
           </div>
         </div>
       </div>

       {/* Templates Grid/List */}
       <div className="flex-1 overflow-y-auto p-6">
         {loading ? (
           <div className="flex justify-center items-center h-full">
             <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={40} />
           </div>
         ) : error ? (
           <div className="flex flex-col justify-center items-center h-full text-red-500">
             <ServerCrash size={48} />
             <p className="mt-2">{error}</p>
           </div>
         ) : (
           <motion.div 
             className={
               viewMode === 'grid' 
                 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                 : "space-y-3"
             }
             layout
           >
             <AnimatePresence>
               {filteredTemplates.length > 0 ? (
                 filteredTemplates.map((template, index) => (
                   <motion.div
                     key={template?.id || index}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     transition={{ delay: index * 0.05 }}
                     layout
                   >
                     <TemplateCard 
                       template={template} 
                       onSelect={handleSelect} 
                       isSelected={selected?.id === template?.id}
                       viewMode={viewMode}
                     />
                   </motion.div>
                 ))
               ) : (
                 <motion.div 
                   className={`${viewMode === 'grid' ? 'col-span-3' : ''} text-center py-12`}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                 >
                   <div className="text-slate-600 dark:text-slate-400">
                     <Search size={48} className="mx-auto mb-4 opacity-50" />
                     <p className="text-lg font-medium mb-2">No templates found</p>
                     <p className="text-sm">Try adjusting your search or filters</p>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </motion.div>
         )}
       </div>

       {/* Footer */}
       <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl">
         <div className="flex items-center justify-between">
           <p className="text-sm text-slate-600 dark:text-slate-400">
             Select a template to customize and use in your project
           </p>
           <div className="flex space-x-3">
             <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
               Cancel
             </button>
           </div>
         </div>
       </div>
     </motion.div>
   </motion.div>
 );
};

export default TemplateGallery;