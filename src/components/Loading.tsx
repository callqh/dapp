
interface LoadingProps {
  loading: boolean;
  text?: string|number|bigint;
  label?: string;
}

export const LoadingText:React.FC<LoadingProps> = ({ loading, text, label }) => {
  return (
    <div className="flex items-center">
      {
        loading  ?
        <div className="animate-spin w-5 h-5 rounded-full border-gray-900 border-r m-1"></div>
        : <p className="text-gray-500 text-[12px] m-1">
          {label ? <span className="font-bold">{label}: </span> : null}
          {text || '-'}
        </p>
      }
    </div>
  );
};
