import type { ConversationWithMessages } from '../../api/types';
import Button from '../shared/Button';

interface ChatHeaderProps {
  conversation: ConversationWithMessages | null;
  onExportPDF?: () => void;
}

/**
 * Chat header component
 * Shows current conversation title and actions
 */
function ChatHeader({ conversation, onExportPDF }: ChatHeaderProps) {
  
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Conversation info */}
        <div className="flex-1">
          {conversation ? (
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                {conversation.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {conversation.message_count} messages • Updated {new Date(conversation.updated_at).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                New Conversation
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ask me anything about Indian traffic laws
              </p>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-3">
          {conversation && conversation.messages.length > 0 && (
            <Button
              variant="outline"
              size="small"
              onClick={onExportPDF}
            >
              Export PDF
            </Button>
          )}
          
          {/* Info button */}
          <button
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="About Traffic AI"
          >
            <span className="text-lg">ℹ️</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;