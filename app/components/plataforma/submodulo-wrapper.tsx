"use client";

import GrabacionClaseView from "./grabacion-clase-view";

// import { useParams } from "next/navigation";

export default function SubmoduloWrapper({
  submoduloId,
}: {
  submoduloId: string;
}) {
  //   const params = useParams();
  console.log(submoduloId);
  return <GrabacionClaseView />;
}
