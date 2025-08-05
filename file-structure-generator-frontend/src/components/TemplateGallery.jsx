import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Search, ServerCrash, CheckCircle, Download, FileText, Code } from 'lucide-react';

// NOTE: The code for this component is the same as the previous response, as it already provides an excellent user experience.
// It is included here for completeness of the feature.

// Utility to download content as a file
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

// Formats a single template for JSON export
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

// Formats a single template for Text export
const formatTemplateForText = (template) => {
  const header = `# ${template.name}\n\n${template.description}\n\n`;
  const separator = '='.repeat(50) + '\n\n';
  const content = template.format === 'json' ? JSON.stringify(JSON.parse(template.content), null, 2) : template.content;
  return header + separator + content;
};

const TemplateCard = ({ template, onSelect, isSelected }) => {
  const handleExport = (format, e) => {
    e.stopPropagation(); // Prevent card selection when clicking export
    const filename = `${template.id}-template.${format}`;
    const content = format === 'json' ? formatTemplateForJSON(template) : formatTemplateForText(template);
    const mimeType = format === 'json' ? 'application/json' : 'text/plain';
    downloadFile(content, filename, mimeType);
  };

  return (
    <motion.div
      onClick={() => onSelect(template)}
      className={`group relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected ? 'border-[--primary] bg-indigo-50 dark:bg-indigo-900/20' : 'border-transparent bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200/70 dark:hover:bg-slate-700/50'
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
        <motion.button onClick={(e) => handleExport('txt', e)} className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg" whileHover={{ scale: 1.1 }} title="Export as Text"><FileText size={12} /></motion.button>
        <motion.button onClick={(e) => handleExport('json', e)} className="p-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg" whileHover={{ scale: 1.1 }} title="Export as JSON"><Code size={12} /></motion.button>
      </div>
      <h3 className="font-bold text-lg text-[--text] pr-8">{template.name}</h3>
      <p className="text-sm text-[--text-muted] mt-1 mb-6 line-clamp-2">{template.description}</p>
      <span className="absolute bottom-2 right-3 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[--text-muted]">{template.format.toUpperCase()}</span>
    </motion.div>
  );
};

const TemplateGallery = ({ isOpen, onClose, onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (isOpen) {
      const fetchTemplates = async () => {
        try {
          setLoading(true);
          const response = await axios.get('/api/templates');
          setTemplates(response.data);
          setError('');
        } catch (err) {
          setError('Could not load templates.');
        } finally {
          setLoading(false);
        }
      };
      fetchTemplates();
    }
  }, [isOpen]);

  const getTemplateCategory = (template) => {
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
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || getTemplateCategory(template) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = () => {
    if (selected) {
      onSelectTemplate(selected);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col border border-black/10 dark:border-white/10"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center justify-between p-5 border-b border-[--border]">
          <h2 className="text-xl font-bold text-[--text]">Browse Templates</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><X size={20} /></button>
        </div>
        <div className="p-5 border-b border-[--border] space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--text-muted]" />
            <input type="text" placeholder="Search frameworks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 focus:border-[--primary] focus:ring-1 focus:ring-[--primary] outline-none" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.id ? 'bg-[--primary] text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                {cat.name} <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" size={32} /></div>
          : error ? <div className="flex flex-col justify-center items-center h-full text-red-500"><ServerCrash size={48} /><p>{error}</p></div>
          : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map(template => <TemplateCard key={template.id} template={template} onSelect={setSelected} isSelected={selected?.id === template.id} />)
              ) : (
                <div className="col-span-3 text-center py-8 text-[--text-muted]">No templates found.</div>
              )}
            </div>
          }
        </div>
        <div className="p-5 border-t border-[--border] flex justify-end">
          <button onClick={handleSelect} disabled={!selected} className="btn btn-primary disabled:opacity-50">Use Template</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TemplateGallery;