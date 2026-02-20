const palette = {
  background:   "#F4E1C1", // Sand / light neutral
  primary:      "#556B2F", // Olive green (contrast color 1)
  primaryDark:  "#7B3F00", // Brown (contrast color 2)
  primaryLight: "#8F9779", // Moss green
  accent:       "#C19A6B", // Khaki / earthy accent
  neutralWarm:  "#8F9779", // Reuse moss as neutral warm
  secondary:    "#ffffff", // White secondary background
  text:         "#2E2E2E", // Dark charcoal
  textLight:    "#7a7a7a", // Muted gray
  white:        "#ffffff",
  border:       "#7B3F00", // Use contrast brown for borders
  success:      "#28a745", // Standard green success
  warning:      "#ffc107", // Standard yellow warning
  danger:       "#dc3545", // Standard red danger
  info:         "#0dcaf0", // Standard info blue
};

palette.brand = {
  olive: "#556B2F", // Primary olive (contrast)
  brown: "#7B3F00", // Primary dark (contrast)
  sand:  "#F4E1C1", // Background tone
  moss:  "#8F9779",
  khaki: "#C19A6B",
  white: "#ffffff",
};

const colors = { ...palette };

export default colors;
export { palette };
