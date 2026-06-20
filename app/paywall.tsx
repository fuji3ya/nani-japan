import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getUnlockPrice, purchaseUnlock, restorePurchases } from '../lib/purchases';
import { setUnlocked } from '../lib/unlockStore';
import { totalSecrets, AREAS } from '../lib/content';
import { C, F } from '../lib/theme';

export default function Paywall() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [price, setPrice] = useState('$5.99');
  const [busy, setBusy] = useState(false);

  useEffect(() => { getUnlockPrice().then(setPrice).catch(() => {}); }, []);

  const buy = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const ok = await purchaseUnlock();
      if (ok) { await setUnlocked(true); router.back(); }
    } finally { setBusy(false); }
  };
  const restore = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const ok = await restorePurchases();
      if (ok) { await setUnlocked(true); router.back(); }
      else Alert.alert('Nothing to restore', 'No previous purchase was found on this Apple ID.');
    } finally { setBusy(false); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.washi, paddingTop: insets.top }}>
      <Pressable style={s.close} onPress={() => router.back()}><Text style={s.closeTxt}>✕</Text></Pressable>
      <View style={s.body}>
        <Text style={s.h}>Free: the guidebook.{'\n'}Unlocked: <Text style={{ color: C.coral }}>the local who lives here.</Text></Text>
        <Text style={s.pitch}>Every sealed card hides the part you can't Google — the insider move, the timing trick, the unwritten rule.</Text>

        <Line>{`${totalSecrets} insider secrets`} across {AREAS.length} areas — Tokyo to Nara</Line>
        <Line>One-time purchase. No subscription, no expiry. New areas included free.</Line>
        <Line>Works fully offline — built for airplane mode over the Pacific.</Line>

        <Pressable style={s.buy} onPress={buy} disabled={busy}>
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.buyTxt}>Unlock all Japan · {price}</Text>}
        </Pressable>
        <Pressable style={s.restore} onPress={restore} disabled={busy}>
          <Text style={s.restoreTxt}>Restore purchase</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Line({ children }: { children: React.ReactNode }) {
  return (
    <View style={s.line}>
      <Text style={s.ok}>✓</Text>
      <Text style={s.lineTxt}>{children}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  close: { alignSelf: 'flex-end', padding: 18 },
  closeTxt: { fontFamily: F.bodyBold, fontSize: 20, color: C.taupe },
  body: { paddingHorizontal: 26, paddingTop: 6 },
  h: { fontFamily: F.display, fontSize: 30, lineHeight: 36, color: C.ink, letterSpacing: -0.8 },
  pitch: { fontFamily: F.body, fontSize: 15, lineHeight: 24, color: C.taupeDeep, marginTop: 12, marginBottom: 18 },
  line: { flexDirection: 'row', gap: 11, alignItems: 'flex-start', marginVertical: 8 },
  ok: { fontFamily: F.bodyHeavy, fontSize: 16, color: C.green, lineHeight: 23 },
  lineTxt: { flex: 1, fontFamily: F.body, fontSize: 14.5, lineHeight: 23, color: C.ink },
  buy: { backgroundColor: C.coral, borderRadius: 18, paddingVertical: 17, alignItems: 'center', marginTop: 22, shadowColor: C.coralDeep, shadowOpacity: 0.4, shadowRadius: 26, shadowOffset: { width: 0, height: 10 }, elevation: 6 },
  buyTxt: { fontFamily: F.bodyHeavy, fontSize: 16.5, color: '#fff' },
  restore: { alignItems: 'center', paddingVertical: 16 },
  restoreTxt: { fontFamily: F.bodyBold, fontSize: 13.5, color: C.taupeDeep },
});
