import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  byId, areaIndex, regionOf, SECTION_LABEL, DIALECT, APPSTORE_SISTER, AREAS,
  type Card, type Area,
} from '../../lib/content';
import { useUnlocked } from '../../lib/unlockStore';
import { C, F } from '../../lib/theme';

const SECTIONS: Card['section'][] = ['culture', 'eat', 'off_guidebook'];

export default function AreaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const unlocked = useUnlocked();
  const a = byId[id as string] as Area | undefined;
  if (!a) {
    return (
      <View style={{ flex: 1, backgroundColor: C.washi, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: F.bodyBold, color: C.taupe }}>Area not found</Text>
      </View>
    );
  }
  const locked = a.cards.filter((c) => !c.is_free_sample).length;
  const toPay = () => router.push('/paywall');

  return (
    <View style={{ flex: 1, backgroundColor: C.washi }}>
      {/* fixed top bar — back is always reachable */}
      <View style={[s.topbar, { paddingTop: insets.top + 8 }]}>
        <Pressable style={s.back} onPress={() => router.back()}>
          <Text style={s.backTxt}>‹ Map</Text>
        </Pressable>
        <Text style={s.tbName}><Text style={s.tbJp}>{a.name_ja} </Text>{a.name_en}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: unlocked ? 40 : 110 }}>
        {/* hero */}
        <View style={s.hero}>
          <Text style={s.heroKanji} numberOfLines={1}>{a.name_ja}</Text>
          <View style={s.heroEyebrow}>
            <Text style={s.idx}>№ {areaIndex(a.id)}</Text>
            <Text style={s.reg}>{regionOf(a.id).toUpperCase()} · <Text style={s.regJp}>{a.name_ja}</Text></Text>
          </View>
          <Text style={s.h2}>{a.name_en}</Text>
          <Text style={s.tagline}>{a.header.tagline_en}</Text>
          <View style={s.metaRow}>
            <Meta>{a.cards.length} secrets</Meta>
            <Meta free>{a.cards.filter((c) => c.is_free_sample).length} free</Meta>
            <Meta>{a.cards.filter((c) => c.is_food).length} about food 🍜</Meta>
          </View>
        </View>

        {/* eat quicklist */}
        {a.eat_quicklist?.length ? (
          <View style={s.eatStrip}>
            <Text style={s.eyebrow}>WHAT TO EAT HERE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 22, paddingVertical: 13, gap: 11 }}>
              {a.eat_quicklist.map((e, i) => (
                <View key={i} style={s.eatChip}>
                  <Text style={{ fontSize: 24 }}>{e.icon}</Text>
                  <Text style={s.eatLb}>{e.label_en}</Text>
                  <Text style={s.eatBl}>{e.blurb_en}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* sections + cards */}
        {SECTIONS.map((sec) => {
          const cards = a.cards.filter((c) => c.section === sec);
          if (!cards.length) return null;
          return (
            <View key={sec}>
              <View style={[s.sectionHead, sec === 'off_guidebook' && { }]}>
                <Text style={[s.sectionTag, sec === 'off_guidebook' && { color: C.coralDeep }]}>
                  {SECTION_LABEL[sec]}
                </Text>
                {sec === 'off_guidebook' && <Text style={s.stamp}>LOCALS ONLY</Text>}
                <View style={s.rule} />
              </View>
              {cards.map((c) => (
                <CardView key={c.id} card={c} unlocked={unlocked} onUnlock={toPay} />
              ))}
            </View>
          );
        })}

        {/* sister-app cross-promo */}
        <Sister area={a} />
      </ScrollView>

      {/* fixed paybar */}
      {!unlocked && (
        <Pressable style={[s.paybar, { paddingBottom: 14 }]} onPress={toPay}>
          <View style={{ flex: 1 }}>
            <Text style={s.paybarT1}>Unlock all Japan</Text>
            <Text style={s.paybarT2}>{locked} secrets here · all {AREAS.length} areas · forever</Text>
          </View>
          <Text style={s.price}>$5.99</Text>
        </Pressable>
      )}
    </View>
  );
}

function Meta({ children, free }: { children: React.ReactNode; free?: boolean }) {
  return (
    <View style={[s.pill, free && s.pillFree]}>
      <Text style={[s.pillTxt, free && { color: C.coralDeep }]}>{children}</Text>
    </View>
  );
}

function CardView({ card, unlocked, onUnlock }: { card: Card; unlocked: boolean; onUnlock: () => void }) {
  const open = unlocked || !!card.is_free_sample;
  return (
    <View style={[s.card, card.is_free_sample && s.freeCard]}>
      <View style={s.cardTop}>
        <View style={s.cardIc}><Text style={{ fontSize: 23 }}>{card.icon ?? '✨'}</Text></View>
        <View style={{ flex: 1 }}>
          {card.is_free_sample && <Text style={s.freeTag}>★ FREE SAMPLE</Text>}
          <Text style={s.cardTitle}>{card.title_en}</Text>
        </View>
      </View>
      <Text style={s.cardIntro}>{card.free_intro_en}</Text>
      {open ? (
        <View style={s.reveal}>
          <Text style={s.lede}>— WHAT THE LOCALS KNOW</Text>
          <Text style={s.revealTxt}>{card.paid_reveal_en}</Text>
        </View>
      ) : (
        <Pressable style={s.sealed} onPress={onUnlock}>
          <View style={s.seal}><Text style={s.sealTxt}>秘</Text></View>
          <View style={s.unlockPill}><Text style={s.unlockPillTxt}>🔓 Unlock the local's version</Text></View>
          <Text style={s.sealHint}>Free: the guidebook · Unlocked: the local who lives here</Text>
        </Pressable>
      )}
    </View>
  );
}

function Sister({ area }: { area: Area }) {
  const d = DIALECT[area.id];
  if (!d) return null;
  return (
    <View style={s.sister}>
      <Text style={s.sisterKick}>NANI?! FAMILY · SISTER APP</Text>
      <Text style={s.sisterH}>Want to sound like you belong in {area.name_en}?</Text>
      <View style={s.dia}><Text style={s.diaJp}>{d.jp}</Text><Text style={s.diaEn}>{d.en}</Text></View>
      <Text style={s.sisterP}>{d.line} <Text style={{ color: '#fff', fontFamily: F.bodyBold }}>Nani?! Japanese</Text> teaches the fun, weird, real Japanese textbooks skip.</Text>
      <View style={s.sisterRow}>
        <View style={s.appicon}><Text style={s.appiconTxt}>なに</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.sisterMetaB}>Nani?! Japanese</Text>
          <Text style={s.sisterMetaS}>Free · Education · iPhone</Text>
        </View>
        <Pressable style={s.get} onPress={() => Linking.openURL(APPSTORE_SISTER)}>
          <Text style={s.getTxt}>Get it ↗</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 16, paddingBottom: 11, backgroundColor: C.washi, borderBottomWidth: 1, borderBottomColor: C.beige2 },
  back: { backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 13 },
  backTxt: { fontFamily: F.bodyHeavy, fontSize: 13, color: C.taupeDeep },
  tbName: { fontFamily: F.bodyHeavy, fontSize: 14.5, color: C.ink },
  tbJp: { fontFamily: F.bodyBold, fontSize: 12, color: C.coral },
  hero: { position: 'relative', paddingHorizontal: 22, paddingTop: 26, paddingBottom: 22, backgroundColor: C.washi2, borderBottomWidth: 1, borderBottomColor: C.beige2, overflow: 'hidden' },
  heroKanji: { position: 'absolute', right: -8, top: 0, fontFamily: F.bodyHeavy, fontSize: 150, lineHeight: 150, color: C.coral, opacity: 0.08 },
  heroEyebrow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  idx: { fontFamily: F.display, fontSize: 15, color: C.coral, letterSpacing: -0.4 },
  reg: { fontFamily: F.bodyHeavy, fontSize: 10.5, letterSpacing: 1.4, color: C.taupeDeep },
  regJp: { fontFamily: F.bodyBold, color: C.coral },
  h2: { fontFamily: F.display, fontSize: 44, color: C.ink, letterSpacing: -1.7, marginTop: 4, marginBottom: 10 },
  tagline: { fontFamily: F.body, fontSize: 15, lineHeight: 24, color: C.inkSoft, maxWidth: 330 },
  metaRow: { flexDirection: 'row', gap: 7, marginTop: 16, flexWrap: 'wrap' },
  pill: { backgroundColor: 'rgba(255,255,255,0.75)', borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  pillFree: { backgroundColor: C.coralSoft, borderColor: '#FFD3DC' },
  pillTxt: { fontFamily: F.bodyBold, fontSize: 11, color: C.taupeDeep },
  eatStrip: { paddingTop: 20 },
  eyebrow: { fontFamily: F.bodyHeavy, fontSize: 10.5, letterSpacing: 1.8, color: C.taupe, paddingHorizontal: 22 },
  eatChip: { width: 156, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 14 },
  eatLb: { fontFamily: F.bodyHeavy, fontSize: 14, color: C.ink, marginTop: 9, marginBottom: 4 },
  eatBl: { fontFamily: F.body, fontSize: 12, lineHeight: 17, color: C.taupe },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 22, paddingTop: 24, paddingBottom: 2 },
  sectionTag: { fontFamily: F.bodyHeavy, fontSize: 11, letterSpacing: 1.8, color: C.taupe },
  stamp: { fontFamily: F.bodyHeavy, fontSize: 9.5, color: '#fff', backgroundColor: C.coral, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8, overflow: 'hidden' },
  rule: { flex: 1, height: 1, backgroundColor: C.line },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 24, marginHorizontal: 18, marginTop: 14, padding: 18, shadowColor: '#15130F', shadowOpacity: 0.08, shadowRadius: 22, shadowOffset: { width: 0, height: 12 }, elevation: 2 },
  freeCard: { borderColor: '#FFD8E0' },
  cardTop: { flexDirection: 'row', gap: 13, alignItems: 'flex-start' },
  cardIc: { width: 46, height: 46, borderRadius: 15, backgroundColor: C.beige2, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  freeTag: { fontFamily: F.bodyHeavy, fontSize: 10, letterSpacing: 1, color: '#fff', backgroundColor: C.coral, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8, alignSelf: 'flex-start', marginBottom: 7, overflow: 'hidden' },
  cardTitle: { fontFamily: F.bodyHeavy, fontSize: 17, lineHeight: 24, color: C.ink },
  cardIntro: { fontFamily: F.body, fontSize: 14.5, lineHeight: 25, color: C.inkSoft, marginTop: 11 },
  reveal: { backgroundColor: '#FBF6EA', borderWidth: 1, borderColor: C.goldSoft, borderRadius: 16, padding: 15, marginTop: 13 },
  lede: { fontFamily: F.bodyHeavy, fontSize: 10.5, letterSpacing: 1.6, color: C.gold, marginBottom: 8 },
  revealTxt: { fontFamily: F.body, fontSize: 14.5, lineHeight: 25, color: C.ink },
  sealed: { alignItems: 'center', justifyContent: 'center', gap: 11, backgroundColor: '#FBF6EA', borderWidth: 1, borderColor: C.goldSoft, borderRadius: 16, paddingVertical: 26, marginTop: 13 },
  seal: { width: 58, height: 58, borderRadius: 29, borderWidth: 2.5, borderColor: C.coral, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-9deg' }] },
  sealTxt: { fontFamily: F.bodyHeavy, fontSize: 26, color: C.coral },
  unlockPill: { backgroundColor: C.ink, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 19 },
  unlockPillTxt: { fontFamily: F.bodyHeavy, fontSize: 13, color: '#fff' },
  sealHint: { fontFamily: F.bodyBold, fontSize: 10.5, color: C.taupeDeep, textAlign: 'center', paddingHorizontal: 20 },
  sister: { marginHorizontal: 18, marginTop: 26, borderRadius: 24, backgroundColor: '#221F19', padding: 18 },
  sisterKick: { fontFamily: F.bodyHeavy, fontSize: 10, letterSpacing: 2, color: C.gold },
  sisterH: { fontFamily: F.bodyHeavy, fontSize: 18, color: '#fff', lineHeight: 25, marginTop: 7 },
  dia: { flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)', borderRadius: 999, paddingVertical: 5, paddingHorizontal: 12, marginVertical: 8 },
  diaJp: { fontFamily: F.bodyHeavy, fontSize: 13, color: '#fff' },
  diaEn: { fontFamily: F.bodyBold, fontSize: 11.5, color: '#C9C2B2' },
  sisterP: { fontFamily: F.body, fontSize: 13.5, lineHeight: 21, color: '#C9C2B2', marginBottom: 14 },
  sisterRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  appicon: { width: 46, height: 46, borderRadius: 12, backgroundColor: C.coralDeep, alignItems: 'center', justifyContent: 'center' },
  appiconTxt: { fontFamily: F.bodyHeavy, fontSize: 17, color: '#fff' },
  sisterMetaB: { fontFamily: F.bodyHeavy, fontSize: 14, color: '#fff' },
  sisterMetaS: { fontFamily: F.bodyBold, fontSize: 11.5, color: '#9b9484' },
  get: { backgroundColor: '#fff', borderRadius: 999, paddingVertical: 11, paddingHorizontal: 17 },
  getTxt: { fontFamily: F.bodyHeavy, fontSize: 13.5, color: C.ink },
  paybar: { position: 'absolute', left: 14, right: 14, bottom: 0, backgroundColor: C.ink, borderRadius: 22, paddingVertical: 14, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#15130F', shadowOpacity: 0.22, shadowRadius: 30, shadowOffset: { width: 0, height: 14 }, elevation: 8 },
  paybarT1: { fontFamily: F.bodyHeavy, fontSize: 15, color: '#fff' },
  paybarT2: { fontFamily: F.bodyBold, fontSize: 11.5, color: '#c3bcab', marginTop: 2 },
  price: { fontFamily: F.bodyHeavy, fontSize: 14.5, color: '#fff', backgroundColor: C.coral, borderRadius: 13, paddingVertical: 9, paddingHorizontal: 14, overflow: 'hidden' },
});
