import { CheckCircle, XCircle } from 'react-feather';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function StatusMessage({
  message,
  isDone,
  isError,
}: {
  message: string;
  isDone?: boolean;
  isError?: boolean;
}) {
  return (
    <div
      className={`mt-2 flex items-center gap-x-2 text-left ${isDone ? 'text-grey-500' : isError ? 'text-red-500' : 'text-white'}`}
    >
      {isError ? (
        <XCircle size="24" />
      ) : isDone ? (
        <CheckCircle size="24" className="text-primary" />
      ) : (
        <LoadingSpinner className="text-primary size-6" />
      )}
      {message}
    </div>
  );
}
