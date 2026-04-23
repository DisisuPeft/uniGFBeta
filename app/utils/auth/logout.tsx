"use client";
import { useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/auth/authApiSlice";
import { logout as setLogout } from "@/redux/features/auth/authSlice";
import { LogOutIcon } from "lucide-react";
import { FormEvent } from "react";
import { apiSlice } from "@/redux/services/apiSlice";
// import Loading from '@/components/common/Loading';
// import Loading from '@/components/common/Loading';
export default function Logout() {
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  // const [isLogout, setIsLogout] = useState(false)
  const handleLogout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    logout(undefined)
      .unwrap()
      .then(() => {
        dispatch(setLogout());
        dispatch(apiSlice.util.resetApiState());
      });
  };
  return (
    <form onSubmit={handleLogout}>
      <button className="flex h-[50px] grow items-center justify-center gap-2 rounded-full p-3 text-black md:flex-none md:p-2 md:px-3 cursor-pointer">
        <LogOutIcon className="w-6" />
      </button>
    </form>
  );
}
