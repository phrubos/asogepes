import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownUp, RefreshCcw, Sprout, Wind, Skull, Layers } from 'lucide-react';

const SoilInfographic: React.FC = () => {
  const [isPloughed, setIsPloughed] = useState(false);

  const togglePlough = () => setIsPloughed(!isPloughed);

  return (
    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl p-6 border border-earth-200 overflow-hidden">
      
      {/* Header / Control */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-xl text-earth-800 font-bold">
          {isPloughed ? "Szántás után" : "Természetes állapot"}
        </h3>
        <button
          onClick={togglePlough}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-sm
            ${isPloughed 
              ? 'bg-earth-400 text-white hover:bg-earth-500' 
              : 'bg-green-700 text-white hover:bg-green-800'
            }`}
        >
          {isPloughed ? (
            <>
              <RefreshCcw size={16} /> Visszaállítás
            </>
          ) : (
            <>
              <ArrowDownUp size={16} /> Szántás
            </>
          )}
        </button>
      </div>

      {/* Visualization Container */}
      <div className="relative h-80 w-full rounded-xl overflow-hidden bg-earth-100 border-2 border-earth-200">
        
        {/* Background Gradients/Texture */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

        {/* LAYERS CONTAINER */}
        <div className="relative w-full h-full flex flex-col justify-center p-4 gap-1">
          
          {/* AEROBIC LAYER (The Living Soil) */}
          <motion.div
            layout
            initial={false}
            animate={{
              y: isPloughed ? 140 : 0, // Moves down if ploughed
              filter: isPloughed ? 'grayscale(0.5) brightness(0.8)' : 'grayscale(0)'
            }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="h-32 w-full rounded-lg relative flex items-center justify-between px-6 shadow-md z-10"
            style={{ backgroundColor: '#5D4037' }} // Dark brown
          >
            <div className="text-white/90">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold font-serif text-lg">Aerob réteg</span>
                {isPloughed ? <Skull size={18} className="text-red-300" /> : <Sprout size={18} className="text-green-300" />}
              </div>
              <p className="text-xs opacity-80 max-w-[140px]">
                {isPloughed ? "Eltemetve, oxigénhiányos." : "Élő, oxigéndús, morzsalékos."}
              </p>
            </div>
            
            {/* Abstract visual elements for life/air */}
            <div className="flex gap-2">
               {!isPloughed && (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                   className="flex gap-1"
                 >
                   <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs text-white" title="Oxigén">O₂</div>
                   <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs text-green-200" title="Élet">Bio</div>
                 </motion.div>
               )}
            </div>
          </motion.div>


          {/* PLOUGH PAN (Eketalp) - Only appears when ploughed */}
          <AnimatePresence>
            {isPloughed && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute top-1/2 left-0 right-0 h-2 bg-red-900/40 z-20 flex items-center justify-center"
              >
                <div className="bg-red-800 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
                  Eketalp (Tömör)
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* ANAEROBIC LAYER (The Dead Soil) */}
          <motion.div
            layout
            initial={false}
            animate={{
              y: isPloughed ? -140 : 0, // Moves up if ploughed
            }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="h-32 w-full rounded-lg relative flex items-center justify-between px-6 shadow-sm z-0"
            style={{ backgroundColor: '#8D6E63' }} // Lighter brown
          >
            <div className="text-white/90">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold font-serif text-lg">Anaerob réteg</span>
                <Layers size={18} className="text-earth-200" />
              </div>
              <p className="text-xs opacity-80 max-w-[140px]">
                {isPloughed ? "Felszínre kerülve kiszárad." : "Tömör, oxigénszegény."}
              </p>
            </div>
             
             {/* Abstract elements */}
            <div className="flex gap-2">
                {isPloughed && (
                    <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-xs text-white" title="Halott">
                        <Wind size={14} />
                    </motion.div>
                )}
            </div>
          </motion.div>

        </div>

        {/* Roots Visualisation (Overlay) */}
        <div className="absolute inset-0 pointer-events-none z-30 opacity-40">
            {/* Draw abstract roots that get cut off in ploughed state */}
             <svg width="100%" height="100%" className="absolute bottom-0 left-10 w-24">
                <path 
                    d="M10,0 Q15,50 10,100 T20,200" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2" 
                    className={`transition-all duration-500 ${isPloughed ? 'opacity-0' : 'opacity-100'}`}
                />
                <path 
                    d="M40,0 Q35,60 50,120" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="1.5" 
                    className={`transition-all duration-500 ${isPloughed ? 'opacity-0' : 'opacity-100'}`}
                />
             </svg>
             {/* Stunted roots for ploughed state */}
             <svg width="100%" height="100%" className={`absolute top-0 left-10 w-24 transition-opacity duration-500 ${isPloughed ? 'opacity-100' : 'opacity-0'}`}>
                <path 
                    d="M10,10 Q15,40 10,60" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2" 
                />
                 {/* Hit the pan */}
                <line x1="5" y1="160" x2="35" y2="160" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 2" />
             </svg>
        </div>

      </div>

      {/* Minimal Caption */}
      <div className="mt-4 text-center">
        <p className="text-sm text-earth-600 font-sans italic">
            {isPloughed 
                ? "A szántás megfordítja a rétegeket: a biológiai élet elpusztul, vízzáró réteg keletkezik." 
                : "Természetes állapot: egészséges talajélet, átjárható rétegek."}
        </p>
      </div>
    </div>
  );
};

export default SoilInfographic;