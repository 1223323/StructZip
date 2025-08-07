import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, LogOut, FolderOpen, History, Home, Download, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Effect for handling navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      // A lower scroll threshold makes the effect appear sooner and feel more responsive.
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect for closing the mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);


  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/generate', label: 'Generate', icon: Download },
    { path: '/history', label: 'History', icon: History },
  ];

  // Variants for mobile menu animation for a cleaner look
  const mobileMenuVariants = {
    hidden: { opacity: 5, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.1, ease: 'easeIn' } },
  };

  return (
    <>
      {/* This motion.nav has been simplified. 
        - The background is transparent when at the top of the page.
        - On scroll, it gains a semi-transparent, blurred background with a subtle bottom border for depth.
        - The inline style has been removed for cleaner JSX.
      */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-gray-950/75 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
                >
                  <FolderOpen className="h-5 w-5" />
                </div>
                <span className="text-xl font-semibold tracking-tight transition-colors" style={{ color: 'var(--text)' }}>
                  STRUCT<span style={{ color: 'var(--primary)' }}>ZIP</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            {user && (
              // This container creates a modern "pill" shape for the navigation items.
              <div className="hidden md:flex items-center space-x-1 bg-gray-300/50 dark:bg-gray-500/50 p-1 rounded-full">
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link to={path} key={path} className="relative px-4 py-2 rounded-full">
                    <motion.div
                      className={`flex items-center space-x-2 transition-colors ${
                        isActive(path)
                          ? 'text-[--primary]'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                      }`}
                      whileHover={{ y: isActive(path) ? 0 : -1 }}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </motion.div>
                    {/* This is the animated active indicator. It uses layoutId to smoothly
                      animate between the active navigation items.
                    */}
                    {isActive(path) && (
                      <motion.div
                        className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full -z-10"
                        layoutId="active-nav-link"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                ))}
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Theme Toggle with a more subtle hover effect */}
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ color: 'var(--text-muted)' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle color theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isDark ? 'sun' : 'moon'}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {user ? (
                <>
                  {/* Desktop User Menu */}
                  <div className="hidden md:flex items-center space-x-3">
                    <motion.button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-full transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogOut className="h-4 w-4" />
                    </motion.button>
                  </div>

                  {/* Mobile Menu Toggle */}
                  <div className="md:hidden">
                    <motion.button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="p-2 rounded-full"
                      style={{ color: 'var(--text-muted)' }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Toggle mobile menu"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={mobileMenuOpen ? 'close' : 'menu'}
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </motion.div>
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login" className="btn btn-secondary text-sm">Login</Link>
                  <Link to="/register" className="btn btn-primary text-sm">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Improved Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && user && (
            // The menu is now positioned absolutely below the navbar for a cleaner separation.
            // It has its own background blur and animates in smoothly from the top.
            <motion.div
              ref={mobileMenuRef}
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg"
            >
              <div className="p-4 space-y-2">
                <div className="px-2 py-2 mb-2">
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                    Welcome, {user.username}
                  </p>
                </div>
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive(path)
                        ? 'bg-[--primary] text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    style={{ color: isActive(path) ? 'white' : 'var(--text)' }}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700/50 pt-4 mt-4">
                  {/* Subtle destructive action style for logout */}
                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Logout</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/* This backdrop overlay appears when the mobile menu is open.
        It dims the main content, focusing the user's attention, and allows
        closing the menu by clicking anywhere outside of it.
      */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;