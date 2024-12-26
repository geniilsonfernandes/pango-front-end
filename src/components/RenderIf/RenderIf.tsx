import React from 'react';


interface RenderIfProps {
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  isLoading?: boolean;
  isLoadingFallback?: React.ReactNode;
}

export const RenderIf: React.FC<RenderIfProps> = ({
  condition,
  children,
  fallback,
  isLoading,
  isLoadingFallback,
}) => {
  if (isLoading) {
    return <>{isLoadingFallback ? isLoadingFallback : null}</>;
  }

  if (!condition) {
    return <>{fallback ? fallback : null}</>;
  }

  return <>{children}</>;
};