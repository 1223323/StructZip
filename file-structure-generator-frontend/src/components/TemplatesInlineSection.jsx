import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, ServerCrash, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TemplatesInlineSection = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/templates');
        // Get a diverse but limited set for the inline view
        const featured = response.data.slice(0, 8);
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

  const handleSelect = (tpl) => {
    setSelectedId(tpl.id);
    onSelectTemplate(tpl);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 py-4 text-[--text-muted]">
        <Loader2 className="animate-spin" size={20} />
        <span>Loading templates...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-500 py-4">
        <ServerCrash size={20} />
        <span>{error}</span>
      </div>
    );
  }
  if (!templates.length) return null;

  return (
    <div className="mb-6">
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {templates.map((tpl) => (
          <motion.div
            key={tpl.id}
            className={`min-w-[240px] bg-slate-100 dark:bg-slate-800/70 rounded-xl border-2 p-4 flex flex-col flex-shrink-0 cursor-pointer transition-all duration-150 relative ${
              selectedId === tpl.id ? 'border-[--primary] bg-indigo-50 dark:bg-indigo-900/20' : 'border-transparent hover:border-[--primary]/40'
            }`}
            onClick={() => handleSelect(tpl)}
            whileHover={{ y: -5 }}
          >
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-[--text] text-base pr-4">{tpl.name}</span>
                {selectedId === tpl.id && <CheckCircle className="text-green-500 flex-shrink-0" size={18} />}
              </div>
              <p className="text-xs text-[--text-muted] mb-3 line-clamp-2">{tpl.description}</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[--text-muted] self-start">
              {tpl.format.toUpperCase()}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesInlineSection;