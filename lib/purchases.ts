/**
 * Nani?! Japan — RevenueCat client wrapper (BUY-ONCE, non-consumable).
 *
 * One non-consumable IAP unlocks every mosaic forever:
 *   unlock_all_japan  — ~$5.99 one-time
 * Entitlement lookup_key: `unlock_all`.
 *
 * Fail-closed: when EXPO_PUBLIC_RC_API_KEY_IOS is absent, the unlock can ONLY
 * be granted in __DEV__ (mock). A Release build without the key can never fake
 * the purchase — "free unlock for everyone on a mis-built binary" is impossible.
 */
import Purchases, { LOG_LEVEL, type PurchasesOffering } from 'react-native-purchases';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUnlocked } from './unlockStore';

const RC_API_KEY_IOS = process.env.EXPO_PUBLIC_RC_API_KEY_IOS;
const RC_API_KEY_ANDROID = process.env.EXPO_PUBLIC_RC_API_KEY_ANDROID;
const ENTITLEMENT_ID = 'unlock_all';
const PRODUCT_ID = 'unlock_all_japan';
const MOCK_KEY = 'nanijapan:mockUnlock';

let initialized = false;
const hasKey = () => (Platform.OS === 'ios' ? !!RC_API_KEY_IOS : !!RC_API_KEY_ANDROID);
const MOCK_OK = __DEV__; // mock unlock allowed only in development

export async function initPurchases(userId?: string): Promise<void> {
  if (initialized) return;
  const key = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
  if (!key) {
    initialized = true; // mock mode (dev only — see MOCK_OK)
    return;
  }
  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);
  await Purchases.configure({ apiKey: key, appUserID: userId });
  // Push-driven entitlement updates. Without this, an Ask-to-Buy purchase the
  // parent approves later (RC delivers it asynchronously) or a refund/revocation
  // only lands on the next foreground reconcile; with it, the unlock flips the
  // moment RC hears about it.
  Purchases.addCustomerInfoUpdateListener((info) => {
    setUnlocked(!!info.entitlements.active[ENTITLEMENT_ID]?.isActive);
  });
  initialized = true;
}

async function currentOffering(): Promise<PurchasesOffering | null> {
  if (!hasKey()) return null;
  try {
    const o = await Purchases.getOfferings();
    return o.current ?? null;
  } catch {
    return null;
  }
}

/** Localized price for the paywall; USD fallback when RC isn't live yet. */
export async function getUnlockPrice(): Promise<string> {
  const fallback = '$5.99';
  const offering = await currentOffering();
  const pkg = offering?.availablePackages?.find((p) => p.product.identifier === PRODUCT_ID)
    ?? offering?.availablePackages?.[0];
  return pkg?.product.priceString ?? fallback;
}

/** Attempt the one-time purchase. Returns true if the unlock entitlement is now active. */
export async function purchaseUnlock(): Promise<boolean> {
  if (!hasKey()) {
    if (!MOCK_OK) return false; // Release without a key: never fake a purchase
    await AsyncStorage.setItem(MOCK_KEY, '1');
    return true;
  }
  try {
    const offering = await currentOffering();
    const pkgs = offering?.availablePackages ?? [];
    const pkg = pkgs.find((p) => p.product.identifier === PRODUCT_ID) ?? pkgs[0];
    if (!pkg) throw new Error('unlock_package_not_found');
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo.entitlements.active[ENTITLEMENT_ID]?.isActive ?? false;
  } catch (e: any) {
    if (e?.userCancelled) return false;
    console.warn('[nanijapan] purchase failed', e?.message);
    return false;
  }
}

export async function isUnlocked(): Promise<boolean> {
  if (!hasKey()) return MOCK_OK && (await AsyncStorage.getItem(MOCK_KEY)) === '1';
  try {
    const info = await Purchases.getCustomerInfo();
    return info.entitlements.active[ENTITLEMENT_ID]?.isActive ?? false;
  } catch {
    return false;
  }
}

/**
 * Live entitlement status for reconciling the cache:
 *   true  → active (grant)  ·  false → RC says inactive  ·  null → indeterminate
 *   (offline/error) → caller keeps the cached value (a non-consumable never
 *   "expires", but a network blip must not lock out a buyer).
 */
export async function getEntitlementStatus(): Promise<boolean | null> {
  if (!hasKey()) return MOCK_OK ? (await AsyncStorage.getItem(MOCK_KEY)) === '1' : false;
  try {
    const info = await Purchases.getCustomerInfo();
    return info.entitlements.active[ENTITLEMENT_ID]?.isActive ?? false;
  } catch {
    return null;
  }
}

/** Restore — required by App Store for non-consumables (always-present button). */
export async function restorePurchases(): Promise<boolean> {
  if (!hasKey()) return isUnlocked();
  try {
    const info = await Purchases.restorePurchases();
    return info.entitlements.active[ENTITLEMENT_ID]?.isActive ?? false;
  } catch {
    return false;
  }
}
