import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../store/uiStore';
import ConversationItem from './ConversationItem';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';

interface ChatSidebarProps {
  onClose?: () => void;
}

/**
 * Chat sidebar component
 * Shows conversation list and user info
 */
function ChatSidebar({ onClose }: ChatSidebarProps) {
  const { 
    conversations, 
    currentConversation, 
    isLoading,
    startNewConversation, 
    selectConversation, 
    removeConversation 
  } = useChat();
  
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleDeleteConversation = async (conversationId: string) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      await removeConversation(conversationId);
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Traffic AI
          </h2>
          
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        
        {/* New chat button */}
        <Button
          onClick={startNewConversation}
          className="w-full"
          variant="outline"
        >
          + New Conversation
        </Button>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Recent Conversations
        </h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner text="Loading conversations..." />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No conversations yet.
              <br />
              Start a new chat to begin!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={currentConversation?.id === conversation.id}
                onClick={() => {
                  selectConversation(conversation.id);
                  onClose?.(); // Close mobile sidebar
                }}
                onDelete={() => handleDeleteConversation(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* User info and logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {user?.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.full_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Logout"
          >
            <span className="text-sm">🚪</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatSidebar;