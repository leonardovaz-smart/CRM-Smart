
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string; // Permitir larguras diferentes
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-smart-black/80 backdrop-blur-sm animate-in fade-in duration-200 modal-overlay print:bg-transparent print:p-0 print:static print:block">
      <div className={`bg-smart-white border-4 border-smart-black w-full ${maxWidth} rounded-3xl shadow-[12px_12px_0px_0px_rgba(49,216,137,1)] overflow-hidden flex flex-col max-h-[95vh] print:shadow-none print:border-none print:max-h-none print:w-full print:static`}>
        <div className="p-6 border-b-4 border-smart-black flex justify-between items-center bg-smart-black text-smart-white flex-shrink-0 print:hidden">
          <h3 className="text-xl font-black uppercase italic tracking-tighter">{title}</h3>
          <button onClick={onClose} className="hover:text-smart-green transition-colors font-black text-2xl">×</button>
        </div>
        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow print:overflow-visible print:p-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
