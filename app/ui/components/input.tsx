import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  register?: UseFormRegisterReturn;
}

export default function Input({
  label,
  error,
  register,
  required,
  className,
  ...props
}: InputProps) {
  // console.log(error);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-800">{label}</label>
      <input
        {...props}
        {...register}
        className="px-3 py-2 border border-1 rounded-lg bg-white text-gray-800 focus:outline focus:ring-2 focus:ring focus:border-transparent transition-all"
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
