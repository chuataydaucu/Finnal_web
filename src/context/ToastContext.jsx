import React, { createContext, useState, useContext, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 2.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-cam-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      default: return <Info className="w-5 h-5 text-cam-500" />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container - Fixed Top Right */}
      <div className="fixed top-24 right-8 z-[9999] flex flex-col gap-4 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className="pointer-events-auto flex items-center gap-4 px-6 py-4 bg-navy-900 border border-white/10 text-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-fade-in-right transform transition-all hover:scale-105 group min-w-[320px] max-w-md"
          >
            {/* Unified Icon Style */}
            <div className="shrink-0">
              {getIcon(toast.type)}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <p className="text-sm font-black tracking-tight leading-snug">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress Bar (Visual only) */}
            <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-white/5 overflow-hidden rounded-full">
              <div className="h-full bg-cam-500 animate-progress"></div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
