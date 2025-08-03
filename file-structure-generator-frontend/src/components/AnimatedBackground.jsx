import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// A single particle component, managed by React.
// This is a more "React-like" way to handle the particles.
const Particle = ({ style }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-[--primary]"
      style={style}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        y: [0, -window.innerHeight],
        opacity: [0, 0.8, 0],
        scale: [1, 1, 0.5]
      }}
      transition={{
        duration: Math.random() * 10 + 10, // 10-20 seconds
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        delay: Math.random() * 15
      }}
    />
  );
};

const SubtleAnimatedBackground = () => {
  // We can generate a memoized list of particles to avoid re-creating them on every render.
  const particles = React.useMemo(() => 
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      style: {
        width: `${Math.random() * 2 + 1}px`,
        height: `${Math.random() * 2 + 1}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }
    })), 
  []);

  return (
    <div 
      className="fixed inset-0 -z-50 overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Aurora Gradient Blobs */}
      <motion.div
        className="absolute top-[-30%] left-[-30%] w-[60rem] h-[60rem] bg-[--primary] rounded-full opacity-20 dark:opacity-10 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: ['-20%', '0%', '-20%'],
          y: ['-20%', '0%', '-20%'],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-30%] right-[-30%] w-[60rem] h-[60rem] bg-[--accent] rounded-full opacity-20 dark:opacity-10 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: ['20%', '0%', '20%'],
          y: ['20%', '0%', '20%'],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
      />
      
      {/* Particle System */}
      <div className="absolute inset-0">
        {particles.map(p => <Particle key={p.id} style={p.style} />)}
      </div>
    </div>
  );
};

export default SubtleAnimatedBackground;
