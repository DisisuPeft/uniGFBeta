"use client";

import { useVerify } from "@/hooks";
import Loading from "@/app/components/common/loading";
import { useAppSelector } from "@/redux/hooks";
import { Modal } from "@/app/components/common/modal";

export default function Setup() {
  useVerify();
  const { isLoading } = useAppSelector((state) => state.auth);
  return (
    <Modal show={isLoading} onClose={() => isLoading} transparent={true}>
      <Loading />
    </Modal>
  );
}
