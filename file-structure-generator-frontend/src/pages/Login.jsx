import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable animation variants for a consistent feel
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Fixed input styling with proper spacing
const inputBaseClasses = "w-full py-3 px-4 text-base bg-transparent border border-[--border] rounded-lg transition-all duration-300 focus:border-[--primary] focus:ring-2 focus:ring-[--primary]/20 focus:outline-none";

// Simplified InputField component with proper spacing
const InputField = ({ name, type, placeholder, value, onChange, icon: Icon, autoComplete }) => (
  <motion.div
    className="relative w-full"
    variants={itemVariants}
  >
    <div className="relative flex items-center">
      <Icon
        className="absolute left-4 h-5 w-5 text-gray-400 transition-colors duration-300 z-10 pointer-events-none"
      />
      <input
        name={name}
        type={type}
        required
        className={`${inputBaseClasses} pl-12 pr-4`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
    </div>
  </motion.div>
);

// Password specific input field with visibility toggle
const PasswordField = ({ name, placeholder, value, onChange, autoComplete, showPassword, onTogglePassword }) => (
  <motion.div className="relative w-full" variants={itemVariants}>
    <div className="relative flex items-center">
      <Lock className="absolute left-4 h-5 w-5 text-gray-400 transition-colors duration-300 z-10 pointer-events-none" />
      <input
        name={name}
        type={showPassword ? 'text' : 'password'}
        required
        className={`${inputBaseClasses} pl-12 pr-12`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-4 p-1 text-gray-400 hover:text-[--primary] transition-colors duration-200 z-10"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  </motion.div>
);

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(formData.username, formData.password);
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    // Fixed container with proper overflow control and viewport constraints
    <div className="h-screen w-screen fixed inset-0 flex items-center justify-center p-4 bg-[--bg] overflow-hidden">
      {/* Background Effects - contained within viewport */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-[--primary] rounded-full opacity-20 dark:opacity-10 blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            scale: [1, 1.1, 1], 
            x: [-50, 0, -50], 
            y: [-50, 0, -50] 
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-[--accent] rounded-full opacity-20 dark:opacity-10 blur-3xl transform translate-x-1/2 translate-y-1/2"
          animate={{ 
            scale: [1, 1.1, 1], 
            x: [50, 0, 50], 
            y: [50, 0, 50] 
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
      </div>

      <motion.div
        className="max-w-md w-full space-y-6 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="text-center" variants={itemVariants}>
          <div className="inline-block">
            <motion.div
              className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl mb-4 shadow-lg bg-gradient-to-br from-[--primary] to-[--accent]"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <LogIn className="h-8 w-8 text-white" />
            </motion.div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[--text] mb-2">Welcome Back</h2>
          <p className="text-md text-[--text-muted]">Sign in to access your projects.</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl"
          variants={itemVariants}
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence>
              {error && (
                <motion.div
                  className="alert alert-error text-sm p-3 rounded-lg bg-red-50 border border-red-200 text-red-700"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: '1rem' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Form fields with proper spacing */}
            <div className="space-y-4">
              <InputField
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                icon={Mail}
                autoComplete="username"
              />
              
              <PasswordField
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed mt-6"
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              variants={itemVariants}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    className="flex items-center justify-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="loading-spinner mr-2" />
                    Signing In...
                  </motion.span>
                ) : (
                  <motion.span
                    key="signin"
                    className="flex items-center justify-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div className="text-center" variants={itemVariants}>
          <p className="text-sm text-[--text-muted]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold hover:underline text-[--primary] transition-colors duration-200"
            >
              Create one now
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;