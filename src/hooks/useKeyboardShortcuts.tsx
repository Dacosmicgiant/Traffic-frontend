import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

/**
 * Custom hook for keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in inputs
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = !!shortcut.ctrlKey === event.ctrlKey;
        const shiftMatches = !!shortcut.shiftKey === event.shiftKey;
        const altMatches = !!shortcut.altKey === event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

/**
 * Chat-specific keyboard shortcuts
 */
export function useChatKeyboardShortcuts(
  onNewConversation: () => void,
  onToggleTheme: () => void,
  onFocusInput?: () => void
) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'n',
      ctrlKey: true,
      action: onNewConversation,
      description: 'New conversation'
    },
    {
      key: 't',
      ctrlKey: true,
      action: onToggleTheme,
      description: 'Toggle theme'
    },
    {
      key: '/',
      action: () => onFocusInput?.(),
      description: 'Focus message input'
    }
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}