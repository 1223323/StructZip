import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, ServerCrash, CheckCircle, FileText, Code2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FormatSelectionModal = ({ template, onSelect, onClose }) => {
  const formats = [
    {
      type: 'text',
      icon: FileText,
      title: 'Text Format',
      description: 'Simple folder/file structure format',
      example: 'src/\n  components/\n    Button.jsx\n  App.jsx',
      color: 'blue'
    },
    {
      type: 'json',
      icon: Code2,
      title: 'JSON Format',
      description: 'Structured JSON with content support',
      example: '{\n  "src": {\n    "components": ["Button.jsx"],\n    "App.jsx": null\n  }\n}',
      color: 'purple'
    }
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full border border-black/10 dark:border-white/10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-6 border-b border-[--border]">
          <h3 className="text-xl font-bold text-[--text] mb-2">Choose Output Format</h3>
          <p className="text-[--text-muted]">Select how you want to define your project structure for <span className="font-semibold text-[--primary]">{template.name}</span></p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {formats.map((format) => {
            const Icon = format.icon;
            return (
              <motion.button
                key={format.type}
                onClick={() => onSelect(template, format.type)}
                className={`relative p-6 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] border-${format.color}-200 dark:border-${format.color}-800/50 hover:border-${format.color}-400 dark:hover:border-${format.color}-600 bg-${format.color}-50/50 dark:bg-${format.color}-900/20 hover:bg-${format.color}-100/70 dark:hover:bg-${format.color}-900/40`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-${format.color}-500/10 dark:bg-${format.color}-500/20`}>
                    <Icon className={`h-6 w-6 text-${format.color}-600 dark:text-${format.color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[--text] mb-1">{format.title}</h4>
                    <p className="text-sm text-[--text-muted] mb-3">{format.description}</p>
                    <div className="bg-white/50 dark:bg-slate-800/50 rounded-md p-2">
                      <pre className="text-xs text-[--text-muted] font-mono overflow-hidden">
                        {format.example}
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        
        <div className="p-6 border-t border-[--border] flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TemplatesInlineSection = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = React.useRef(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/templates');
        const featured = response.data.slice(0, 12);
        setTemplates(featured);
        setError('');
      } catch (err) {
        setError('Could not load templates.');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 280;
    const newScrollPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newScrollPosition);
  };

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [templates]);

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setShowFormatModal(true);
  };

  const handleFormatSelect = (template, format) => {
    setSelectedId(template.id);
    
    // Convert template content to selected format
    let convertedContent = template.content;
    
    if (template.format !== format) {
      if (format === 'json' && template.format === 'text') {
        // Convert text to basic JSON structure
        convertedContent = convertTextToJson(template.content);
      } else if (format === 'text' && template.format === 'json') {
        // Convert JSON to text
        convertedContent = convertJsonToText(template.content);
      }
    }

    const templateWithFormat = {
      ...template,
      content: convertedContent,
      format: format
    };

    onSelectTemplate(templateWithFormat);
    setShowFormatModal(false);
    setSelectedTemplate(null);
  };

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
      return jsonContent; // Return as-is if parsing fails
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

  if (loading) {
    return (
      <div className="flex items-center space-x-2 py-8 text-[--text-muted] justify-center">
        <Loader2 className="animate-spin" size={24} />
        <span>Loading templates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-500 py-8 justify-center">
        <ServerCrash size={24} />
        <span>{error}</span>
      </div>
    );
  }

  if (!templates.length) return null;

  return (
    <>
      <div className="mb-6">
        <div className="relative">
          {/* Left scroll button */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => handleScroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full shadow-lg border border-[--border] hover:bg-white dark:hover:bg-slate-900 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-[--text]" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Right scroll button */}
          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={() => handleScroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full shadow-lg border border-[--border] hover:bg-white dark:hover:bg-slate-900 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-[--text]" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Templates container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto space-x-4 pb-4 px-8 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitScrollbar: { display: 'none' }
            }}
          >
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                className={`min-w-[280px] max-w-[280px] bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border-2 p-5 flex flex-col flex-shrink-0 cursor-pointer transition-all duration-200 relative group ${
                  selectedId === template.id 
                    ? 'border-[--primary] bg-indigo-50/80 dark:bg-indigo-900/30 shadow-lg shadow-[--primary]/20' 
                    : 'border-transparent hover:border-[--primary]/40 hover:shadow-md'
                }`}
                onClick={() => handleTemplateClick(template)}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-[--text] text-lg pr-4 line-clamp-1">
                      {template.name}
                    </h3>
                    {selectedId === template.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="p-1 bg-green-500 rounded-full text-white flex-shrink-0"
                      >
                        <CheckCircle size={16} />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-sm text-[--text-muted] mb-4 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-end">
                  <div className="text-xs text-[--text-muted] opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to customize
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[--primary]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFormatModal && selectedTemplate && (
          <FormatSelectionModal
            template={selectedTemplate}
            onSelect={handleFormatSelect}
            onClose={() => {
              setShowFormatModal(false);
              setSelectedTemplate(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TemplatesInlineSection;