// ============================================================================
// Phase 1, Final: Barrel Export Setup Script
// ============================================================================
// Generates src/p2p/index.ts with clean module exports
// ============================================================================

const fs = require('fs');
const path = require('path');

const frontendDir = __dirname;
const p2pDir = path.join(frontendDir, 'src', 'p2p');
const indexPath = path.join(p2pDir, 'index.ts');

// Check if p2p directory exists
if (!fs.existsSync(p2pDir)) {
  console.error('✗ ERROR: src/p2p directory does not exist');
  console.error('Please run: npm run setup:p2p:phase1 first');
  process.exit(1);
}

const indexContent = `/**
 * Z-STORE P2P Image Sharing - Module Barrel Export
 * 
 * Clean public API for the entire P2P module.
 * Consumers import from '@/p2p' instead of deep paths like '@/p2p/utils/types'.
 */

// ========================================================================
// TYPES (from utils/types.ts)
// ========================================================================
export type {
  ConsentState,
  HardwareCapabilities,
  RewardState,
  CommunityCDNAuthState,
  CommunityCDNAuthActions,
  CommunityCDNAuthContextType,
  HardwareCheckResult,
} from "./utils/types";

// ========================================================================
// CONSTANTS (from utils/constants.ts)
// ========================================================================
export {
  P2P_CONSENT_VERSION,
  P2P_CONSENT_STORAGE_KEY,
  P2P_TIMEOUT_MS,
  CHUNK_SIZE_BYTES,
  BATTERY_THRESHOLD,
  ALLOWED_CONNECTION_TYPES,
  LOG_PREFIX,
  VERBOSE_LOGGING,
  P2P_FEATURE_ENABLED,
} from "./utils/constants";

// ========================================================================
// UTILITIES (from utils/)
// ========================================================================
export { getConsentState, setConsentState, clearConsentState, validateConsentSchema } from "./utils/consentManager";
export { logConsentUpdate, logHardwareCheck, logP2PEvent, logP2PError, logRewardUpdate } from "./utils/logger";

// ========================================================================
// HOOKS (from hooks/)
// ========================================================================
export { useHardwareCompliance } from "./hooks/useHardwareCompliance";

// ========================================================================
// CONTEXT & PROVIDER (from context/)
// ========================================================================
export {
  CommunityCDNAuthProvider,
  useCommunityCDNConsent,
  useCommunityCDNHardware,
  useCommunityCDNRewards,
  useCommunityCDNCompliance,
  useCommunityCDNActions,
} from "./context/CommunityCDNAuth";

/**
 * USAGE EXAMPLES:
 * 
 * Example 1: Access types in your components
 * ───────────────────────────────────────────
 * import type { CommunityCDNAuthState, HardwareCapabilities } from "@/p2p";
 * 
 * Example 2: Use the provider in your app
 * ────────────────────────────────────────
 * import { CommunityCDNAuthProvider } from "@/p2p";
 * 
 * function App() {
 *   return (
 *     <CommunityCDNAuthProvider>
 *       <YourAppComponents />
 *     </CommunityCDNAuthProvider>
 *   );
 * }
 * 
 * Example 3: Subscribe to specific state slices
 * ──────────────────────────────────────────────
 * import {
 *   useCommunityCDNConsent,
 *   useCommunityCDNCompliance,
 *   useCommunityCDNActions,
 * } from "@/p2p";
 * 
 * function ConsentToggle() {
 *   const consent = useCommunityCDNConsent();
 *   const { setConsentEnabled } = useCommunityCDNActions();
 * 
 *   return (
 *     <button onClick={() => setConsentEnabled()}>
 *       Enable P2P: {consent.p2p_enabled ? "ON" : "OFF"}
 *     </button>
 *   );
 * }
 * 
 * Example 4: Conditional P2P rendering
 * ─────────────────────────────────────
 * import { useCommunityCDNCompliance } from "@/p2p";
 * 
 * function ImageComponent({ url }) {
 *   const isCompliant = useCommunityCDNCompliance();
 * 
 *   return isCompliant ? <P2PImage url={url} /> : <StandardImage url={url} />;
 * }
 */
`;

try {
  fs.writeFileSync(indexPath, indexContent);
  console.log('✓ Created file: src/p2p/index.ts');
  
  console.log('\n✅ PHASE 1 COMPLETE! 🎉');
  console.log('\n═════════════════════════════════════════════════════════════');
  console.log('Phase 1 deliverables:');
  console.log('═════════════════════════════════════════════════════════════');
  console.log('\n📦 TYPE DEFINITIONS (utils/types.ts)');
  console.log('   ✓ ConsentState');
  console.log('   ✓ HardwareCapabilities');
  console.log('   ✓ RewardState');
  console.log('   ✓ CommunityCDNAuthState');
  console.log('   ✓ CommunityCDNAuthActions');
  console.log('   ✓ CommunityCDNAuthContextType');
  
  console.log('\n⚙️  CONSTANTS (utils/constants.ts)');
  console.log('   ✓ P2P_CONSENT_VERSION');
  console.log('   ✓ P2P_TIMEOUT_MS = 1000ms');
  console.log('   ✓ BATTERY_THRESHOLD = 0.8 (80%)');
  console.log('   ✓ ALLOWED_CONNECTION_TYPES = ["4g", "wifi"]');
  
  console.log('\n🔧 UTILITIES');
  console.log('   ✓ consentManager.ts (localStorage I/O + validation)');
  console.log('   ✓ logger.ts (structured compliance logging)');
  
  console.log('\n⚛️  REACT HOOKS');
  console.log('   ✓ useHardwareCompliance (Wi-Fi + battery detection)');
  console.log('   ✓ useCommunityCDNConsent (selector hook)');
  console.log('   ✓ useCommunityCDNHardware (selector hook)');
  console.log('   ✓ useCommunityCDNRewards (selector hook)');
  console.log('   ✓ useCommunityCDNCompliance (convenience hook)');
  console.log('   ✓ useCommunityCDNActions (action creators)');
  
  console.log('\n🔗 CONTEXT & PROVIDER');
  console.log('   ✓ CommunityCDNAuthProvider (global state management)');
  console.log('   ✓ Memoized context value (re-render optimization)');
  console.log('   ✓ Real-time hardware sync');
  console.log('   ✓ Granular selector hooks (targeted subscriptions)');
  
  console.log('\n📋 BARREL EXPORT (index.ts)');
  console.log('   ✓ Clean public API for entire module');
  
  console.log('\n═════════════════════════════════════════════════════════════');
  console.log('\n✅ To generate all Phase 1 files at once:');
  console.log('   npm run setup:p2p:phase1');
  console.log('\n✅ To run each part separately:');
  console.log('   npm run setup:p2p:phase1        # Part 1: types, constants, logger');
  console.log('   npm run setup:p2p:phase1:part2  # Part 2: consentManager');
  console.log('   npm run setup:p2p:phase1:part3  # Part 3: useHardwareCompliance');
  console.log('   npm run setup:p2p:phase1:part4  # Part 4: CommunityCDNAuth context');
  console.log('   npm run setup:p2p:phase1:barrel # Part 5: Barrel export');
  
  console.log('\n📖 Next Steps:');
  console.log('   1. Review generated files in src/p2p/');
  console.log('   2. Add CommunityCDNAuthProvider to App.tsx');
  console.log('   3. Start Phase 2: useP2PSwarm hook (PeerJS initialization)');
  
  process.exit(0);
} catch (err) {
  console.error('✗ Error creating file:', err);
  process.exit(1);
}
