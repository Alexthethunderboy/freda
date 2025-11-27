import React, { useRef, useEffect } from 'react';
import FocusLock from 'react-focus-lock';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      lastActiveElement.current = document.activeElement as HTMLElement;
      dialogRef.current?.focus();
    } else {
      lastActiveElement.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black text-white"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />
      <FocusLock returnFocus>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          tabIndex={-1}
          ref={dialogRef}
          className="relative z-10 bg-cream rounded-lg shadow-lg p-6 max-w-md w-[92%] md:w-full focus:outline-none"
          onClick={e => e.stopPropagation()}
        >
          <h3 id="modal-title" className="font-playfair text-xl mb-2">{title}</h3>
          {description && <p id="modal-desc" className="mb-4 text-textSecondary">{description}</p>}
          <div>{children}</div>
          <button
            className="absolute top-2 right-2 text-textPrimary bg-accentPink/20 px-3 py-1 rounded focus:ring-2 focus:ring-accentYellow"
            aria-label="Close modal"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </FocusLock>
    </div>
  );
};

export default Modal;
