import React from 'react';


interface RenderIfProps {
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RenderIf: React.FC<RenderIfProps> = ({ condition, children, fallback }) => {
  if (!condition) {
    return <>{fallback ? fallback : null}</>;
  }

  return <>{children}</>;
};