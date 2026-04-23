"use client";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Alert } from "@mui/material";
import { Check, X } from "lucide-react";
import { useEffect } from "react";
import { clearAlert } from "@/redux/features/alert/alertSlice";

export default function AlertSystem() {
  const alert = useAppSelector((state) => state.alert);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => dispatch(clearAlert()), 8000);
      return () => clearTimeout(timeout);
    }
  }, [alert, dispatch]);

  if (!alert) return null;

  return (
    <div className="fixed top-[80px] right-6 z-[9999] backdrop-blur-sm bg-black/10 rounded-lg">
      <Alert
        icon={
          alert.type === "success" ? (
            <div className="rounded-full">
              <Check fontSize="inherit" />
            </div>
          ) : (
            <X fontSize="inherit" />
          )
        }
        variant="filled"
        severity={alert.type}
        className="shadow-lg border-2 border-white/20"
      >
        {alert.message}
      </Alert>
    </div>
  );
}
