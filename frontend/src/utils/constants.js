export const T = {
  bg: "#07090f",
  surface: "#0e1117",
  card: "#131820",
  border: "#1e2636",
  borderHi: "#2e3d55",
  text: "#e8edf5",
  muted: "#6b7a9a",
  faint: "#1a2233",
  red: "#f0595a", redDim: "#3d1a1a",
  amber: "#e9a23b", amberDim: "#3a2610",
  blue: "#4a8cf7", blueDim: "#0e1f3e",
  green: "#3ecf8e", greenDim: "#0a2e1e",
  teal: "#2dd4bf",
  font: "'IBM Plex Mono', 'Fira Code', monospace",
  sans: "'IBM Plex Sans', system-ui, sans-serif",
};

export const RISK_COLOR = { Critical: T.red, High: T.amber, Medium: T.blue, Low: T.green, Informational: T.teal };
export const RISK_DIM = { Critical: T.redDim, High: T.amberDim, Medium: T.blueDim, Low: T.greenDim, Informational: "#1a2233" };
export const STATUS_COLOR = { completed: T.green, scanning: T.amber, pending: T.muted, failed: T.red };
