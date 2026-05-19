// ============================================================================
// Phase 1 Foundation Files Setup - Creates p2p module structure
// ============================================================================
// This file, when run with `node setup-p2p-phase1.js` from the frontend/
// directory, will create the complete Phase 1 directory structure and files
// ============================================================================

const fs = require('fs');
const path = require('path');

// Absolute paths
const frontendDir = __dirname;
const p2pDir = path.join(frontendDir, 'src', 'p2p');
const utilsDir = path.join(p2pDir, 'utils');
const hooksDir = path.join(p2pDir, 'hooks');
const contextDir = path.join(p2pDir, 'context');

// Helper to create directory if not exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${path.relative(frontendDir, dir)}`);
  }
}

// Create all directories
ensureDir(utilsDir);
ensureDir(hooksDir);
ensureDir(contextDir);

// File: types.ts
const typesContent = `/**
 * Z-STORE P2P Image Sharing - TypeScript Type Definitions
 * 
 * This module defines all core types for the CommunityCDN consent management,
 * hardware compliance tracking, and reward system. These types enforce strict
 * typing across the P2P module and ensure compliance metadata is never lost.
 */

/**
 * ConsentState - User's explicit opt-in preference with full audit metadata
 * 
 * COMPLIANCE REASONING:
 * - p2p_enabled: User's explicit choice (true = opted in, false = opted out)
 * - consentTimestamp: Unix timestamp when user made this choice (audit trail for GDPR)
 * - consentVersion: Version of consent flow (allows migration if consent terms change)
 * 
 * This structure is persisted to localStorage and enables legal compliance
 * by proving we captured explicit user consent at a specific time.
 */
export interface ConsentState {
  p2p_enabled: boolean;
  consentTimestamp: number | null; // Unix timestamp (ms). null = user never consented
  consentVersion: string | null; // e.g., "1.0.0". null = user never consented
}

/**
 * HardwareCapabilities - Device environment compliance checks
 * 
 * COMPLIANCE REASONING:
 * - isWiFiConnected: Only enable P2P on Wi-Fi (not cellular) to protect user data caps
 * - isBatteryHealthy: Only enable P2P when device battery >= 80% or charging
 *   (protects battery drain from WebRTC peer connections)
 * - isCompliant: Computed flag = isWiFiConnected AND isBatteryHealthy
 *   (P2P ONLY runs if BOTH checks pass)
 * - hardwareCheckError: Captures reason if checks failed (e.g., "Battery API unsupported")
 *   (audit trail for debugging or compliance reporting)
 */
export interface HardwareCapabilities {
  isWiFiConnected: boolean;
  isBatteryHealthy: boolean;
  isCompliant: boolean; // true only if BOTH Wi-Fi AND battery checks pass
  hardwareCheckError: string | null; // null if all checks passed, error message otherwise
}

/**
 * RewardState - P2P contribution tracking for incentive system
 * 
 * PURPOSE:
 * - sessionBytesServed: Bytes served to peers during this session (not persisted)
 * - pendingRewardPoints: Cumulative reward points earned (synced to backend later)
 * 
 * This lays groundwork for rewarding users who contribute bandwidth to the P2P swarm,
 * creating economic incentive for voluntary participation.
 */
export interface RewardState {
  sessionBytesServed: number; // Reset to 0 on session start
  pendingRewardPoints: number; // Persisted and synced to backend in future phases
}

/**
 * CommunityCDNAuthState - Complete context state shape
 * 
 * This is the master state tree for the CommunityCDNAuth React context.
 * It combines consent preferences, hardware compliance, rewards tracking,
 * and UI loading/error states into a single immutable record.
 */
export interface CommunityCDNAuthState {
  // User's opt-in preference and audit metadata
  consent: ConsentState;

  // Device environment compliance checks (read-only after initialization)
  hardware: HardwareCapabilities;

  // P2P contribution rewards tracking
  rewards: RewardState;

  // UI state
  isLoading: boolean; // true during initial hardware checks
  error: string | null; // captures any initialization or state mutation errors
}

/**
 * CommunityCDNAuthActions - Action dispatch interface
 * 
 * These are the only methods consumers should call to mutate context state.
 * All actions are async to allow for localStorage I/O and side effects.
 */
export interface CommunityCDNAuthActions {
  /**
   * Enable P2P and persist consent with audit metadata
   * 
   * - Writes consentTimestamp (current time) to localStorage
   * - Sets consentVersion to current app version
   * - Hardware compliance checks run independently (async)
   */
  setConsentEnabled(): Promise<void>;

  /**
   * Disable P2P and clear rewards
   * 
   * - Persists p2p_enabled = false to localStorage
   * - Resets sessionBytesServed and pendingRewardPoints to 0
   */
  setConsentDisabled(): Promise<void>;

  /**
   * Update hardware compliance status after checks complete
   * 
   * @param isWiFi - Result of Wi-Fi connectivity check
   * @param isBattery - Result of battery health check
   * @param error - Optional error message if either check failed/unsupported
   */
  updateHardwareStatus(isWiFi: boolean, isBattery: boolean, error?: string): void;

  /**
   * Increment bytes served counter (session-scoped, not persisted)
   * 
   * Called when a peer successfully transfers image chunks to this device.
   * Feeds into reward calculation later.
   */
  addBytesServed(bytes: number): void;

  /**
   * Increment pending reward points
   * 
   * Called when calculating reward for bytes served.
   * These points accumulate and are synced to MongoDB backend in Phase 3+
   */
  addRewardPoints(points: number): void;

  /**
   * Reset session reward counters
   * 
   * Preserves consent preference but clears sessionBytesServed
   * (called on logout or session end)
   */
  resetSession(): void;
}

/**
 * CommunityCDNAuthContextType - Complete context API
 * 
 * Consumers access context via:
 * const { state, actions } = useContext(CommunityCDNAuthContext)
 */
export interface CommunityCDNAuthContextType {
  state: CommunityCDNAuthState;
  actions: CommunityCDNAuthActions;
}

/**
 * Hardware Check Result - Return type from useHardwareCompliance hook
 * 
 * This is what the hardware detection hook returns before
 * being absorbed into the context state.
 */
export interface HardwareCheckResult {
  isWiFi: boolean;
  isBattery: boolean;
  isCompliant: boolean; // true only if both checks pass
  error: string | null;
}
`;

// File: constants.ts
const constantsContent = `/**
 * Z-STORE P2P Image Sharing - Global Constants
 * 
 * Centralized constants for version management, timeouts, storage keys,
 * and performance thresholds. These values are referenced across all P2P modules
 * and should only be changed via coordinated version releases.
 */

/**
 * CONSENT & VERSIONING
 */

/** 
 * Current version of the consent flow.
 * Increment when consent terms change or new compliance requirements are introduced.
 * This allows future migrations if we need users to re-consent.
 */
export const P2P_CONSENT_VERSION = "1.0.0";

/**
 * localStorage key for persisting user consent state.
 * Scoped with "z_store_" prefix to avoid collision with other localStorage data.
 */
export const P2P_CONSENT_STORAGE_KEY = "z_store_p2p_consent";

/**
 * PERFORMANCE & TIMEOUT THRESHOLDS
 */

/**
 * Race condition timeout for P2P fetch vs server fallback (Phase 3).
 * If peer transfer doesn't complete within this time, we immediately
 * fall back to standard HTTP server fetch to ensure user experience never suffers.
 */
export const P2P_TIMEOUT_MS = 1000; // 1 second

/**
 * Maximum chunk size for binary data transfer over WebRTC data channels (Phase 4).
 * Smaller chunks reduce memory pressure and improve reliability.
 * 64KB is a safe default for most browser buffer limits.
 */
export const CHUNK_SIZE_BYTES = 65536; // 64 KB

/**
 * HARDWARE COMPLIANCE THRESHOLDS
 */

/**
 * Minimum battery level required for P2P swarming.
 * 0.8 = 80% (matches requirement from briefing).
 * WebRTC peer connections consume 10-15% battery under sustained use,
 * so we only enable P2P when device has sufficient reserve.
 */
export const BATTERY_THRESHOLD = 0.8; // 80%

/**
 * Effective connection types that qualify as "Wi-Fi" for P2P.
 * We exclude 'slow-2g', '2g', '3g' (cellular) to protect user data caps.
 * Only '4g' and 'wifi' are allowed.
 * 
 * See: https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType
 */
export const ALLOWED_CONNECTION_TYPES = ["4g", "wifi"] as const;

/**
 * LOGGING & DEBUGGING
 */

/**
 * Prefix for all P2P-related console logs.
 * Makes it easy to filter logs: grep "[Z-STORE P2P]" in DevTools console.
 */
export const LOG_PREFIX = "[Z-STORE P2P]";

/**
 * Enable verbose logging for P2P events (set via environment or runtime config).
 * In production, this should be false to reduce console noise.
 * In development, set to true for debugging.
 */
export const VERBOSE_LOGGING = process.env.REACT_APP_P2P_VERBOSE_LOGGING === "true";

/**
 * FEATURE FLAGS (for future use)
 */

/**
 * Global kill switch to disable P2P entirely without code changes.
 * Set via environment variable: REACT_APP_P2P_ENABLED=false
 */
export const P2P_FEATURE_ENABLED = process.env.REACT_APP_P2P_ENABLED !== "false";
`;

// File: logger.ts
const loggerContent = `/**
 * Z-STORE P2P Image Sharing - Logging Utility
 * 
 * Structured logging for P2P events. All logs include timestamps and are
 * prefixed with [Z-STORE P2P] for easy filtering in browser DevTools.
 * 
 * These logs serve two purposes:
 * 1. Developer debugging during development/QA
 * 2. Compliance audit trails (e.g., when consent changed, hardware checks failed)
 */

import { LOG_PREFIX, VERBOSE_LOGGING } from "./constants";

/**
 * Helper: Format timestamp for log output
 */
const getTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Helper: Conditionally log based on VERBOSE_LOGGING flag
 */
const shouldLog = (isVerbose: boolean): boolean => {
  if (isVerbose) {
    return VERBOSE_LOGGING;
  }
  // Always log non-verbose events (important compliance events)
  return true;
};

/**
 * Log consent state changes (IMPORTANT for compliance audit trails)
 * 
 * Called when user enables/disables P2P swarming.
 * These logs are ALWAYS output (not subject to VERBOSE_LOGGING flag).
 * 
 * @param enabled - true if user opted in, false if opted out
 * @param timestamp - Unix timestamp (ms) of when consent was recorded
 * @param consentVersion - Version of consent flow (e.g., "1.0.0")
 */
export const logConsentUpdate = (
  enabled: boolean,
  timestamp: number | null,
  consentVersion: string | null
): void => {
  const action = enabled ? "ENABLED" : "DISABLED";
  const timestampStr = timestamp ? new Date(timestamp).toISOString() : "N/A";

  console.log(
    \`\${LOG_PREFIX} [COMPLIANCE] P2P \${action} at \${getTimestamp()}\`,
    {
      consentValue: enabled,
      recordedAt: timestampStr,
      consentVersion,
    }
  );
};

/**
 * Log hardware compliance check results (IMPORTANT for compliance audit trails)
 * 
 * Called after Wi-Fi and battery checks complete.
 * These logs are ALWAYS output (audit trail for why P2P was enabled/disabled).
 * 
 * @param isWiFiConnected - Result of Wi-Fi check
 * @param isBatteryHealthy - Result of battery check
 * @param isCompliant - Combined result (true only if both checks pass)
 * @param error - Optional error message if a check failed
 */
export const logHardwareCheck = (
  isWiFiConnected: boolean,
  isBatteryHealthy: boolean,
  isCompliant: boolean,
  error?: string
): void => {
  const complianceStatus = isCompliant ? "✓ COMPLIANT" : "✗ NON-COMPLIANT";

  console.log(
    \`\${LOG_PREFIX} [COMPLIANCE] Hardware check at \${getTimestamp()} - \${complianceStatus}\`,
    {
      isWiFiConnected,
      isBatteryHealthy,
      error: error || null,
    }
  );
};

/**
 * Log general P2P events (subject to VERBOSE_LOGGING flag)
 * 
 * Used for:
 * - Peer connection lifecycle (connect, disconnect, error)
 * - Data channel events
 * - Image transfer attempts and outcomes
 * - Reward tracking updates
 * 
 * @param event - Name of the event (e.g., "PEER_CONNECTED", "IMAGE_TRANSFER_START")
 * @param metadata - Optional object with additional context
 * @param isVerbose - If true, only logs when VERBOSE_LOGGING is enabled
 */
export const logP2PEvent = (
  event: string,
  metadata?: Record<string, any>,
  isVerbose: boolean = false
): void => {
  if (!shouldLog(isVerbose)) {
    return;
  }

  console.log(
    \`\${LOG_PREFIX} [EVENT] \${event} at \${getTimestamp()}\`,
    metadata ? { ...metadata } : {}
  );
};

/**
 * Log P2P errors and recovery actions (ALWAYS logged for debugging)
 * 
 * Used when:
 * - Peer connection fails
 * - Data transfer timeout
 * - Integrity check (SHA-256) fails
 * - Fallback to server fetch triggered
 * 
 * @param event - Name of the error event
 * @param error - Error object or message
 * @param metadata - Optional context (e.g., which peer, which image)
 */
export const logP2PError = (
  event: string,
  error: Error | string,
  metadata?: Record<string, any>
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(
    \`\${LOG_PREFIX} [ERROR] \${event} at \${getTimestamp()}\`,
    {
      message: errorMessage,
      stack: errorStack,
      ...metadata,
    }
  );
};

/**
 * Log reward state changes (verbose event, subject to VERBOSE_LOGGING)
 * 
 * Called when:
 * - User serves bytes to peers
 * - Reward points are calculated
 * - Session rewards are reset
 * 
 * @param action - What changed (e.g., "BYTES_SERVED", "REWARD_POINTS_ADDED")
 * @param bytesServed - Current sessionBytesServed total
 * @param rewardPoints - Current pendingRewardPoints total
 */
export const logRewardUpdate = (
  action: string,
  bytesServed: number,
  rewardPoints: number
): void => {
  logP2PEvent(action, { bytesServed, rewardPoints }, true);
};
`;

// Write all files
try {
  fs.writeFileSync(path.join(utilsDir, 'types.ts'), typesContent);
  console.log(`✓ Created file: src/p2p/utils/types.ts`);
  
  fs.writeFileSync(path.join(utilsDir, 'constants.ts'), constantsContent);
  console.log(`✓ Created file: src/p2p/utils/constants.ts`);
  
  fs.writeFileSync(path.join(utilsDir, 'logger.ts'), loggerContent);
  console.log(`✓ Created file: src/p2p/utils/logger.ts`);

  // Create .gitkeep files for empty directories
  fs.writeFileSync(path.join(hooksDir, '.gitkeep'), '');
  console.log(`✓ Created placeholder: src/p2p/hooks/.gitkeep`);
  
  fs.writeFileSync(path.join(contextDir, '.gitkeep'), '');
  console.log(`✓ Created placeholder: src/p2p/context/.gitkeep`);

  console.log('\n✅ Phase 1 foundation files created successfully!');
  console.log('\nNext steps:');
  console.log('1. Review the generated files in src/p2p/utils/');
  console.log('2. Run: npm run setup:p2p:phase1:part2 to generate consentManager.ts');
  
  process.exit(0);
} catch (err) {
  console.error('✗ Error creating files:', err);
  process.exit(1);
}
`;

fs.writeFileSync(path.join(frontendDir, 'setup-p2p-phase1.js'), content);
console.log('✓ Setup script created at frontend/setup-p2p-phase1.js');
console.log('\nRun with: cd frontend && node setup-p2p-phase1.js');
