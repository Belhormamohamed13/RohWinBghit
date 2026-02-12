import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcfdfc] dark:bg-[#08110b] flex items-center justify-center p-6 relative overflow-hidden selection:bg-primary/30">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10 max-w-2xl"
      >
        <div className="relative mb-12 inline-block">
          <div className="w-48 h-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-elevated flex items-center justify-center group">
            <span className="material-symbols-outlined text-[80px] text-primary italic font-black group-hover:rotate-12 transition-transform">error</span>
          </div>
          <div className="absolute -top-6 -right-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl border-4 border-[#fcfdfc] dark:border-[#08110b]">
            <span className="text-2xl font-black italic">404</span>
          </div>
        </div>

        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-6">
          Moteur <span className="text-primary italic">Coupé.</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-md mx-auto mb-12 uppercase tracking-widest leading-relaxed">
          Il semble que vous ayez quitté le tracé officiel. Cette route n'existe plus ou est en construction.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-soft flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined font-black">arrow_back</span>
            Faire demi-tour
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-slate-900 transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined font-black">home_app_logo</span>
            Retour au Hub
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
