"use client";

import Button from "@/app/ui/components/button";
import { DynamicIcon } from "@/app/ui/icon/dynamic-icon";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Props {
  path: string;
  title?: string;
  icon?: string;
  children?: React.ReactNode;
}

export default function ButtonLink({ path, title, icon, children }: Props) {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  return (
    <Link href={`${path}?ref=${ref}`} className="">
      <Button variant="primary">
        {title && <>{title}</>}
        {icon && <DynamicIcon iconName={icon} color="white" />}
        {children}
      </Button>
    </Link>
  );
}
