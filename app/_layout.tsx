import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useFonts } from 'expo-font';
import {
  LINESeedJP_400Regular,
  LINESeedJP_700Bold,
  LINESeedJP_800ExtraBold,
} from '@expo-google-fonts/line-seed-jp';
import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import { initPurchases, getEntitlementStatus } from '../lib/purchases';
import { hydrateUnlock, setUnlocked } from '../lib/unlockStore';
import { C } from '../lib/theme';

// Reconcile the cached unlock with the live RC entitlement.
//   true/false → write it · null (offline/error) → keep cache (never lock out a buyer)
let reconciling = false;
async function reconcile() {
  if (reconciling) return;
  reconciling = true;
  try {
    const status = await getEntitlementStatus();
    if (status !== null) await setUnlocked(status);
  } catch (e) {
    console.warn('[nanijapan] reconcile', (e as Error)?.message);
  } finally {
    reconciling = false;
  }
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    LINESeedJP_400Regular,
    LINESeedJP_700Bold,
    LINESeedJP_800ExtraBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      await hydrateUnlock(); // show cached unlock immediately
      try {
        await initPurchases();
        if (mounted) await reconcile();
      } catch (e) {
        console.warn('[nanijapan] purchases init', (e as Error)?.message);
      }
    })();
    const sub = AppState.addEventListener('change', (s: AppStateStatus) => {
      if (s === 'active') reconcile();
    });
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  if (!loaded && !error) return null; // fall through to system font if fonts fail
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.washi },
      }}
    />
  );
}
