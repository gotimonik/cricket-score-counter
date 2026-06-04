import { Box, CircularProgress } from "@mui/material";

const LoadingOverlay: React.FC<{ isLoading: boolean }> = ({ isLoading }) =>
  isLoading ? (
    <Box
      className="app-score-shell"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(255,255,255,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={64} thickness={5} color="primary" />
    </Box>
  ) : null;

export default LoadingOverlay;