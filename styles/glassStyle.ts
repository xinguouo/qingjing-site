export const glassStyle = {
  card: "glass-card",
  cardHover: "glass-card-hover",
  panel: "glass-panel",
  button: "glass-button",
  control: "glass-control",
  overlay: "glass-overlay",
  imageFrame: "glass-image-frame",
  mediaCard: "glass-media-card",
  banner: "glass-banner",
  bannerRefraction: "glass-banner-refraction",
} as const;

export const glassTokens = {
  light: {
    cardBackground: "rgba(255, 255, 255, 0.65)",
    cardBorder: "rgba(255, 255, 255, 0.8)",
    blur: "12px",
    shadow:
      "0 18px 44px rgba(22, 22, 22, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.88), inset 0 -1px 0 rgba(255, 255, 255, 0.38)",
  },
  dark: {
    cardBackground: "rgba(24, 24, 24, 0.58)",
    cardBorder: "rgba(255, 255, 255, 0.12)",
    blur: "12px",
    shadow:
      "0 18px 46px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
  },
} as const;

export type GlassStyle = typeof glassStyle;
export type GlassTokens = typeof glassTokens;
