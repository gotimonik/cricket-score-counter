import React from "react";
import AppLoader from "./AppLoader";

const LoadingOverlay: React.FC<{ isLoading: boolean; label?: string }> = ({
  isLoading,
  label,
}) => (isLoading ? <AppLoader variant="overlay" label={label} /> : null);

export default LoadingOverlay;
