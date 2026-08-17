import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { restorePurchases } from '../lib/purchases';
import { useUnlocked, setUnlocked } from '../lib/unlockStore';
import { C, F } from '../lib/theme';

const LEGAL = 'https://nani-japan-legal.pages.dev';

export default function Settings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const unlocked = useUnlocked();
  const [busy, setBusy] = useState(false);

  const restore = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const ok = await restorePurchases();
      if (ok) {
        await setUnlocked(true);
        Alert.alert('Restored', 'Your unlock is active on this device.');
      } else {
        Alert.alert('Nothing to restore', 'No previous purchase was found on this Apple ID.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.washi }}>
      <View style={[s.topbar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={s.back}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Text style={s.backTxt}>‹ Back</Text>
        </Pressable>
        <Text style={s.tbName}><Text style={s.tbJp}>設定 </Text>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: insets.bottom + 32 }}>
        <Text style={s.eyebrow}>PURCHASE</Text>
        <View style={s.card}>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>Unlock all Japan</Text>
              <Text style={s.rowSub}>
                {unlocked
                  ? 'Active — every area is unlocked on this device. Thank you!'
                  : 'One-time purchase. Unlocks every sealed card, forever.'}
              </Text>
            </View>
            {unlocked ? (
              <View style={s.badgeOn}><Text style={s.badgeOnTxt}>ACTIVE</Text></View>
            ) : (
              <Pressable
                style={s.cta}
                onPress={() => router.navigate('/paywall')}
                accessibilityRole="button"
                accessibilityLabel="Open the unlock screen"
              >
                <Text style={s.ctaTxt}>Unlock</Text>
              </Pressable>
            )}
          </View>
          <View style={s.divider} />
          <Pressable
            style={s.linkRow}
            onPress={restore}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel="Restore a previous purchase"
          >
            {busy
              ? <ActivityIndicator size="small" color={C.taupeDeep} />
              : <Text style={s.linkTxt}>Restore purchase</Text>}
            <Text style={s.linkHint}>Bought it before, or switched phones? Tap here.</Text>
          </Pressable>
        </View>

        <Text style={[s.eyebrow, { marginTop: 26 }]}>ABOUT</Text>
        <View style={s.card}>
          {([
            ['Privacy Policy', `${LEGAL}/privacy`],
            ['Terms of Use', `${LEGAL}/terms`],
            ['Support & FAQ', `${LEGAL}/support`],
          ] as const).map(([label, url], i) => (
            <View key={label}>
              {i > 0 && <View style={s.divider} />}
              <Pressable
                style={s.linkRow}
                onPress={() => Linking.openURL(url)}
                accessibilityRole="link"
                accessibilityLabel={label}
              >
                <Text style={s.linkTxt}>{label} <Text style={s.ext}>↗</Text></Text>
              </Pressable>
            </View>
          ))}
        </View>

        <Text style={s.version}>
          Nani?! Japan v{Constants.expoConfig?.version ?? '1.0.0'} · Made with curiosity, not sponsorships.
        </Text>
        <Text style={s.versionSub}>
          Every card is fact-checked against real sources. Spotted something outdated? Tell us via Support.
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 16, paddingBottom: 11, backgroundColor: C.washi, borderBottomWidth: 1, borderBottomColor: C.beige2 },
  back: { backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 13, minHeight: 34, justifyContent: 'center' },
  backTxt: { fontFamily: F.bodyHeavy, fontSize: 13, color: C.taupeDeep },
  tbName: { fontFamily: F.bodyHeavy, fontSize: 14.5, color: C.ink },
  tbJp: { fontFamily: F.bodyBold, fontSize: 12, color: C.coral },
  eyebrow: { fontFamily: F.bodyHeavy, fontSize: 10.5, letterSpacing: 1.8, color: C.taupe, marginBottom: 9 },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 20, paddingHorizontal: 16, shadowColor: '#15130F', shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15 },
  rowTitle: { fontFamily: F.bodyHeavy, fontSize: 15.5, color: C.ink },
  rowSub: { fontFamily: F.body, fontSize: 12.5, lineHeight: 18, color: C.taupeDeep, marginTop: 3 },
  badgeOn: { backgroundColor: '#E8F8F2', borderWidth: 1, borderColor: '#BDEBDC', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  badgeOnTxt: { fontFamily: F.bodyHeavy, fontSize: 10.5, letterSpacing: 1, color: '#0E9C78' },
  cta: { backgroundColor: C.coral, borderRadius: 999, paddingVertical: 11, paddingHorizontal: 17, minHeight: 44, justifyContent: 'center' },
  ctaTxt: { fontFamily: F.bodyHeavy, fontSize: 13.5, color: '#fff' },
  divider: { height: 1, backgroundColor: C.beige2 },
  linkRow: { paddingVertical: 15, minHeight: 44, justifyContent: 'center' },
  linkTxt: { fontFamily: F.bodyBold, fontSize: 14.5, color: C.ink },
  linkHint: { fontFamily: F.body, fontSize: 11.5, color: C.taupe, marginTop: 3 },
  ext: { color: C.coral },
  version: { fontFamily: F.bodyBold, fontSize: 11.5, color: C.taupe, textAlign: 'center', marginTop: 26 },
  versionSub: { fontFamily: F.body, fontSize: 11, lineHeight: 16, color: C.taupe, textAlign: 'center', marginTop: 5, paddingHorizontal: 16 },
});
