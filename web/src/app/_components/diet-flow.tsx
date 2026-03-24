"use client";

import { useState } from "react";
import { DietForm } from "./diet-form";
import { DietGenerator } from "./diet-generator";
import { DietData } from "@/types/diet-data";

export function DietFlow() {
  const [data, setData] = useState<DietData | null>(null);
  const [isEditing, setIsEditing] = useState(true);

  function handleSubmit(userInfo: DietData) {
    setData(userInfo);
    setIsEditing(false);
  }

  return !data || isEditing ? (
    <DietForm
      key={data ? "filled-form" : "empty-form"}
      onSubmit={handleSubmit}
      onClear={() => setData(null)}
      initialValues={data}
    />
  ) : (
    <DietGenerator data={data} onEdit={() => setIsEditing(true)} />
  );
}
