/**
 * Configuration Data for Smart Locker System
 * 
 * NOTE: This file contains ONLY configuration constants.
 * All user data and locker data is fetched dynamically from the backend API.
 * Backend API Base URL: http://127.0.0.1:8000/api/
 * 
 * This file should NOT be used for actual data storage or retrieval.
 * All data operations must go through the API endpoints.
 */

/**
 * Rental duration options - Configuration constant
 * These values represent standard rental periods in seconds
 */
export const RENTAL_DURATIONS = {
  THIRTY_MINUTES: 1800,  // 30 minutes
  ONE_HOUR: 3600,        // 1 hour
  TWO_HOURS: 7200        // 2 hours
};

/**
 * Rental duration labels for display
 * Maps duration values to human-readable labels
 */
export const RENTAL_DURATION_LABELS = {
  1800: "30 minutes",
  3600: "1 hour",
  7200: "2 hours"
};
