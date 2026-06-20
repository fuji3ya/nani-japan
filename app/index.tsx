import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Modal, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { JAPAN_SVG } from '../lib/japanSvg';
import {
  AREAS, byId, TOKYO_WARDS, KANSAI_CITIES, totalSecrets,
} from '../lib/content';
import { C, F } from '../lib/theme';

const WARD_EMOJI: Record<string, string> = {
  kanda: '🍶', shibuya: '🚥', asakusa: '🏮', shinjuku: '🌃', akihabara: '📻', harajuku: '🎀', ueno: '🐼',
};
const WARD_TEASE: Record<string, string> = {
  kanda: 'Salaryman heartland · lunch battleground · IT shrine',
  shibuya: 'The Scramble · 70-year alley bars · the quiet Shibuya',
  asakusa: 'Old Edo · 6am empty temple · morning-drinking alley',
  shinjuku: "World's busiest station · Golden Gai · free skyline",
  akihabara: 'Electric Town · junk alleys · gachapon heaven',
  harajuku: 'Kawaii HQ · hand-planted forest · hidden alleys',
  ueno: 'Pandas & museums · senbero · black-market bazaar',
};
const CITY_EMOJI: Record<string, string> = { kyoto: '⛩️', osaka: '🐙', nara: '🦌' };
const CITY_TEASE: Record<string, string> = {
  kyoto: 'Temples · geisha district · matcha · the overtourism truth',
  osaka: 'Kuidaore food · comedy capital · the kushikatsu law',
  nara: 'Bowing (mugging) deer · giant Buddha · 3,000 lanterns',
};
const TOKYO_SECRETS = TOKYO_WARDS.reduce((s, w) => s + byId[w].cards.length, 0);
const KANSAI_SECRETS = KANSAI_CITIES.reduce((s, c) => s + byId[c].cards.length, 0);

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [sheet, setSheet] = useState<null | 'tokyo' | 'kansai'>(null);
  const go = (id: string) => { setSheet(null); router.push(`/area/${id}`); };

  return (
    <View style={{ flex: 1, backgroundColor: C.washi }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: insets.top + 22, paddingBottom: 48 }}>
        <View style={s.coverEyebrow}>
          <View style={s.eyebrowTick} />
          <Text style={s.coverEyebrowTxt}>INSIDER JAPAN · 旅の裏側</Text>
        </View>
        <Text style={s.brand}>Nani<Text style={{ color: C.coral }}>?!</Text> Japan</Text>
        <Text style={s.brandJp}>なに?! ジャパン</Text>
        <Text style={s.mapSub}>Tap a glowing region. Get the secrets only locals tell each other.</Text>

        <View style={s.mapWrap}>
          <SvgXml xml={JAPAN_SVG} width="100%" height="100%" />
          {/* overlay label chips (approx centroids; tap to open the region sheet) */}
          <Chip style={{ left: '60%', top: '50%' }} onPress={() => setSheet('tokyo')}
            label="Tokyo" jp="東京" sub={`7 areas · ${TOKYO_SECRETS}`} />
          <Chip style={{ left: '14%', top: '57%' }} onPress={() => setSheet('kansai')}
            label="Kansai" jp="関西" sub={`3 cities · ${KANSAI_SECRETS}`} />
        </View>

        <Text style={s.footnote}>
          <Text style={{ color: C.coral, fontFamily: F.bodyBold }}>{totalSecrets} insider secrets</Text>
          {`  in ${AREAS.length} areas · Hokkaido, Hiroshima & Okinawa coming soon`}
        </Text>

        <Text style={s.startEyebrow}>FIRST TIME? START HERE</Text>
        <View style={s.startRow}>
          {['kanda', 'osaka', 'nara'].map((id) => (
            <Pressable key={id} style={s.startCard} onPress={() => go(id)}>
              <Text style={s.startEm}>{{ kanda: '🍶', osaka: '🐙', nara: '🦌' }[id]}</Text>
              <Text style={s.startNm}>{byId[id].name_en}</Text>
              <Text style={s.startCt}>{byId[id].cards.length} secrets</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <RegionSheet
        open={sheet === 'tokyo'} onClose={() => setSheet(null)}
        title="Tokyo" jp="東京" sub="Seven neighborhoods, seven completely different cities."
        rows={TOKYO_WARDS.map((w) => ({ id: w, emoji: WARD_EMOJI[w], tease: WARD_TEASE[w] }))} onPick={go} />
      <RegionSheet
        open={sheet === 'kansai'} onClose={() => setSheet(null)}
        title="Kansai" jp="関西" sub="Old Japan's beating heart — temples, food, and the funniest people in the country."
        rows={KANSAI_CITIES.map((c) => ({ id: c, emoji: CITY_EMOJI[c], tease: CITY_TEASE[c] }))} onPick={go} />
    </View>
  );
}

function Chip({ style, onPress, label, jp, sub }: {
  style: object; onPress: () => void; label: string; jp: string; sub: string;
}) {
  return (
    <Pressable style={[s.chip, style]} onPress={onPress}>
      <Text style={s.chipTop}>{label} <Text style={s.chipJp}>{jp}</Text></Text>
      <Text style={s.chipSub}>{sub}</Text>
    </Pressable>
  );
}

function RegionSheet({ open, onClose, title, jp, sub, rows, onPick }: {
  open: boolean; onClose: () => void; title: string; jp: string; sub: string;
  rows: { id: string; emoji: string; tease: string }[]; onPick: (id: string) => void;
}) {
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.veil} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.grab} />
        <View style={s.sheetH}>
          <Text style={s.sheetTitle}>{title}</Text>
          <Text style={s.sheetJp}>{jp}</Text>
        </View>
        <Text style={s.sheetSub}>{sub}</Text>
        {rows.map((r) => (
          <Pressable key={r.id} style={s.wardRow} onPress={() => onPick(r.id)}>
            <View style={s.wardEmoji}><Text style={{ fontSize: 23 }}>{r.emoji}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.wardNm}>{byId[r.id].name_en} <Text style={s.wardNmJp}>{byId[r.id].name_ja}</Text></Text>
              <Text style={s.wardTease}>{r.tease}</Text>
            </View>
            <Text style={s.chev}>›</Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  coverEyebrow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 11 },
  eyebrowTick: { width: 24, height: 2, borderRadius: 2, backgroundColor: C.coral },
  coverEyebrowTxt: { fontFamily: F.bodyHeavy, fontSize: 10.5, letterSpacing: 2, color: C.coral },
  brand: { fontFamily: F.display, fontSize: 40, color: C.ink, letterSpacing: -1.4 },
  brandJp: { fontFamily: F.bodyBold, fontSize: 14, color: C.taupe, marginTop: 2 },
  mapSub: { fontFamily: F.body, fontSize: 15, lineHeight: 23, color: C.taupeDeep, marginTop: 9, maxWidth: 300 },
  mapWrap: { width: '100%', aspectRatio: 1, marginTop: 8, position: 'relative' },
  chip: {
    position: 'absolute', backgroundColor: 'rgba(255,253,247,0.97)', borderWidth: 1, borderColor: C.line,
    borderRadius: 12, paddingVertical: 6, paddingHorizontal: 12,
    shadowColor: '#15130F', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  chipTop: { fontFamily: F.bodyHeavy, fontSize: 13.5, color: C.ink },
  chipJp: { fontFamily: F.bodyBold, color: C.coral, fontSize: 11 },
  chipSub: { fontFamily: F.bodyBold, fontSize: 9.5, color: C.taupe, marginTop: 1 },
  footnote: { fontFamily: F.bodyBold, fontSize: 12.5, color: C.taupe, textAlign: 'center', marginTop: 14, lineHeight: 19 },
  startEyebrow: { fontFamily: F.bodyHeavy, fontSize: 10.5, letterSpacing: 1.8, color: C.taupe, marginTop: 22 },
  startRow: { flexDirection: 'row', gap: 10, marginTop: 11 },
  startCard: {
    flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 13,
    shadowColor: '#15130F', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 2,
  },
  startEm: { fontSize: 22 },
  startNm: { fontFamily: F.bodyHeavy, fontSize: 14, color: C.ink, marginTop: 8 },
  startCt: { fontFamily: F.bodyBold, fontSize: 11, color: C.taupe, marginTop: 2 },
  veil: { flex: 1, backgroundColor: 'rgba(21,19,15,0.5)' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.washi,
    borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 34, maxHeight: '82%',
  },
  grab: { width: 40, height: 5, borderRadius: 3, backgroundColor: C.line, alignSelf: 'center', marginBottom: 16 },
  sheetH: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  sheetTitle: { fontFamily: F.display, fontSize: 28, color: C.ink, letterSpacing: -0.7 },
  sheetJp: { fontFamily: F.bodyHeavy, fontSize: 16, color: C.coral },
  sheetSub: { fontFamily: F.body, fontSize: 13.5, color: C.taupe, marginTop: 3, marginBottom: 12 },
  wardRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.beige2 },
  wardEmoji: { width: 46, height: 46, borderRadius: 15, backgroundColor: C.beige2, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  wardNm: { fontFamily: F.bodyHeavy, fontSize: 16, color: C.ink },
  wardNmJp: { fontFamily: F.bodyBold, fontSize: 12.5, color: C.taupe },
  wardTease: { fontFamily: F.body, fontSize: 12, color: C.taupeDeep, marginTop: 2, lineHeight: 16 },
  chev: { color: C.coral, fontFamily: F.bodyHeavy, fontSize: 18 },
});
