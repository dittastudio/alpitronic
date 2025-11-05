/**
 * Sets up and updates an SVG circle progress ring using stroke-dashoffset
 * This is the circle-specific logic - use with progress-bar-large helpers for full functionality
 */
// export const setCircleProgress = (
//   ring: SVGCircleElement | null,
//   percentage: number
// ): void => {
//   if (!ring) return;

//   const radius = parseFloat(ring.getAttribute('r') || '180');
//   const circumference = 2 * Math.PI * radius;
//   const clampedPercentage = Math.max(0, Math.min(100, percentage));
//   const offset = circumference - (clampedPercentage / 100) * circumference;

//   // Initialize dasharray if needed
//   if (!ring.style.strokeDasharray) {
//     ring.style.strokeDasharray = `${circumference} ${circumference}`;
//   }

//   ring.style.strokeDashoffset = `${offset}`;
// };
