"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        aria-label="Alternar tema"
        className="rounded-full border-border/70 bg-background/70 text-muted-foreground backdrop-blur-sm"
        size="icon-sm"
        type="button"
        variant="outline"
      >
        <Sun className="size-3.5 opacity-0" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      aria-label={`Ativar modo ${isDark ? "claro" : "escuro"}`}
      className="rounded-full border-border/70 bg-background/70 text-muted-foreground shadow-sm backdrop-blur-sm hover:text-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      size="icon-sm"
      type="button"
      variant="outline"
    >
      {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
    </Button>
  );
}
