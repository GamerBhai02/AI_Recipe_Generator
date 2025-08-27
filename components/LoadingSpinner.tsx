import React from 'react';

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="text-center py-10 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin dark:border-emerald-400 dark:border-t-transparent"></div>
      <p className="mt-4 text-slate-600 font-medium dark:text-slate-300">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
