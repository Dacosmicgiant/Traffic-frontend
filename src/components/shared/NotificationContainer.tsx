import { useNotifications } from '../../store/uiStore';
import type { Notification } from '../../api/types';

/**
 * Individual notification component
 */
function NotificationItem({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotifications();

  // Color classes based on notification type
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-100',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-100',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-100',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100'
  };

  // Icon for each notification type
  const icons = {
    success: '✅',
    error: '❌', 
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`
      relative p-4 rounded-lg border shadow-sm 
      ${typeClasses[notification.type]}
      animate-in slide-in-from-right duration-300
    `}>
      <div className="flex items-start">
        <span className="text-lg mr-3 mt-0.5">
          {icons[notification.type]}
        </span>
        <div className="flex-1">
          <p className="font-medium">
            {notification.message}
          </p>
        </div>
        <button
          onClick={() => removeNotification(notification.id)}
          className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Notification container component
 * Displays all active notifications in a fixed position
 */
function NotificationContainer() {
  const { notifications } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
        />
      ))}
    </div>
  );
}

export default NotificationContainer;