import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIState, Notification } from '../api/types';
import { STORAGE_KEYS, UI_CONFIG } from '../utils/constants';

/**
 * UI store using Zustand
 * Manages theme, sidebar, notifications, and other UI state
 */
interface UIStore extends UIState {
  // Theme actions
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: UI_CONFIG.defaultTheme,
      sidebarOpen: true,
      notifications: [],

      // Theme management
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        
        // Apply theme to document root for CSS variables
        document.documentElement.setAttribute('data-theme', newTheme);
      },

      setTheme: (theme: "light" | "dark") => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },

      // Sidebar management
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      // Notification management
      addNotification: (notificationData: Omit<Notification, 'id'>) => {
        const notification: Notification = {
          id: Date.now().toString(),
          duration: 5000, // Default 5 seconds
          ...notificationData
        };
        
        set((state) => ({
          notifications: [...state.notifications, notification]
        }));

        // Auto-remove notification after duration
        if (notification.duration) {
          setTimeout(() => {
            get().removeNotification(notification.id);
          }, notification.duration);
        }
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      }
    }),
    {
      name: STORAGE_KEYS.theme, // localStorage key for persistence
      // Only persist theme and sidebar preference
      partialize: (state) => ({ 
        theme: state.theme,
        sidebarOpen: state.sidebarOpen 
      }),
      // Initialize theme on page load
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      }
    }
  )
);

// Selector hooks for easier usage in components
export const useTheme = () => {
  const store = useUIStore();
  return {
    theme: store.theme,
    toggleTheme: store.toggleTheme,
    setTheme: store.setTheme
  };
};

export const useSidebar = () => {
  const store = useUIStore();
  return {
    sidebarOpen: store.sidebarOpen,
    toggleSidebar: store.toggleSidebar,
    setSidebarOpen: store.setSidebarOpen
  };
};

export const useNotifications = () => {
  const store = useUIStore();
  return {
    notifications: store.notifications,
    addNotification: store.addNotification,
    removeNotification: store.removeNotification,
    clearNotifications: store.clearNotifications
  };
};