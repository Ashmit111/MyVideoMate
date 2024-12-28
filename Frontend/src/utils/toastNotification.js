import { toast } from 'react-hot-toast';

// Common configuration for dark theme
const commonOptions = {
  style: {
    background: '#333',
    color: '#fff',
  },
};

// Success toast
export const showSuccessToast = (message, duration = 3000) => {
  toast.success(message, {
    ...commonOptions,
    icon: '✅',
    duration,
  });
};

// Error toast
export const showErrorToast = (message, duration = 3000) => {
  toast.error(message, {
    ...commonOptions,
    icon: '❌',
    duration,
  });
};

// Promise toast (with loading, success, and error states)
export const showPromiseToast = (promise, loadingMessage, successMessage, errorMessage, duration = 3000) => {
  toast.promise(promise, {
    loading: loadingMessage,
    success: successMessage,
    error: errorMessage,
    duration,
  }, commonOptions);
};

// Emoji toast
export const showEmojiToast = (message, emoji, duration = 3000) => {
  toast(message, {
    ...commonOptions,
    icon: emoji,
    duration,
  });
};
 
