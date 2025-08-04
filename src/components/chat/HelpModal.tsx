import { useEffect } from 'react';
import Button from '../shared/Button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Help modal component
 * Shows keyboard shortcuts and usage tips
 */
function HelpModal({ isOpen, onClose }: HelpModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Help & Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* About section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              About Traffic AI
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              I'm your AI assistant specialized in Indian traffic laws and regulations. 
              I can help you understand the Motor Vehicle Act, traffic fines, license procedures, 
              and vehicle registration requirements across different Indian states.
            </p>
          </div>

          {/* Example questions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Example Questions
            </h3>
            <div className="space-y-2">
              {[
                "What is the penalty for overspeeding?",
                "How to apply for a driving license?",
                "What documents are required for vehicle registration?",
                "Traffic rules for two-wheelers in Mumbai",
                "Fine for not wearing seat belt",
                "How to pay traffic fines online?"
              ].map((question, index) => (
                <div key={index} className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  "{question}"
                </div>
              ))}
            </div>
          </div>

          {/* Keyboard shortcuts */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2">
              {[
                { keys: 'Ctrl + N', action: 'Start new conversation' },
                { keys: 'Ctrl + T', action: 'Toggle theme' },
                { keys: '/', action: 'Focus message input' },
                { keys: 'Enter', action: 'Send message' },
                { keys: 'Shift + Enter', action: 'New line in message' },
                { keys: 'Esc', action: 'Close this modal' }
              ].map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    {shortcut.action}
                  </span>
                  <code className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
                    {shortcut.keys}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Tips
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Be specific with your questions for better answers</li>
              <li>• Mention your state if asking about local traffic rules</li>
              <li>• Ask follow-up questions for more details</li>
              <li>• Export important conversations as PDF for reference</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={onClose}
            className="w-full"
          >
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;