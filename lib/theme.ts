// Nani?! Japan — design tokens (inherited from the Nani?! family / prototype).
export const C = {
  washi: '#FFFDF7',
  washi2: '#FBF6EA',
  ink: '#15130F',
  inkSoft: '#3A352B',
  coral: '#FF4D6D',
  coralDeep: '#E83A59',
  coralSoft: '#FFE9EE',
  taupe: '#79735F', // AA-safe on washi (4.66)
  taupeDeep: '#6a6557',
  beige: '#ECE8DC',
  beige2: '#F1EEE4',
  line: '#E7E2D4',
  green: '#16C79A',
  gold: '#C9A227',
  goldSoft: '#F3E6BF',
} as const;

// Font families = @expo-google-fonts export keys (loaded in app/_layout.tsx).
// `mincho` is an iOS system face (no bundling): the kanji tiles read as stamped
// ink rather than UI text, which is what separates this from emoji-badge apps.
export const F = {
  display: 'BricolageGrotesque_800ExtraBold', // brand + headings
  displaySemi: 'BricolageGrotesque_700Bold',
  body: 'LINESeedJP_400Regular',
  bodyBold: 'LINESeedJP_700Bold',
  bodyHeavy: 'LINESeedJP_800ExtraBold',
  mincho: 'HiraMinProN-W6',
} as const;

/** Icon language = the app's own signature (hanko + kanji), never emoji. */
export const SECTION_KANJI: Record<string, string> = {
  culture: '文',
  eat: '食',
  off_guidebook: '秘',
};
