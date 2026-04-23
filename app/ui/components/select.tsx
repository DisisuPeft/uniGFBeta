import { UseFormRegisterReturn } from "react-hook-form";

interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "className"
> {
  label?: string;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Record<string, any>[];
  valueKey?: string;
  labelKey?: string;
  register?: UseFormRegisterReturn;
  containerClassName?: string;
  placeholder?: string;
  noOptions?: boolean;
}

export default function Select({
  label,
  error,
  options,
  valueKey = "id",
  labelKey = "nombre",
  register,
  required,
  containerClassName,
  placeholder = "Seleccionar...",
  noOptions = true,
  ...props
}: SelectProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName || ""}`}>
      <label className="text-sm font-medium text-black">
        {label}
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </label>
      <select
        {...props}
        {...register}
        className="px-3 py-2 border border-border rounded-lg bg-white text-gray-800 focus:outline focus:ring-2 focus:ring-ring focus:border-gray-500 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
      >
        {noOptions && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt[valueKey]} value={opt[valueKey]}>
            {opt[labelKey]}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}

// export default function Select({
//   label,
//   error,
//   options,
//   valueKey,
//   labelKey,
//   ...props
// }: {
//   label: string;
//   error?: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   options: Record<string, any>[];
//   required?: boolean;
//   valueKey?: string;
//   labelKey?: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [key: string]: any;
// }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-sm font-medium text-black">
//         {label}
//         {props.required && <p className="text-red-500 ml-1 font-bold">*</p>}
//       </label>
//       <select
//         {...props}
//         className="px-3 py-2 border border-border rounded-lg bg-white text-gray-800 focus:outline focus:ring-2 focus:ring-ring focus:border-gray-500 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
//       >
//         <option value="">Seleccionar...</option>
//         {options.map((opt) => (
//           <option key={opt[valueKey as string]} value={opt[valueKey as string]}>
//             {opt[labelKey as string]}
//           </option>
//         ))}
//       </select>
//       {error && <span className="text-sm text-red-500">{error}</span>}
//     </div>
//   );
// }
