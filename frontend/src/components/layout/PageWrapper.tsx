import React from "react";

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageWrapper({ title, children, actions }: PageWrapperProps) {
  return (
    <div className="flex-1 p-6 md:p-8 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-slate-800">{title}</h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
