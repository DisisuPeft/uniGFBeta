import { UseFormRegisterReturn } from "react-hook-form";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  register?: UseFormRegisterReturn;
}

export default function Textarea({
  label,
  error,
  register,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        {...register}
        {...props}
        className={`
          w-full px-3 py-2 
          border rounded-lg 
          text-gray-900 
          placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          resize-vertical min-h-[80px]
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
          ${className}
        `}
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
