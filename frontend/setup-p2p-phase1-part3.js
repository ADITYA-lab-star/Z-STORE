// ============================================================================
// Phase 1, Part 3: useHardwareCompliance Hook Setup Script
// ============================================================================
// Generates useHardwareCompliance.ts with Wi-Fi and battery detection logic
// ============================================================================

const fs = require('fs');
const path = require('path');

const frontendDir = __dirname;
const hooksDir = path.join(frontendDir, 'src', 'p2p', 'hooks');

// Ensure hooks directory exists
if (!fs.existsSync(hooksDir)) {
  console.error('✗ ERROR: src/p2p/hooks directory does not exist');
  console.error('Please run: npm run setup:p2p:phase1 first');
  process.exit(1);
}

const useHardwareComplianceContent = `/**
 * Z-STORE P2P Image Sharing - Hardware Compliance Hook
 * 
 * Custom React hook for detecting device environment compliance:
 * - Wi-Fi connectivity (Network Information API)
 * - Battery health (Battery Status API)
 * 
 * DESIGN PRINCIPLE: Fail-safe. If APIs unsupported, treat as non-compliant.
 * This ensures P2P only runs on devices with proven hardware capabilities.
 * 
 * COMPLIANCE REASONING:
 * - Wi-Fi check: Protects user data caps (cellular networks)
 * - Battery check: Protects device battery from WebRTC peer drain
 * 
 * If either API is unavailable → P2P disabled entirely (Option A fail-safe)
 */

import { useEffect, useState, useCallback } from "react";
import { HardwareCheckResult } from "../utils/types";
import {
  BATTERY_THRESHOLD,
  ALLOWED_CONNECTION_TYPES,
} from "../utils/constants";
import { logHardwareCheck, logP2PEvent, logP2PError } from "../utils/logger";

/**
 * useHardwareCompliance - React hook for device environment detection
 * 
 * RUNTIME BEHAVIOR:
 * 1. On mount: Runs initial Wi-Fi and battery checks synchronously
 * 2. During render: Sets state with results
 * 3. During effect: Registers event listeners for real-time updates
 * 4. On unmount: Cleans up listeners
 * 
 * @returns HardwareCheckResult {
 *   isWiFi: boolean,           // true if connected to wifi/4g
 *   isBattery: boolean,        // true if battery >= 80% or charging
 *   isCompliant: boolean,      // true only if BOTH checks pass
 *   error: string | null       // null if all checks passed
 * }
 */
export const useHardwareCompliance = (): HardwareCheckResult => {
  // Initial state (worst case - not compliant)
  const [hardwareState, setHardwareState] = useState<HardwareCheckResult>({
    isWiFi: false,
    isBattery: false,
    isCompliant: false,
    error: null,
  });

  /**
   * Check Wi-Fi connectivity via Network Information API
   * 
   * STEP 1: Detect API availability
   * ├─ If navigator.connection undefined → return false + error
   * ├─ (Covers: Firefox, desktop Safari, older browsers)
   * 
   * STEP 2: Get effective connection type
   * ├─ Valid types: "4g", "wifi"
   * ├─ Invalid (cellular): "2g", "3g", "slow-2g"
   * ├─ Unknown: "unknown" (we allow this as it might be LTE)
   * 
   * @returns { isWiFi: boolean, error: string | null }
   */
  const checkNetworkCompliance = useCallback((): {
    isWiFi: boolean;
    error: string | null;
  } => {
    try {
      // Step 1: Check API availability
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;

      if (!connection) {
        const error = "Network Information API not supported";
        logP2PEvent("NETWORK_CHECK_FAILED", { reason: error }, true);
        return { isWiFi: false, error };
      }

      // Step 2: Get effective connection type
      const effectiveType: string = connection.effectiveType;

      // Check if this type is in our allowed list
      const isAllowed = ALLOWED_CONNECTION_TYPES.includes(effectiveType);

      logP2PEvent("NETWORK_CHECK_COMPLETE", {
        effectiveType,
        isAllowed,
        allowedTypes: Array.from(ALLOWED_CONNECTION_TYPES),
      }, true);

      return { isWiFi: isAllowed, error: null };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : String(error);
      logP2PError("NETWORK_CHECK_ERROR", error);
      return { isWiFi: false, error: errorMsg };
    }
  }, []);

  /**
   * Check battery health via Battery Status API
   * 
   * STEP 1: Detect API availability
   * ├─ Modern: navigator.getBattery() returns Promise<BatteryManager>
   * ├─ Deprecated but still used: navigator.battery (synchronous)
   * 
   * STEP 2: Get battery level and charging status
   * ├─ If charging: return true (unlimited power available)
   * ├─ If level >= 80%: return true (sufficient reserve)
   * ├─ Otherwise: return false (insufficient battery)
   * 
   * STEP 3: Handle unsupported case
   * ├─ If API unavailable → return false + error (fail-safe)
   * 
   * @returns Promise<{ isBattery: boolean, error: string | null }>
   */
  const checkBatteryCompliance = useCallback(
    async (): Promise<{
      isBattery: boolean;
      error: string | null;
    }> => {
      try {
        // Step 1: Check if getBattery API exists (modern)
        const getBattery = (navigator as any).getBattery;

        if (!getBattery) {
          const error = "Battery Status API not supported";
          logP2PEvent("BATTERY_CHECK_FAILED", { reason: error }, true);
          return { isBattery: false, error };
        }

        // Step 2: Await battery manager promise
        // This might fail on some browsers even if API exists
        let batteryManager: any;
        try {
          batteryManager = await getBattery.call(navigator);
        } catch (promiseError) {
          const errorMsg =
            promiseError instanceof Error
              ? promiseError.message
              : String(promiseError);
          logP2PError("BATTERY_API_PROMISE_REJECTED", promiseError);
          return { isBattery: false, error: errorMsg };
        }

        if (!batteryManager) {
          return { isBattery: false, error: "BatteryManager is null" };
        }

        // Step 3: Check charging status and level
        const isCharging = batteryManager.charging;
        const level = batteryManager.level; // Range: 0.0 to 1.0

        // Compliance criteria:
        // - If charging: true (plugged in, no battery drain concern)
        // - If level > 80%: true (sufficient reserve for P2P drain)
        // - Otherwise: false
        const isBatteryHealthy =
          isCharging || level > BATTERY_THRESHOLD;

        logP2PEvent("BATTERY_CHECK_COMPLETE", {
          isCharging,
          level: \`\${(level * 100).toFixed(1)}%\`,
          threshold: \`\${(BATTERY_THRESHOLD * 100).toFixed(0)}%\`,
          isBatteryHealthy,
        }, true);

        return { isBattery: isBatteryHealthy, error: null };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : String(error);
        logP2PError("BATTERY_CHECK_ERROR", error);
        return { isBattery: false, error: errorMsg };
      }
    },
    []
  );

  /**
   * Run both checks and update state
   * 
   * EXECUTION ORDER:
   * 1. Check network (synchronous, fast)
   * 2. Check battery (async, resolves promise)
   * 3. Compute compliance flag: true only if BOTH pass
   * 4. Log final compliance state (audit trail)
   * 5. Update React state
   */
  const runHardwareChecks = useCallback(async () => {
    try {
      // Step 1: Network check (synchronous)
      const { isWiFi, error: networkError } = checkNetworkCompliance();

      // Step 2: Battery check (asynchronous)
      const { isBattery, error: batteryError } =
        await checkBatteryCompliance();

      // Step 3: Compute overall compliance
      // BOTH must pass for P2P to be enabled
      const isCompliant = isWiFi && isBattery;

      // Step 4: Determine error to report (prefer first error found)
      const error = networkError || batteryError;

      // Step 5: Log compliance state (IMPORTANT audit trail)
      logHardwareCheck(isWiFi, isBattery, isCompliant, error || undefined);

      // Step 6: Update React state
      setHardwareState({
        isWiFi,
        isBattery,
        isCompliant,
        error,
      });
    } catch (error) {
      console.error(
        "[useHardwareCompliance] Unexpected error during hardware checks:",
        error instanceof Error ? error.message : String(error)
      );
      // On unexpected error, fail safe - disable P2P
      setHardwareState({
        isWiFi: false,
        isBattery: false,
        isCompliant: false,
        error: "Unexpected error during hardware compliance checks",
      });
    }
  }, [checkNetworkCompliance, checkBatteryCompliance]);

  /**
   * useEffect: Initialize hardware checks and register real-time listeners
   * 
   * MOUNT PHASE:
   * 1. Run initial hardware checks
   * 2. Register network change listener
   * 3. (Battery listener added if needed in future)
   * 
   * CLEANUP PHASE:
   * 1. Unregister network change listener
   * 2. Prevents memory leaks on unmount
   */
  useEffect(() => {
    // Run initial checks immediately
    runHardwareChecks();

    // Register listener for network changes (4G → WiFi, etc)
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      const handleNetworkChange = () => {
        logP2PEvent("NETWORK_CHANGED", {}, true);
        // Rerun both checks when network status changes
        runHardwareChecks();
      };

      connection.addEventListener("change", handleNetworkChange);

      return () => {
        // Cleanup: Remove listener on unmount
        connection.removeEventListener("change", handleNetworkChange);
      };
    }
  }, [runHardwareChecks]);

  return hardwareState;
};

/**
 * COMPLIANCE STATE EXAMPLES:
 * 
 * Example 1: New smartphone on Wi-Fi, battery 85%
 * ├─ isWiFi: true
 * ├─ isBattery: true
 * ├─ isCompliant: ✓ true → P2P ENABLED
 * └─ error: null
 * 
 * Example 2: Desktop with Battery API unsupported
 * ├─ isWiFi: true (connected via Ethernet or WiFi)
 * ├─ isBattery: false (API not available)
 * ├─ isCompliant: ✗ false → P2P DISABLED (fail-safe)
 * └─ error: "Battery Status API not supported"
 * 
 * Example 3: Smartphone on cellular network
 * ├─ isWiFi: false (effectiveType = "3g")
 * ├─ isBattery: true (battery 90%)
 * ├─ isCompliant: ✗ false → P2P DISABLED (protect data cap)
 * └─ error: null
 * 
 * Example 4: Low battery, not charging
 * ├─ isWiFi: true
 * ├─ isBattery: false (battery 50%, not charging)
 * ├─ isCompliant: ✗ false → P2P DISABLED (protect battery)
 * └─ error: null
 * 
 * Example 5: Firefox (no Network Info API)
 * ├─ isWiFi: false (API not available)
 * ├─ isBattery: true (if battery check passes)
 * ├─ isCompliant: ✗ false → P2P DISABLED (fail-safe)
 * └─ error: "Network Information API not supported"
 */
`;

try {
  fs.writeFileSync(
    path.join(hooksDir, 'useHardwareCompliance.ts'),
    useHardwareComplianceContent
  );
  console.log('✓ Created file: src/p2p/hooks/useHardwareCompliance.ts');
  
  console.log('\n✅ Phase 1, Part 3 complete!');
  console.log('\nGenerated:');
  console.log('- src/p2p/hooks/useHardwareCompliance.ts (Wi-Fi + battery detection)');
  console.log('\nNext: npm run setup:p2p:phase1:part4 to generate CommunityCDNAuth context');
  
  process.exit(0);
} catch (err) {
  console.error('✗ Error creating file:', err);
  process.exit(1);
}
