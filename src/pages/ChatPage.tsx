import { useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { useNotifications } from '../store/uiStore';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatHeader from '../components/chat/ChatHeader';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';


/**
 * Main chat page component
 * Combines sidebar, header, message area, and input
 */
function ChatPage() {
  const {
    currentConversation,
    isLoading,
    isTyping,
    error,
    loadConversations,
    sendMessage
  } = useChat();
  
  const { addNotification } = useNotifications();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isTyping]);

  // Handle sending message
  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message, currentConversation?.id);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      });
    }
  };

  // Handle PDF export (placeholder for now)
  const handleExportPDF = () => {
    addNotification({
      type: 'info',
      message: 'PDF export feature coming soon!'
    });
  };

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <ChatSidebar />
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ChatHeader 
          conversation={currentConversation}
          onExportPDF={handleExportPDF}
        />
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {error && (
            <div className="p-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {error}
                </p>
              </div>
            </div>
          )}
          
          {currentConversation ? (
            <div className="p-4 space-y-4">
              {currentConversation.messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Ready to Help!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    Ask me anything about Indian traffic laws, fines, license procedures, or Motor Vehicle Act regulations.
                  </p>
                </div>
              ) : (
                <>
                  {currentConversation.messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <ChatMessage 
                      message={{
                        id: 'typing',
                        role: 'assistant',
                        content: '',
                        timestamp: new Date().toISOString(),
                        conversation_id: currentConversation.id
                      }}
                      isTyping={true}
                    />
                  )}
                </>
              )}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            /* Welcome screen for new conversation */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🚗</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to Traffic AI
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  I'm here to help you understand Indian traffic laws and regulations. 
                  Ask me about fines, license procedures, Motor Vehicle Act, or any traffic-related questions.
                </p>
                <div className="text-left bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Try asking:
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• "What is the penalty for not wearing a helmet?"</li>
                    <li>• "How to renew my driving license?"</li>
                    <li>• "What documents are needed for vehicle registration?"</li>
                    <li>• "Speed limit rules in different states"</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Input area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          isTyping={isTyping}
        />
      </div>
    </div>
  );
}

export default ChatPage;