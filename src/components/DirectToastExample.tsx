import { toastError, toastGeneric, toastInfo, toastSuccess, toastWarning } from '@/lib/toast';
import React from 'react';

interface DirectToastExampleProps {
  buttonClassName?: string;
}

const DirectToastExample: React.FC<DirectToastExampleProps> = ({ buttonClassName = '' }) => {
  const buttonStyle = `px-4 py-2 m-2 rounded ${buttonClassName}`;

  return (
    <div className="flex flex-wrap justify-center">
      <button
        className={`bg-green-500 hover:bg-green-600 text-white ${buttonStyle}`}
        onClick={() => toastSuccess('Direct success message!')}
      >
        Direct Success
      </button>

      <button
        className={`bg-red-500 hover:bg-red-600 text-white ${buttonStyle}`}
        onClick={() => toastError('Direct error message!')}
      >
        Direct Error
      </button>

      <button
        className={`bg-blue-500 hover:bg-blue-600 text-white ${buttonStyle}`}
        onClick={() => toastInfo('Direct info message!')}
      >
        Direct Info
      </button>

      <button
        className={`bg-yellow-500 hover:bg-yellow-600 text-white ${buttonStyle}`}
        onClick={() => toastWarning('Direct warning message!')}
      >
        Direct Warning
      </button>

      <button
        className={`bg-gray-500 hover:bg-gray-600 text-white ${buttonStyle}`}
        onClick={() => toastGeneric('Direct default message!')}
      >
        Direct Default
      </button>
    </div>
  );
};

export default DirectToastExample;