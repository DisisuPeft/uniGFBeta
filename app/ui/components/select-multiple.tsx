import { useState, useRef, useEffect } from "react";
// import { UseFormRegisterReturn, Controller } from "react-hook-form";

interface MultiSelectProps {
  label: string;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Record<string, any>[];
  valueKey?: string;
  labelKey?: string;
  value?: string[];
  onChange?: (selected: string[]) => void;
  required?: boolean;
  placeholder?: string;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: any;
  containerClassName?: string;
}

export default function MultiSelect({
  label,
  error,
  options,
  valueKey = "value",
  labelKey = "label",
  value = [],
  onChange,
  required = false,
  placeholder = "Seleccionar...",
  containerClassName,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (optionValue: string) => {
    const newSelected = selected.includes(optionValue)
      ? selected.filter((v) => v !== optionValue)
      : [...selected, optionValue];

    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = selected.filter((v) => v !== optionValue);
    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const getLabel = (val: string) => {
    const option = options.find((opt) => opt[valueKey] === val);
    return option ? option[labelKey] : val;
  };

  return (
    <div
      className={`relative flex flex-col gap-1.5 ${containerClassName || ""}`}
      ref={containerRef}
    >
      <label className="text-sm font-medium text-black">
        {label}
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
      </label>

      <div
        className="relative px-3 py-2 border border-border rounded-lg bg-white text-gray-800 focus-within:ring-2 focus-within:ring-ring focus-within:border-gray-500 transition-all cursor-pointer min-h-[42px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1.5 pr-8">
          {selected.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selected.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium"
              >
                {getLabel(val)}
                <button
                  type="button"
                  onClick={(e) => handleRemove(val, e)}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            ))
          )}
        </div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto top-full">
          {options.map((option) => {
            const isSelected = selected.includes(option[valueKey]);
            return (
              <div
                key={option[valueKey]}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(option[valueKey]);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${
                  isSelected ? "bg-blue-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className={isSelected ? "font-medium text-blue-800" : ""}>
                  {option[labelKey]}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {error && <span className="text-sm text-red-500">{error}</span>}

      {selected.length > 0 && (
        <span className="text-xs text-gray-500">
          {selected.length}{" "}
          {selected.length === 1
            ? "elemento seleccionado"
            : "elementos seleccionados"}
        </span>
      )}
    </div>
  );
}

// import { useState, useRef, useEffect } from "react";

// export default function MultiSelect({
//   label,
//   error,
//   options,
//   valueKey = "value",
//   labelKey = "label",
//   value = [],
//   onChange,
//   required = false,
//   placeholder = "Seleccionar...",
// }: // ...props
// {
//   label: string;
//   error?: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   options: Record<string, any>[];
//   valueKey?: string;
//   labelKey?: string;
//   value?: string[];
//   onChange?: (selected: string[]) => void;
//   required?: boolean;
//   placeholder?: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [key: string]: any;
// }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selected, setSelected] = useState<string[]>(value);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen]);

//   const handleToggle = (optionValue: string) => {
//     const newSelected = selected.includes(optionValue)
//       ? selected.filter((v) => v !== optionValue)
//       : [...selected, optionValue];

//     setSelected(newSelected);
//     onChange?.(newSelected);
//   };

//   const handleRemove = (optionValue: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     const newSelected = selected.filter((v) => v !== optionValue);
//     setSelected(newSelected);
//     onChange?.(newSelected);
//   };

//   const getLabel = (val: string) => {
//     const option = options.find((opt) => opt[valueKey] === val);
//     return option ? option[labelKey] : val;
//   };

//   return (
//     <div className="relative flex flex-col gap-1.5" ref={containerRef}>
//       <label className="text-sm font-medium text-black">
//         {label}
//         {required && <span className="text-red-500 ml-1 font-bold">*</span>}
//       </label>

//       <div
//         className="relative px-3 py-2 border border-border rounded-lg bg-white text-gray-800 focus-within:ring-2 focus-within:ring-ring focus-within:border-gray-500 transition-all cursor-pointer min-h-[42px]"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className="flex flex-wrap gap-1.5 pr-8">
//           {selected.length === 0 ? (
//             <span className="text-gray-400">{placeholder}</span>
//           ) : (
//             selected.map((val) => (
//               <span
//                 key={val}
//                 className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium"
//               >
//                 {getLabel(val)}
//                 <button
//                   type="button"
//                   onClick={(e) => handleRemove(val, e)}
//                   className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
//                 >
//                   <svg
//                     width="14"
//                     height="14"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <line x1="18" y1="6" x2="6" y2="18" />
//                     <line x1="6" y1="6" x2="18" y2="18" />
//                   </svg>
//                 </button>
//               </span>
//             ))
//           )}
//         </div>

//         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//           <svg
//             width="20"
//             height="20"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
//           >
//             <polyline points="6 9 12 15 18 9" />
//           </svg>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
//           {options.map((option) => {
//             const isSelected = selected.includes(option[valueKey]);
//             return (
//               <div
//                 key={option[valueKey]}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleToggle(option[valueKey]);
//                 }}
//                 className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${
//                   isSelected ? "bg-blue-50" : ""
//                 }`}
//               >
//                 <input
//                   type="checkbox"
//                   checked={isSelected}
//                   onChange={() => {}}
//                   className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                 />
//                 <span className={isSelected ? "font-medium text-blue-800" : ""}>
//                   {option[labelKey]}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {error && <span className="text-sm text-red-500">{error}</span>}

//       {selected.length > 0 && (
//         <span className="text-xs text-gray-500">
//           {selected.length}{" "}
//           {selected.length === 1
//             ? "elemento seleccionado"
//             : "elementos seleccionados"}
//         </span>
//       )}
//     </div>
//   );
// }
