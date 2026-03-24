"use client";
import { useState } from "react";
import { DietForm } from "./_components/diet-form";
import { DietGenerator } from "./_components/diet-generator";
import { DietData } from "@/types/diet-data";

export default function Home() {
  const [data, setData] = useState<DietData | null>(null);

  function handleSubmit(userInfo: DietData) {
    setData(userInfo);
  }
  return (
    <>
      {!data ? (
        <DietForm onSubmit={handleSubmit} />
      ) : (
        <DietGenerator data={data} />
      )}
    </>
  );
}
