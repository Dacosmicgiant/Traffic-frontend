/**
 * Chat page component - placeholder for now
 * We'll build the full chat interface in the next step
 */
function ChatPage() {
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar placeholder */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conversations
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Chat sidebar will be implemented here
          </p>
        </div>
      </div>
      
      {/* Main chat area placeholder */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Chat Interface
          </h2>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Welcome to Traffic AI
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Full chat interface will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;