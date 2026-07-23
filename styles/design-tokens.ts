export const designTokens = {
  color: {
    background: "#FFFFFF",
    textPrimary: "#222222",
    textSecondary: "#666666",
    border: "#E8E8E8",
    mutedBackground: "#F7F7F7",
    darkBackground: "#070707",
    darkTextPrimary: "#ECE9E4",
    darkTextSecondary: "#C7C2BA",
    darkBorder: "rgba(255, 255, 255, 0.1)",
  },
  radius: {
    small: "8px",
    medium: "16px",
    large: "24px",
  },
  shadow: {
    soft: "0 14px 34px rgba(0, 0, 0, 0.055)",
    glass:
      "0 10px 28px rgba(0, 0, 0, 0.055), inset 0 1px 0 rgba(255, 255, 255, 0.75)",
    darkGlass:
      "0 18px 46px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  },
  glass: {
    cardBackground: "rgba(255, 255, 255, 0.65)",
    cardBorder: "rgba(255, 255, 255, 0.8)",
    blur: "12px",
    textureOpacity: "0.05-0.1",
  },
  typography: {
    pageTitle: {
      desktop: "clamp(48px, 4.2vw, 56px)",
      mobile: "clamp(34px, 10vw, 44px)",
      lineHeight: "1.12",
    },
    pageEyebrow: {
      desktop: "14px",
      mobile: "12px",
      letterSpacing: "0.25em",
      lineHeight: "1.2",
    },
    sectionTitle: {
      desktop: "clamp(32px, 2.8vw, 36px)",
      mobile: "28px",
      lineHeight: "1.18",
    },
    body: {
      desktop: "17px",
      mobile: "16px",
      lineHeight: "1.8",
    },
    auxiliary: {
      desktop: "15px",
      mobile: "14px",
      lineHeight: "1.7",
    },
  },
  layout: {
    sidebarWidth: "220px",
    contentMaxWidth: "1280px",
    contentPaddingDesktop: "64px",
    contentPaddingTablet: "32px",
    contentPaddingMobile: "20px",
    cardGap: "24px",
  },
  imageRatio: {
    artwork: "auto",
    coursePoster: "3 / 4",
    product: "3 / 4",
  },
  grid: {
    desktopCards: 3,
    mobileCards: 1,
  },
} as const;

export type DesignTokens = typeof designTokens;
