// import Swal from "sweetalert2";
// import 'sweetalert2/src/sweetalert2.scss'
import { GraduationCap } from "lucide-react";
export default function Loading() {
  return (
    <div className="flex-col gap-4 w-full flex items-center justify-center">
      <div className="w-28 h-28 border-8 text-[#12090a] text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-[#12090a] rounded-full">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          height="1em"
          width="1em"
          className="animate-ping"
        >
          <GraduationCap />
        </svg>
      </div>
    </div>
    // <div className="flex items-center justify-center p-[50px]">
    //   <div className="relative">
    //       <div
    //         className="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-48 md:h-48 h-32 w-32 aspect-square rounded-full"
    //       >
    //         <div
    //           className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"
    //         ></div>
    //       </div>
    //   </div>
    // </div>
  );
}
