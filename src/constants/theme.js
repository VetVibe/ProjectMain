import { Dimensions } from "react-native";

export const colors = {
  primary: "#6A5ACD",
  secondary: "#DDA0DD",
  gray: "#61677A",
  light_gray: "#E0E0E0",
  lighter_gray: "#f2f2f2",
  error: "#FF6347",
  white: "#fff",
};

const { width, height } = Dimensions.get("window");

export const sizes = {
  // font sizes
  h1: 30,
  h2: 20,
  h3: 18,
  h4: 16,
  body1: 14,
  body2: 12,

  // app dimensions
  width,
  height,
};

const appTheme = { colors, sizes };

// export default appTheme;
