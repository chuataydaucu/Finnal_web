import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden flex items-center justify-center p-4">
      {/* Backdrop - Now covers the entire viewport correctly */}
      <div 
        className="fixed inset-0 bg-navy-900/60 backdrop-blur-[8px] transition-opacity animate-fade-in"
        onClick={onClose}
      ></div>
      
      {/* Modal Content Container - Centered perfectly */}
      <div className={`relative w-full ${maxWidth} transform transition-all flex items-center justify-center min-h-full py-12`}>
        <div className="relative bg-white rounded-[2.5rem] shadow-[0_25px_70px_rgba(15,23,42,0.4)] w-full flex flex-col max-h-[85vh] overflow-hidden animate-zoom-in border border-white/40">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-white/90 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-cam-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.6)]"></div>
              <h3 className="text-2xl font-black text-navy-900 tracking-tight">
                {title}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-navy-900 transition-all rounded-2xl p-2 hover:bg-slate-100 active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
