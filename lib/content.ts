/**
 * Nani?! Japan — bundled content (10 areas, 97 cards).
 * Static JSON imports are inlined by Metro, so the app works fully offline.
 * Source of truth: generated/nani-japan/content/*.json (validated by the pipeline).
 */
import kanda from './content/kanda.json';
import shibuya from './content/shibuya.json';
import asakusa from './content/asakusa.json';
import shinjuku from './content/shinjuku.json';
import akihabara from './content/akihabara.json';
import harajuku from './content/harajuku.json';
import ueno from './content/ueno.json';
import kyoto from './content/kyoto.json';
import osaka from './content/osaka.json';
import nara from './content/nara.json';

export type Card = {
  id: string;
  section: 'culture' | 'eat' | 'off_guidebook';
  icon?: string;
  title_en: string;
  free_intro_en: string;
  paid_reveal_en: string;
  layer: 'guidebook' | 'lived';
  is_food?: boolean;
  is_free_sample?: boolean;
  sources?: string[];
  factcheck?: string;
};
export type EatItem = { icon: string; label_en: string; blurb_en: string };
export type Area = {
  id: string;
  name_en: string;
  name_ja: string;
  prefecture: string;
  tier: 'prefecture' | 'ward';
  header: { tagline_en: string };
  eat_quicklist?: EatItem[];
  cards: Card[];
  meta?: Record<string, unknown>;
};

// Display order (matches the prototype / map № index).
export const AREAS: Area[] = [
  kanda, shibuya, asakusa, shinjuku, akihabara, harajuku, ueno, kyoto, osaka, nara,
] as unknown as Area[];

export const byId: Record<string, Area> = Object.fromEntries(AREAS.map((a) => [a.id, a]));

export const TOKYO_WARDS = ['asakusa', 'shibuya', 'shinjuku', 'akihabara', 'harajuku', 'ueno', 'kanda'];
export const KANSAI_CITIES = ['kyoto', 'osaka', 'nara'];

export const SECTION_LABEL: Record<Card['section'], string> = {
  culture: 'Culture & quirks',
  eat: 'Eat like a local',
  off_guidebook: 'Off the guidebook',
};

export const totalSecrets = AREAS.reduce((s, a) => s + a.cards.length, 0);

export function areaIndex(id: string): string {
  return String(AREAS.findIndex((a) => a.id === id) + 1).padStart(2, '0');
}
export function regionOf(id: string): string {
  if (TOKYO_WARDS.includes(id)) return 'Greater Tokyo';
  if (KANSAI_CITIES.includes(id)) return 'Kansai';
  return 'Japan';
}

// place -> matching dialect/slang pack in the sister app "Nani?! Japanese"
export const DIALECT: Record<string, { jp: string; en: string; line: string }> = {
  kanda: { jp: '江戸言葉', en: 'Edo-era speech', line: 'Kanda was the beating heart of old Edo. Hear how Tokyo actually talked before it was Tokyo.' },
  asakusa: { jp: '江戸言葉', en: 'Edo-era speech', line: 'Asakusa is old Edo with its shirt off — the speech to match is in the sister app.' },
  ueno: { jp: '江戸言葉', en: 'Edo-era speech', line: 'Shitamachi Ueno runs on old-Tokyo grit — and old-Tokyo slang.' },
  shibuya: { jp: 'ギャル語', en: 'Gyaru & Reiwa slang', line: 'Shibuya literally invents how young Japan talks. Keep up with the slang pack.' },
  harajuku: { jp: 'ギャル語', en: 'Gyaru & Reiwa slang', line: "Harajuku's kawaii crowd has its own dictionary. Decode it." },
  shinjuku: { jp: '令和スラング', en: 'Reiwa youth slang', line: 'Shinjuku at 2am speaks fluent slang. So can you.' },
  akihabara: { jp: 'オタク用語', en: 'Otaku vocabulary', line: "You genuinely can't read Akiba without the otaku dictionary." },
  kyoto: { jp: '関西弁', en: 'Kansai dialect', line: "Kyoto's politeness hides a velvet dagger — learn to hear it in Kansai-ben." },
  osaka: { jp: '関西弁', en: 'Kansai dialect', line: 'Osaka runs on Kansai-ben and rapid-fire jokes. Learn to fire one back.' },
  nara: { jp: '関西弁', en: 'Kansai dialect', line: 'Nara speaks Kansai too — even the deer judge your accent.' },
};

export const APPSTORE_SISTER = 'https://apps.apple.com/us/app/nani-japanese/id6777648525';
