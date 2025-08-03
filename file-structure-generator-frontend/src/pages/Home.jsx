import React, { useEffect, useRef } from 'react';
import { ArrowRight, Zap, FileText, Download, Sparkles, Code2, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

// A single, reusable animation variant for elements fading in from the bottom.
// The transition is a bit faster and snappier for a more responsive feel.
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

// Reusable stagger container for orchestrating animations.
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

// Simplified FeatureCard. It no longer manages its own animation state.
// Instead, it inherits animation from the parent's stagger container for cleaner code.
const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    // The hover animation is now more subtle (less vertical movement).
    // The card styling uses a semi-transparent, "glassmorphism" effect.
    <motion.div
      className="group p-8 rounded-2xl cursor-default relative overflow-hidden bg-white/5 dark:bg-gray-800/20 border border-white/10 dark:border-gray-700/50"
      variants={fadeInUp}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      {/* Subtle glow effect on hover for a modern feel */}
      <div className="absolute top-0 left-0 h-full w-full bg-[--primary] opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-2xl"></div>
      
      <div className="relative">
        <div className="feature-icon mb-5 text-[--primary]">
          <Icon className="h-9 w-9" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const Home = () => {
  // Removed unused scrollY state for a cleaner component.

  return (
    // Increased vertical spacing for better visual separation of sections.
    <div className="max-w-6xl mx-auto space-y-40 md:space-y-48 pb-24 pt-12 overflow-x-hidden">

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-[90vh] flex items-center justify-center text-center px-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Replaced floating shapes with a single, large, blurred gradient "glow" in the background. 
            This is a more modern and subtle effect that adds depth without distraction. */}
        <div className="absolute inset-0 -z-10 overflow-hidden flex items-center justify-center">
          <div
            className="absolute w-[50rem] h-[50rem] md:w-[70rem] md:h-[70rem] opacity-20 dark:opacity-15 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, var(--primary) 0%, transparent 60%)',
            }}
          />
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div variants={fadeInUp} className="space-y-6">
            {/* The animated text shimmer is removed in favor of a clean, static gradient,
                which is impactful yet less distracting for the main heading. */}
            <h1 
              className="text-5xl md:text-7xl font-extrabold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              StructZip
            </h1>
            
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-400">
              Create, organize, and download professional file structures in seconds. 
              The modern way to scaffold your development projects.
            </p>
          </motion.div>
          
          {/* Buttons are simplified and use consistent styling classes. */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/generate" className="btn btn-primary btn-lg inline-flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Creating
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/history" className="btn btn-secondary btn-lg inline-flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                View Examples
              </Link>
            </motion.div>
          </motion.div>

          
          {/* <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16"
            variants={staggerContainer}
          >
            {[
              { number: '10K+', label: 'Projects Created' },
              { number: '2.5M+', label: 'Files Generated' },
              { number: '99.9%', label: 'Uptime' }
            ].map((stat) => (
              <motion.div key={stat.label} className="text-center" variants={fadeInUp}>
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                  {stat.number}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div> */}
        </div>
      </motion.section>
      
      {/* Features Section */}
      <motion.section 
        className="px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Why Choose StructZip?
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
            Experience the future of project scaffolding with features designed for modern developers.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon={Zap} title="Lightning Fast" description="Generate complex project structures in milliseconds with our optimized algorithms." />
          <FeatureCard icon={Code2} title="Smart Validation" description="Built-in validation ensures your file structures are clean and follow best practices." />
          <FeatureCard icon={Download} title="Instant Download" description="Get your file structure as a ready-to-use ZIP archive with proper hierarchy." />
          <FeatureCard icon={FileText} title="Multiple Formats" description="Support for JSON and text formats. Choose what works best for your workflow." />
          <FeatureCard icon={Clock} title="Version History" description="Keep track of all your generated structures with automatic versioning and easy rollbacks." />
          <FeatureCard icon={Shield} title="Secure & Private" description="Your data is yours. We never store your project structures without permission." />
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="text-center px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
      >
        {/* CTA card uses a clean gradient with a subtle noise texture overlay
            instead of the animated SVG background for a more premium, static look. */}
        <div 
          className="rounded-3xl p-10 md:p-16 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
        >
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5"></div>
          
          <div className="relative z-10 space-y-6 text-white">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Structure Your Next Project?
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of developers who trust StructZip for their project scaffolding needs.
            </p>
            <motion.div className="pt-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/generate" className="btn btn-light btn-lg inline-flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Building Now
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;