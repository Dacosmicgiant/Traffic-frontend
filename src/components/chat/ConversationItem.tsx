import type { Conversation } from '../../api/types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

/**
 * Individual conversation item in the sidebar
 */
function ConversationItem({ conversation, isActive, onClick, onDelete }: ConversationItemProps) {
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div 
      className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
        isActive 
          ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
      onClick={onClick}
    >
      {/* Conversation content */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-medium truncate ${
          isActive 
            ? 'text-blue-900 dark:text-blue-100' 
            : 'text-gray-900 dark:text-white'
        }`}>
          {conversation.title}
        </h3>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {conversation.message_count} messages
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(conversation.updated_at)}
          </span>
        </div>
      </div>
      
      {/* Delete button (shows on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering onClick
          onDelete();
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-6 h-6 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 rounded-full flex items-center justify-center transition-opacity"
        title="Delete conversation"
      >
        <span className="text-red-600 dark:text-red-400 text-xs">✕</span>
      </button>
    </div>
  );
}

export default ConversationItem;