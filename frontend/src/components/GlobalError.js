"use client";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useGlobalErrorContext } from "@/contexts/GlobalErrorContext";

export const GlobalError = () => {
  const [globalError, setGlobalError] = useGlobalErrorContext();
  return (
    globalError && (
      <Alert
        className="position-fixed start-50 translate-middle global-error"
        severity="error"
        onClose={() => {
          setGlobalError(null);
        }}
      >
        <AlertTitle>Error</AlertTitle>
        {globalError}
      </Alert>
    )
  );
};
