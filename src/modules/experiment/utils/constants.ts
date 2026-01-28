const arrowSize = 120;

export const leftArrowSVG = `
<svg width="${arrowSize}" height="${arrowSize}" viewBox="0 0 24 24">
  <!-- shaft -->
  <line x1="18" y1="12" x2="8" y2="12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round" />
  <!-- head -->
  <path d="M4 12 L8 8 L8 16 Z" fill="currentColor" />
</svg>
`;

export const rightArrowSVG = `
<svg width="${arrowSize}" height="${arrowSize}" viewBox="0 0 24 24">
  <!-- shaft -->
  <line x1="4" y1="12" x2="16" y2="12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round" />
  <!-- head -->
  <path d="M20 12 L16 8 L16 16 Z" fill="currentColor" />
</svg>
`;

export const neutralSVG = `
<svg width="${arrowSize}" height="${arrowSize}" viewBox="0 0 24 24">
  <rect x="4" y="11" width="16" height="2" fill="currentColor"/>
</svg>
`;

/**
 * Timing constants for experiment trials (in milliseconds)
 * These can be adjusted here to change timing across the entire experiment
 */
export const TIMING = {
  FIXATION_DURATION: 500, // Duration to show fixation cross before stimulus
  LATE_RESPONSE_BUFFER: 0, // Time window after stimulus removal to still accept responses
  POST_TRIAL_GAP: 500, // Time between end of trial and next trial starts
  COUNTDOWN_INTERVAL: 1000, // Interval for break countdown timer (1 second)
} as const;
