import React from "react";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function TooltipTrigger({
    children,
    asChild,
}:{
    children: React.ReactNode;
    asChild?: boolean;
}){
    return <>{children}</>;
}

export function TooltipContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}