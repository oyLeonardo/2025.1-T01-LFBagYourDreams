import { useState } from 'react';

interface AlertasProps {
  mensagem: string;
  tipo?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
}

function Alertas({ mensagem, tipo = 'info', onClose }: AlertasProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (onClose) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 300); // Duração da animação de fade out
    }
  };
  const getAlertStyles = () => {
    switch (tipo) {
      case 'success':
        return {
          container: "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400",
          button: "bg-green-50 text-green-500 hover:bg-green-200 focus:ring-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
        };
      case 'warning':
        return {
          container: "text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300",
          button: "bg-yellow-50 text-yellow-500 hover:bg-yellow-200 focus:ring-yellow-400 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700"
        };
      case 'error':
        return {
          container: "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400",
          button: "bg-red-50 text-red-500 hover:bg-red-200 focus:ring-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
        };
      default:
        return {
          container: "text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400",
          button: "bg-blue-50 text-blue-500 hover:bg-blue-200 focus:ring-blue-400 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
        };
    }
  };

  const getIcon = () => {
    switch (tipo) {
      case 'success':
        return (
          <svg className="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
          </svg>
        );
      case 'warning':
        return (
          <svg className="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-8a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Z"/>
          </svg>
        );
      case 'error':
        return (
          <svg className="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
          </svg>
        );
      default:
        return (
          <svg className="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
        );
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`flex items-center p-4 mb-4 rounded-lg ${styles.container} ${
      isClosing ? 'animate-fade-out' : 'animate-bounce-in'
    }`} role="alert">
      {getIcon()}
      <span className="sr-only">{tipo}</span>
      <div className="ms-3 text-sm font-medium">
        {mensagem}
      </div>
      {onClose && (
        <button 
          type="button" 
          className={`ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center cursor-pointer justify-center h-8 w-8 ${styles.button}`}
          onClick={handleClose}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      )}
    </div>
  );
}

export default Alertas;