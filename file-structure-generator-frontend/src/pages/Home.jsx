import React, { useEffect, useState } from 'react';
import { ArrowRight, Zap, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {











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

  // Parallax effect for hero section
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-16">
      {/* Hero Section with Parallax */}
      <motion.div 
        className="relative overflow-hidden py-20 px-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-sm border border-gray-200 dark:border-gray-700"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{
          backgroundPosition: `center ${scrollY * 0.1}px`
        }}
      >
        <motion.div 
          className="max-w-3xl mx-auto text-center space-y-6"
          variants={fadeIn}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 tracking-tight"
            variants={fadeIn}
          >
            Struct<span className="text-primary-600">Zip</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
            variants={fadeIn}
          >
            Create, organize, and download file structures effortlessly. The simplest way to generate project scaffolding.
          </motion.p>
          
          <motion.div 
            className="pt-4"
            variants={fadeIn}
          >
            <Link 
              to="/generate" 
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Go to Great Zip Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-xl"></div>
      </motion.div>
      
      {/* Features Section */}
      <motion.div 
        className="grid md:grid-cols-3 gap-8 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.div 
          className="card p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-primary-500"
          variants={fadeIn}
          whileHover={{ y: -5 }}
        >
          <Zap className="h-10 w-10 text-primary-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Fast & Simple</h3>
          <p className="text-gray-600 dark:text-gray-400">Generate project structures in seconds with our intuitive interface.</p>
        </motion.div>
        
        <motion.div 
          className="card p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-primary-500"
          variants={fadeIn}
          whileHover={{ y: -5 }}
        >
          <FileText className="h-10 w-10 text-primary-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Multiple Formats</h3>
          <p className="text-gray-600 dark:text-gray-400">Support for both text-based and JSON structure definitions.</p>
        </motion.div>
        
        <motion.div 
          className="card p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-primary-500"
          variants={fadeIn}
          whileHover={{ y: -5 }}
        >
          <Download className="h-10 w-10 text-primary-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Instant Download</h3>
          <p className="text-gray-600 dark:text-gray-400">Get your file structure as a ready-to-use ZIP archive.</p>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="text-center px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          About StructZip
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          StructZip is a powerful tool for developers to quickly create project scaffolding and file structures.
          Generate organized file hierarchies with just a few clicks and download them as ready-to-use ZIP archives.
        </p>
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
              Easy to Use
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Our intuitive interface makes it simple to define your project structure. No complex configurations needed.
          </p>
          <div className="mt-4">
            <Link to="/generate" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
              Try it now
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="card p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
          variants={fadeIn}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center mb-4">
            <Download className="h-6 w-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Instant Download
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Generate and download your file structure as a ZIP archive instantly. Perfect for starting new projects quickly.
          </p>
          <div className="mt-4">
            <Link to="/generate" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
              Generate now
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Footer CTA */}
      <motion.div 
        className="text-center mt-16 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Ready to organize your projects?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Start creating structured file hierarchies for your next project with just a few clicks.
        </p>
        <Link to="/generate">
          <motion.button
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Go to Great Zip Application
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.button>
        </Link>
      </motion.div>

    </div>
  );
};

export default Home;