// ============================================================================
// Phase 1, Part 2: consentManager.ts Setup Script
// ============================================================================
// Generates consentManager.ts with localStorage persistence logic
// ============================================================================

const fs = require('fs');
const path = require('path');

const frontendDir = __dirname;
const utilsDir = path.join(frontendDir, 'src', 'p2p', 'utils');

// Ensure utils directory exists
if (!fs.existsSync(utilsDir)) {
  console.error('✗ ERROR: src/p2p/utils directory does not exist');
  console.error('Please run: npm run setup:p2p:phase1 first');
  process.exit(1);
}

const consentManagerContent = `/**
 * Z-STORE P2P Image Sharing - Consent Manager
 * 
 * Abstraction layer for localStorage persistence of user consent state.
 * Handles safe read/write operations with schema validation, corruption recovery,
 * and compliance audit trails.
 * 
 * DESIGN PRINCIPLE: Never throw. Always provide safe fallbacks.
 */

import { ConsentState } from "./types";
import { P2P_CONSENT_VERSION, P2P_CONSENT_STORAGE_KEY } from "./constants";
import { logConsentUpdate } from "./logger";

/**
 * Default consent state for new users or after corruption/reset
 * 
 * COMPLIANCE REASONING:
 * - p2p_enabled: false = opt-in disabled by default (privacy-first, user safety first)
 * - consentTimestamp: null = no explicit consent recorded yet (clean slate)
 * - consentVersion: null = no consent flow version recorded (no migration needed)
 * 
 * This ensures new users start with P2P disabled and must explicitly opt in.
 */
const DEFAULT_CONSENT_STATE: ConsentState = {
  p2p_enabled: false,
  consentTimestamp: null,
  consentVersion: null,
};

/**
 * Get consent state from localStorage with multi-layer safety
 * 
 * SAFETY GUARANTEES (never throws):
 * 1. If localStorage is unavailable (private browsing, blocked by browser), returns default
 * 2. If consent key doesn't exist (new user), returns default
 * 3. If JSON parse fails (storage corruption), clears corrupted data and returns default
 * 4. If schema validation fails (missing fields, wrong types), clears and returns default
 * 5. Returns deep copy of state (prevents accidental mutations)
 * 
 * @returns Valid ConsentState (guaranteed to match interface)
 */
export const getConsentState = (): ConsentState => {
  try {
    // Layer 1: Check if localStorage API is available
    // (In private browsing mode, some browsers throw on access)
    if (typeof localStorage === "undefined") {
      console.warn(
        "[ConsentManager] localStorage API unavailable (private browsing?), using default consent state"
      );
      return { ...DEFAULT_CONSENT_STATE };
    }

    // Layer 2: Try to read the stored value
    const stored = localStorage.getItem(P2P_CONSENT_STORAGE_KEY);

    // Layer 2a: If key doesn't exist, new user - return default
    if (stored === null) {
      return { ...DEFAULT_CONSENT_STATE };
    }

    // Layer 3: Parse JSON (may fail if storage is corrupted)
    let parsedState: unknown;
    try {
      parsedState = JSON.parse(stored);
    } catch (parseError) {
      // JSON corruption detected - storage entry is malformed
      // Clear it to prevent repeated errors, then return default
      console.warn(
        "[ConsentManager] Corrupted JSON in localStorage detected, clearing and using default consent state"
      );
      try {
        localStorage.removeItem(P2P_CONSENT_STORAGE_KEY);
      } catch {
        // removeItem might fail in some restricted environments, silently ignore
      }
      return { ...DEFAULT_CONSENT_STATE };
    }

    // Layer 4: Validate schema (ensures all required fields exist with correct types)
    const validatedState = validateConsentSchema(parsedState);
    return validatedState;
  } catch (error) {
    // Catch-all for any unexpected errors
    // (storage quota exceeded, blocked by browser extension, etc)
    console.error(
      "[ConsentManager] Unexpected error reading consent state:",
      error instanceof Error ? error.message : String(error)
    );
    return { ...DEFAULT_CONSENT_STATE };
  }
};

/**
 * Set (or update) consent state in localStorage with full audit metadata
 * 
 * FLOW:
 * 1. Constructs new ConsentState with current timestamp (ms precision) and app version
 * 2. Serializes to JSON and writes to localStorage
 * 3. If write succeeds or fails, logs the change (compliance audit trail)
 * 4. Never throws - logs errors and continues
 * 
 * AUDIT TRAIL:
 * - Logs include timestamp of consent change, version of consent flow, enabled status
 * - These logs are ALWAYS output (not subject to VERBOSE_LOGGING)
 * - Enables legal compliance proof of user intent
 * 
 * @param enabled - true to enable P2P swarming, false to disable
 * @returns Promise<void> (async to allow future localStorage alternatives like IndexedDB)
 */
export const setConsentState = async (enabled: boolean): Promise<void> => {
  try {
    // Construct complete ConsentState with metadata
    const newState: ConsentState = {
      p2p_enabled: enabled,
      // Unix timestamp (millisecond precision)
      // Chose ms over ISO-8601 string for accurate audit trail and easier comparisons
      consentTimestamp: Date.now(),
      // Current app consent version - allows future migrations if terms change
      consentVersion: P2P_CONSENT_VERSION,
    };

    // Attempt to write to localStorage
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(
          P2P_CONSENT_STORAGE_KEY,
          JSON.stringify(newState)
        );
      }
    } catch (storageError) {
      // Handle storage errors (quota exceeded is most common)
      if (storageError instanceof Error) {
        if (storageError.name === "QuotaExceededError") {
          console.error(
            "[ConsentManager] localStorage quota exceeded - consent change not persisted. User will be prompted again on next visit."
          );
        } else {
          console.error(
            "[ConsentManager] Storage write error:",
            storageError.message
          );
        }
      }
      // Continue to logging step regardless of storage success
      // (we still want to record that the user intended to change consent)
    }

    // Log the consent change (COMPLIANCE AUDIT TRAIL - always logged)
    // This creates a permanent record in browser console/DevTools
    logConsentUpdate(
      enabled,
      newState.consentTimestamp,
      newState.consentVersion
    );
  } catch (error) {
    console.error(
      "[ConsentManager] Unexpected error setting consent state:",
      error instanceof Error ? error.message : String(error)
    );
  }
};

/**
 * Clear consent state from localStorage
 * 
 * Called when:
 * - User explicitly opts out of P2P
 * - Admin reset is needed
 * 
 * Does NOT throw. Silently handles storage errors.
 */
export const clearConsentState = async (): Promise<void> => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(P2P_CONSENT_STORAGE_KEY);
      console.log("[ConsentManager] Consent state cleared from localStorage");
    }
  } catch (error) {
    console.error(
      "[ConsentManager] Error clearing consent state:",
      error instanceof Error ? error.message : String(error)
    );
  }
};

/**
 * Validate consent state schema and types
 * 
 * STRUCTURAL VALIDATION (defense against corruption):
 * 
 * Check 1: Must be a non-null object (not array, not primitive)
 * ├─ Protects against: "true", "[true]", "null", etc
 * 
 * Check 2: p2p_enabled must be boolean
 * ├─ Protects against: "true" (string), 1 (number), null
 * 
 * Check 3: consentTimestamp must be number or null
 * ├─ Protects against: "1234567890" (string), "2024-01-01" (ISO string)
 * 
 * Check 4: consentVersion must be string or null
 * ├─ Protects against: 1.0 (number), true (boolean)
 * 
 * Check 5: If consentVersion is set, should match current version
 * ├─ Protects against: stale consent (user needs to re-consent if terms change)
 * ├─ Does NOT clear storage on mismatch (context handles re-consent flow)
 * 
 * CORRUPTION RECOVERY:
 * - On any Check 1-4 failure: clear localStorage and return DEFAULT_CONSENT_STATE
 * - On Check 5 failure: keep data but warn (UI will handle re-consent)
 * 
 * @param state - Parsed JSON object from localStorage (untrusted input)
 * @returns Validated ConsentState (guaranteed to match interface)
 */
export const validateConsentSchema = (state: any): ConsentState => {
  // ========================================================================
  // CHECK 1: Type guard - must be a non-null object
  // ========================================================================
  if (state === null || typeof state !== "object" || Array.isArray(state)) {
    const receivedType = Array.isArray(state) ? "array" : typeof state;
    console.warn(
      \`[ConsentManager] Invalid state type (expected object, received \${receivedType}). \` +
      "This indicates localStorage corruption. Clearing and using default."
    );
    clearStorageOnValidationFailure();
    return { ...DEFAULT_CONSENT_STATE };
  }

  // ========================================================================
  // CHECK 2: p2p_enabled field - must exist and be boolean
  // ========================================================================
  if (!("p2p_enabled" in state)) {
    console.warn(
      "[ConsentManager] Missing required field 'p2p_enabled' in consent state. " +
      "Clearing corrupted entry and using default."
    );
    clearStorageOnValidationFailure();
    return { ...DEFAULT_CONSENT_STATE };
  }

  if (typeof state.p2p_enabled !== "boolean") {
    console.warn(
      \`[ConsentManager] Field 'p2p_enabled' has invalid type (expected boolean, got \${typeof state.p2p_enabled}). \` +
      "Clearing corrupted entry and using default."
    );
    clearStorageOnValidationFailure();
    return { ...DEFAULT_CONSENT_STATE };
  }

  // ========================================================================
  // CHECK 3: consentTimestamp field - must be number or null
  // ========================================================================
  if (!("consentTimestamp" in state)) {
    console.warn(
      "[ConsentManager] Missing required field 'consentTimestamp' in consent state. " +
      "Clearing corrupted entry and using default."
    );
    clearStorageOnValidationFailure();
    return { ...DEFAULT_CONSENT_STATE };
  }

  if (
    state.consentTimestamp !== null &&
    typeof state.consentTimestamp !== "number"
  ) {
    console.warn(
      \`[ConsentManager] Field 'consentTimestamp' has invalid type (expected number or null, got \${typeof state.consentTimestamp}). \` +
      "Clearing corrupted entry and using default."
    );
    clearStorageOnValidationFailure();
    return { ...DEFAULT_CONSENT_STATE };
  }

  // Sanity check: if timestamp exists, ensure it's a reasonable value
  if (
    state.consentTimestamp !== null &&
    (typeof state.consentTimestamp !== "number" ||
      state.consentTimestamp < 0 ||
      state.consentTimestamp > Date.now() + 1000 * 60 * 60 * 24 * 365) // Not more than 1 year in future
  ) {
    console.warn(
      "[ConsentManager] Field 'consentTimestamp' contains unreasonable value. " +
      "Clearing corrupted entry and using default."
    );
    clearStorageOnValidationFailure();
    return { ...DEFAULT_CONSENT_STATE };
  }

  // ========================================================================
  // CHECK 4: consentVersion field - must be string or null
  // ========================================================================
  if (!("consentVersion" in state)) {
    console.warn(
      "[ConsentManager] Missing required field 'consentVersion' in consent state. " +
      "Clearing corrupted entry and using default."
    );
    clearStorageOnValidationFailure();
    return { ...DEFAULT_CONSENT_STATE };
  }

  if (
    state.consentVersion !== null &&
    typeof state.consentVersion !== "string"
  ) {
    console.warn(
      \`[ConsentManager] Field 'consentVersion' has invalid type (expected string or null, got \${typeof state.consentVersion}). \` +
      "Clearing corrupted entry and using default."
    );
    clearStorageOnValidationFailure();
    return { ...DEFAULT_CONSENT_STATE };
  }

  // ========================================================================
  // CHECK 5: Version compatibility check (soft validation)
  // ========================================================================
  // If version is set but doesn't match current, user may need to re-consent
  // This is a SOFT check - we don't clear storage, but warn and let UI handle it
  if (
    state.consentVersion !== null &&
    state.consentVersion !== P2P_CONSENT_VERSION
  ) {
    console.warn(
      \`[ConsentManager] Consent version mismatch (stored: "\${state.consentVersion}", current: "\${P2P_CONSENT_VERSION}"). \` +
      "User may need to re-consent on next consent flow update."
    );
    // Return state as-is - context will trigger re-consent flow in UI
  }

  // ========================================================================
  // ALL CHECKS PASSED
  // ========================================================================
  // Return validated state with confidence that all fields are correct types
  return {
    p2p_enabled: state.p2p_enabled,
    consentTimestamp: state.consentTimestamp,
    consentVersion: state.consentVersion,
  };
};

/**
 * Helper: Clear corrupted entry from localStorage
 * 
 * Called when schema validation fails (structural corruption detected)
 * Attempts to remove the corrupted entry so it won't cause repeated errors
 * 
 * Does NOT throw - silently handles errors
 */
const clearStorageOnValidationFailure = (): void => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(P2P_CONSENT_STORAGE_KEY);
      console.log(
        \`[ConsentManager] Cleared corrupted consent entry from localStorage (key: "\${P2P_CONSENT_STORAGE_KEY}")\`
      );
    }
  } catch (error) {
    // Even clearing might fail in restricted environments
    console.error(
      "[ConsentManager] Failed to clear corrupted consent state:",
      error instanceof Error ? error.message : String(error)
    );
  }
};
`;

try {
  fs.writeFileSync(path.join(utilsDir, 'consentManager.ts'), consentManagerContent);
  console.log('✓ Created file: src/p2p/utils/consentManager.ts');
  
  console.log('\n✅ Phase 1, Part 2 complete!');
  console.log('\nGenerated:');
  console.log('- src/p2p/utils/consentManager.ts (localStorage persistence + validation)');
  console.log('\nNext: npm run setup:p2p:phase1:part3 to generate useHardwareCompliance.ts');
  
  process.exit(0);
} catch (err) {
  console.error('✗ Error creating file:', err);
  process.exit(1);
}
