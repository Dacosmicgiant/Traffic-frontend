import { useState, type KeyboardEvent, type FormEvent, forwardRef, useImperativeHandle, useRef } from 'react';
import { UI_CONFIG } from '../../utils/constants';
import Button from '../shared/Button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  isTyping?: boolean;
  placeholder?: string;
}

/**
 * Chat input component for sending messages
 * Handles text input, send button, and keyboard shortcuts
 */
const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(({ 
  onSendMessage, 
  isLoading = false, 
  isTyping = false,
  placeholder = "Ask me about Indian traffic laws..."
}, ref) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Expose focus method to parent component
  useImperativeHandle(ref, () => textareaRef.current!);

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  // Handle sending message
  const sendMessage = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading || isTyping) return;
    
    onSendMessage(trimmedMessage);
    setMessage(''); // Clear input after sending
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (but not Shift+Enter for new lines)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Check if send button should be disabled
  const canSend = message.trim().length > 0 && !isLoading && !isTyping;

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* Message input */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            maxLength={UI_CONFIG.maxMessageLength}
            className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            style={{
              minHeight: '44px',
              maxHeight: '120px'
            }}
            onInput={(e) => {
              // Auto-resize textarea
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          
          {/* Character counter */}
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Press Enter to send, Shift+Enter for new line
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {message.length}/{UI_CONFIG.maxMessageLength}
            </span>
          </div>
        </div>
        
        {/* Send button */}
        <Button
          type="submit"
          disabled={!canSend}
          isLoading={isLoading}
          className="px-6 py-3"
        >
          {isLoading || isTyping ? (
            isTyping ? 'AI Typing...' : 'Sending...'
          ) : (
            '→'
          )}
        </Button>
      </form>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;