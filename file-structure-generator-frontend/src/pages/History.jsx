import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { History as HistoryIcon, FileText, Calendar, Eye, EyeOff, Trash2, Download, Search, ArrowDownUp, Filter, Clock, FolderOpen, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// Custom Tooltip Component
const Tooltip = ({ text, children }) => (
  <div className="relative group flex justify-center">
    {children}
    <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      {text}
    </div>
  </div>
);

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/history');
      // Mock data for demonstration
      const mockData = [
        { id: 1, structureName: 'React-Vite-Template', structureContent: '{\n  "src": {\n    "components": ["Button.jsx"],\n    "pages": ["Home.jsx"]\n  }\n}', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 2, structureName: 'Node-Express-API', structureContent: '{\n  "src": {\n    "controllers": [],\n    "models": [],\n    "routes": []\n  }\n}', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: 3, structureName: 'My-Design-System', structureContent: '...', createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
      ];
      setHistory(response.data.length > 0 ? response.data : mockData);
    } catch (error) {
      setError('Failed to load history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedItems);
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
    setExpandedItems(newExpanded);
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/history/${id}`);
      setHistory(history.filter(item => item.id !== id));
      setDeleteConfirmation(null);
    } catch (error) {
      setError('Failed to delete history item.');
    }
  };

  const handleRegenerate = async (item) => {
    // This function remains the same
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const filteredHistory = useMemo(() => history
    .filter(item => {
      const matchesSearch = item.structureName.toLowerCase().includes(searchTerm.toLowerCase());
      if (filterBy === 'all') return matchesSearch;
      const date = new Date(item.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesSearch && date > weekAgo;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'name') return a.structureName.localeCompare(b.structureName);
      return 0;
    }), [history, searchTerm, filterBy, sortBy]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <motion.div className="w-12 h-12 border-4 border-[--primary] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[--text-muted]">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold text-[--text] mb-3">Generation History</h1>
        <p className="text-lg text-[--text-muted] max-w-2xl mx-auto">Review, manage, and reuse your previously created project structures.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <motion.aside className="lg:col-span-1 lg:sticky top-24 h-fit" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-black/10 dark:border-white/10 shadow-xl space-y-6">
            <div>
              <label className="text-sm font-semibold text-[--text-muted] mb-2 flex items-center"><Search size={14} className="mr-2"/> Search</label>
              <input type="text" placeholder="Find a project..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 px-3 text-base bg-white/50 dark:bg-slate-800/50 border border-[--border] rounded-lg focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/20 outline-none transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-[--text-muted] mb-2 flex items-center"><ArrowDownUp size={14} className="mr-2"/> Sort By</label>
              <div className="flex flex-col space-y-2">
                {['newest', 'oldest', 'name'].map(option => (
                  <button key={option} onClick={() => setSortBy(option)} className={`text-left text-sm px-3 py-2 rounded-md transition-colors ${sortBy === option ? 'bg-[--primary] text-white font-semibold' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-[--text-muted] mb-2 flex items-center"><Filter size={14} className="mr-2"/> Filter</label>
              <div className="flex flex-col space-y-2">
                {['all', 'recent'].map(option => (
                  <button key={option} onClick={() => setFilterBy(option)} className={`text-left text-sm px-3 py-2 rounded-md transition-colors ${filterBy === option ? 'bg-[--primary] text-white font-semibold' : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}>
                    {option === 'recent' ? 'Last 7 Days' : 'All Projects'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>

        {/* History List */}
        <main className="lg:col-span-3">
          {filteredHistory.length === 0 ? (
            <motion.div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-12 text-center rounded-2xl border border-black/10 dark:border-white/10 shadow-xl flex flex-col items-center justify-center min-h-[400px]" variants={itemVariants}>
              <FolderOpen className="h-20 w-20 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
              <h3 className="text-2xl font-semibold mb-2 text-[--text]">No Projects Found</h3>
              <p className="mb-6 max-w-md mx-auto text-[--text-muted]">
                {searchTerm || filterBy !== 'all' ? 'Try adjusting your search or filters.' : 'Your generated projects will appear here.'}
              </p>
            </motion.div>
          ) : (
            <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
              {filteredHistory.map((item) => (
                <motion.div key={item.id} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-black/10 dark:border-white/10 shadow-lg p-1 group" variants={itemVariants} layout>
                  <div className="rounded-xl p-5 transition-colors duration-300 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold truncate text-[--text]">{item.structureName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-[--text-muted] mt-1">
                          <div className="flex items-center space-x-1.5"><Calendar size={14} /><span>{formatDate(item.createdAt)}</span></div>
                          <div className="flex items-center space-x-1.5"><FileText size={14} /><span>{item.structureContent.split('\n').length} lines</span></div>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-4">
                        <Tooltip text="View Content"><button onClick={() => toggleExpand(item.id)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{expandedItems.has(item.id) ? <EyeOff size={16} /> : <Eye size={16} />}</button></Tooltip>
                        <Tooltip text="Download ZIP"><button onClick={() => handleRegenerate(item)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><Download size={16} /></button></Tooltip>
                        <Tooltip text="Delete"><button onClick={() => setDeleteConfirmation(item.id)} className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 size={16} /></button></Tooltip>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedItems.has(item.id) && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 mt-4 border-t border-[--border]">
                          <pre className="text-xs whitespace-pre-wrap font-mono bg-slate-100 dark:bg-slate-800 p-4 rounded-lg max-h-60 overflow-auto">{item.structureContent}</pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation && (
          <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full p-8 border border-black/10 dark:border-white/10" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-red-500/20">
                  <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-[--text] mt-4 mb-2">Delete Project?</h3>
                <p className="text-[--text-muted] mb-6">This action is permanent and cannot be undone.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => setDeleteConfirmation(null)} className="btn btn-secondary w-full">Cancel</button>
                  <button onClick={() => handleDelete(deleteConfirmation)} className="btn btn-danger w-full">Delete</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
