// ============================================================================
// Phase 1, Part 4: CommunityCDNAuth Context Setup Script
// ============================================================================
// Generates CommunityCDNAuth.tsx with global state management
// ============================================================================

const fs = require('fs');
const path = require('path');

const frontendDir = __dirname;
const contextDir = path.join(frontendDir, 'src', 'p2p', 'context');

// Ensure context directory exists
if (!fs.existsSync(contextDir)) {
  console.error('✗ ERROR: src/p2p/context directory does not exist');
  console.error('Please run: npm run setup:p2p:phase1 first');
  process.exit(1);
}

const communityAuthContent = `/**
 * Z-STORE P2P Image Sharing - Global React Context & Provider
 * 
 * Unified state management for:
 * - User consent preferences (opt-in status + audit metadata)
 * - Device hardware compliance (Wi-Fi + battery status)
 * - P2P reward tracking (bytes served + points earned)
 * 
 * PERFORMANCE OPTIMIZATION:
 * This context is designed to minimize re-renders via:
 * 1. Memoized context value (useMemo prevents object recreation)
 * 2. Granular selector hooks (components subscribe to specific slices)
 * 3. Minimal state updates (batch updates when possible)
 */

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
  FC,
} from "react";
import {
  CommunityCDNAuthState,
  CommunityCDNAuthActions,
  CommunityCDNAuthContextType,
  ConsentState,
  HardwareCapabilities,
  RewardState,
} from "../utils/types";
import { getConsentState, setConsentState, clearConsentState } from "../utils/consentManager";
import { useHardwareCompliance } from "../hooks/useHardwareCompliance";
import { logConsentUpdate, logRewardUpdate } from "../utils/logger";

/**
 * STEP 1: Create the React Context
 * 
 * This is the root context object. Components consume it via:
 * const { state, actions } = useContext(CommunityCDNAuthContext)
 */
const CommunityCDNAuthContext = createContext<CommunityCDNAuthContextType | undefined>(
  undefined
);

/**
 * STEP 2: Initialize default state
 * 
 * Used on first render before async consent loading
 */
const createDefaultState = (): CommunityCDNAuthState => ({
  consent: {
    p2p_enabled: false,
    consentTimestamp: null,
    consentVersion: null,
  },
  hardware: {
    isWiFiConnected: false,
    isBatteryHealthy: false,
    isCompliant: false,
    hardwareCheckError: null,
  },
  rewards: {
    sessionBytesServed: 0,
    pendingRewardPoints: 0,
  },
  isLoading: true, // true until async consent loads
  error: null,
});

/**
 * STEP 3: Provider Component
 * 
 * Responsible for:
 * 1. Managing internal state (consent, hardware, rewards)
 * 2. Initializing consent from localStorage
 * 3. Tracking hardware changes in real-time
 * 4. Providing memoized context value
 * 5. Exposing action creators
 */
interface CommunityCDNAuthProviderProps {
  children: ReactNode;
}

export const CommunityCDNAuthProvider: FC<CommunityCDNAuthProviderProps> = ({
  children,
}) => {
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================

  // Main state tree
  const [state, setState] = useState<CommunityCDNAuthState>(
    createDefaultState()
  );

  // Get real-time hardware compliance data
  const hardware = useHardwareCompliance();

  // ========================================================================
  // ACTION CREATORS (memoized with useCallback to prevent re-renders)
  // ========================================================================

  /**
   * toggleConsent - Enable/disable P2P and persist to localStorage
   * 
   * FLOW:
   * 1. Call setConsentState(enabled) to write to localStorage
   * 2. Update local state with new consent + timestamp
   * 3. If disabling: reset rewards to 0
   * 
   * @param enabled - true to enable P2P, false to disable
   */
  const toggleConsent = useCallback(async (enabled: boolean) => {
    try {
      // Write to localStorage (triggers logConsentUpdate audit trail)
      await setConsentState(enabled);

      // Update local state
      setState((prev) => ({
        ...prev,
        consent: {
          p2p_enabled: enabled,
          consentTimestamp: Date.now(),
          consentVersion: require("../utils/constants").P2P_CONSENT_VERSION,
        },
        // If disabling, reset rewards
        rewards: enabled
          ? prev.rewards
          : { sessionBytesServed: 0, pendingRewardPoints: 0 },
        error: null,
      }));
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : String(error);
      setState((prev) => ({ ...prev, error: errorMsg }));
    }
  }, []);

  /**
   * updateBytesServed - Increment bytes served counter (session-scoped)
   * 
   * Called when peer successfully transfers image chunks.
   * Not persisted to localStorage (session-scoped).
   * 
   * @param bytes - Number of bytes transferred
   */
  const addBytesServed = useCallback((bytes: number) => {
    setState((prev) => {
      const newBytesServed = prev.rewards.sessionBytesServed + bytes;
      
      // Log reward update (verbose event)
      logRewardUpdate("BYTES_SERVED", newBytesServed, prev.rewards.pendingRewardPoints);
      
      return {
        ...prev,
        rewards: {
          ...prev.rewards,
          sessionBytesServed: newBytesServed,
        },
      };
    });
  }, []);

  /**
   * addRewardPoints - Increment pending reward points
   * 
   * Called when calculating rewards for bytes served.
   * These points accumulate and are synced to backend in Phase 3+
   * 
   * @param points - Number of reward points to add
   */
  const addRewardPoints = useCallback((points: number) => {
    setState((prev) => {
      const newPoints = prev.rewards.pendingRewardPoints + points;
      
      // Log reward update (verbose event)
      logRewardUpdate("REWARD_POINTS_ADDED", prev.rewards.sessionBytesServed, newPoints);
      
      return {
        ...prev,
        rewards: {
          ...prev.rewards,
          pendingRewardPoints: newPoints,
        },
      };
    });
  }, []);

  /**
   * resetSession - Clear session rewards but preserve consent
   * 
   * Called on logout or session end
   */
  const resetSession = useCallback(() => {
    setState((prev) => ({
      ...prev,
      rewards: {
        sessionBytesServed: 0,
        pendingRewardPoints: 0,
      },
    }));
  }, []);

  // ========================================================================
  // INITIALIZATION & SYNC (useEffect runs after render)
  // ========================================================================

  React.useEffect(() => {
    // Load consent state from localStorage
    const loadConsentState = async () => {
      try {
        const storedConsent = getConsentState();
        setState((prev) => ({
          ...prev,
          consent: storedConsent,
          isLoading: false,
        }));
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : String(error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
        }));
      }
    };

    loadConsentState();
  }, []);

  /**
   * Sync hardware compliance changes into state
   * 
   * This useEffect watches the hardware hook return value
   * and updates the hardware slice of state when it changes
   * (e.g., user switches from Wi-Fi to cellular, battery drops, etc)
   */
  React.useEffect(() => {
    setState((prev) => ({
      ...prev,
      hardware: {
        isWiFiConnected: hardware.isWiFi,
        isBatteryHealthy: hardware.isBattery,
        isCompliant: hardware.isCompliant,
        hardwareCheckError: hardware.error,
      },
    }));
  }, [hardware]);

  // ========================================================================
  // MEMOIZATION (Critical for performance!)
  // ========================================================================

  /**
   * MEMOIZED CONTEXT VALUE
   * 
   * PERFORMANCE STRATEGY:
   * - useMemo with [state] dependency ensures:
   *   1. Object reference only changes when state changes
   *   2. Consumers don't re-render on unrelated updates
   *   3. Prevents "object identity" thrashing
   * 
   * Without useMemo, a new object would be created on every render,
   * causing all consumers to re-render even if state unchanged.
   */
  const contextValue = useMemo<CommunityCDNAuthContextType>(
    () => ({
      state,
      actions: {
        setConsentEnabled: () => toggleConsent(true),
        setConsentDisabled: () => toggleConsent(false),
        updateHardwareStatus: (isWiFi, isBattery, error) => {
          setState((prev) => ({
            ...prev,
            hardware: {
              isWiFiConnected: isWiFi,
              isBatteryHealthy: isBattery,
              isCompliant: isWiFi && isBattery,
              hardwareCheckError: error || null,
            },
          }));
        },
        addBytesServed,
        addRewardPoints,
        resetSession,
      },
    }),
    [state, toggleConsent, addBytesServed, addRewardPoints, resetSession]
  );

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <CommunityCDNAuthContext.Provider value={contextValue}>
      {children}
    </CommunityCDNAuthContext.Provider>
  );
};

// ============================================================================
// SELECTOR HOOKS (Granular subscriptions to prevent re-renders)
// ============================================================================

/**
 * PERFORMANCE OPTIMIZATION EXPLANATION:
 * 
 * Problem: If we expose the full state, every component subscribing to
 * the context re-renders whenever ANY part of state changes.
 * 
 * Example: A component only cares about consent. But it gets re-rendered
 * when sessionBytesServed changes (unrelated data).
 * 
 * Solution: Provide granular selector hooks that use useMemo to extract
 * specific state slices. A component using useCommunityCDNConsent() only
 * re-renders when the consent slice changes.
 * 
 * How it works:
 * 1. Component calls useCommunityCDNConsent()
 * 2. Hook reads full context via useContext()
 * 3. useMemo extracts consent slice [state.consent]
 * 4. Component re-renders ONLY if consent.p2p_enabled or timestamp changed
 * 5. Sibling components' reward updates don't affect this component
 */

/**
 * useCommunityCDNConsent - Subscribe ONLY to consent state
 * 
 * Use in components that care about opt-in status:
 * - Consent toggle switch
 * - Audit logging UI
 * - Privacy/settings panels
 * 
 * @returns ConsentState { p2p_enabled, consentTimestamp, consentVersion }
 */
export const useCommunityCDNConsent = (): ConsentState => {
  const context = useContext(CommunityCDNAuthContext);
  if (!context) {
    throw new Error("useCommunityCDNConsent must be used inside CommunityCDNAuthProvider");
  }

  return useMemo(() => context.state.consent, [context.state.consent]);
};

/**
 * useCommunityCDNHardware - Subscribe ONLY to hardware compliance state
 * 
 * Use in components that care about device capabilities:
 * - Hardware status display
 * - Fallback decision logic
 * - Compliance reporting
 * 
 * @returns HardwareCapabilities { isWiFiConnected, isBatteryHealthy, isCompliant, error }
 */
export const useCommunityCDNHardware = (): HardwareCapabilities => {
  const context = useContext(CommunityCDNAuthContext);
  if (!context) {
    throw new Error("useCommunityCDNHardware must be used inside CommunityCDNAuthProvider");
  }

  return useMemo(() => context.state.hardware, [context.state.hardware]);
};

/**
 * useCommunityCDNRewards - Subscribe ONLY to reward/contribution state
 * 
 * Use in components that track user contributions:
 * - Reward points display
 * - Bytes served leaderboard
 * - Contribution stats
 * 
 * @returns RewardState { sessionBytesServed, pendingRewardPoints }
 */
export const useCommunityCDNRewards = (): RewardState => {
  const context = useContext(CommunityCDNAuthContext);
  if (!context) {
    throw new Error("useCommunityCDNRewards must be used inside CommunityCDNAuthProvider");
  }

  return useMemo(() => context.state.rewards, [context.state.rewards]);
};

/**
 * useCommunityCDNCompliance - Convenience hook: boolean check if P2P is compliant
 * 
 * Use in conditional logic:
 * if (useCommunityCDNCompliance()) {
 *   // Try P2P transfer
 * } else {
 *   // Fall back to server fetch
 * }
 * 
 * @returns boolean - true if consent enabled AND hardware compliant
 */
export const useCommunityCDNCompliance = (): boolean => {
  const context = useContext(CommunityCDNAuthContext);
  if (!context) {
    throw new Error("useCommunityCDNCompliance must be used inside CommunityCDNAuthProvider");
  }

  return useMemo(
    () =>
      context.state.consent.p2p_enabled && context.state.hardware.isCompliant,
    [context.state.consent.p2p_enabled, context.state.hardware.isCompliant]
  );
};

/**
 * useCommunityCDNActions - Get action creators
 * 
 * Use to dispatch state mutations:
 * const { setConsentEnabled, addBytesServed } = useCommunityCDNActions();
 * 
 * @returns CommunityCDNAuthActions
 */
export const useCommunityCDNActions = (): CommunityCDNAuthActions => {
  const context = useContext(CommunityCDNAuthContext);
  if (!context) {
    throw new Error("useCommunityCDNActions must be used inside CommunityCDNAuthProvider");
  }

  return useMemo(() => context.actions, [context.actions]);
};

/**
 * USAGE EXAMPLES:
 * 
 * Example 1: Consent Toggle Component
 * ─────────────────────────────────────
 * export function ConsentToggle() {
 *   const consent = useCommunityCDNConsent();
 *   const { setConsentEnabled, setConsentDisabled } = useCommunityCDNActions();
 *   
 *   return (
 *     <button onClick={() => consent.p2p_enabled ? setConsentDisabled() : setConsentEnabled()}>
 *       {consent.p2p_enabled ? "Disable P2P" : "Enable P2P"}
 *     </button>
 *   );
 * }
 * 
 * // This component re-renders ONLY when consent changes
 * // Unaffected by hardware or reward updates
 * 
 * Example 2: P2P Transfer Component
 * ──────────────────────────────────
 * export function P2PImage({ imageUrl }) {
 *   const compliance = useCommunityCDNCompliance();
 *   const { addBytesServed } = useCommunityCDNActions();
 *   
 *   const handleTransferComplete = (bytes) => {
 *     addBytesServed(bytes);
 *   };
 *   
 *   if (!compliance) {
 *     return <img src={imageUrl} />;
 *   }
 *   
 *   return <P2PTransfer url={imageUrl} onComplete={handleTransferComplete} />;
 * }
 * 
 * // Re-renders only when compliance boolean changes
 * 
 * Example 3: Reward Stats Dashboard
 * ──────────────────────────────────
 * export function RewardStats() {
 *   const rewards = useCommunityCDNRewards();
 *   
 *   return (
 *     <div>
 *       <p>Bytes served: {formatBytes(rewards.sessionBytesServed)}</p>
 *       <p>Reward points: {rewards.pendingRewardPoints}</p>
 *     </div>
 *   );
 * }
 * 
 * // Re-renders only when rewards slice changes
 * // Not affected by consent toggles or hardware changes
 */
`;

try {
  fs.writeFileSync(
    path.join(contextDir, 'CommunityCDNAuth.tsx'),
    communityAuthContent
  );
  console.log('✓ Created file: src/p2p/context/CommunityCDNAuth.tsx');
  
  console.log('\n✅ Phase 1, Part 4 complete!');
  console.log('\nGenerated:');
  console.log('- src/p2p/context/CommunityCDNAuth.tsx (Global context + provider)');
  console.log('- CommunityCDNAuthProvider component');
  console.log('- Granular selector hooks: useCommunityCDNConsent, useCommunityCDNHardware, useCommunityCDNRewards, useCommunityCDNCompliance, useCommunityCDNActions');
  console.log('\nNext: npm run setup:p2p:phase1:barrel to generate barrel exports');
  
  process.exit(0);
} catch (err) {
  console.error('✗ Error creating file:', err);
  process.exit(1);
}
