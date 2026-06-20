import { describe, it, expect } from 'vitest';
import { AREAS, byId, TOKYO_WARDS, KANSAI_CITIES, DIALECT } from '../lib/content';

describe('bundled content integrity', () => {
  it('has 10 areas, all with unique ids', () => {
    expect(AREAS.length).toBe(10);
    expect(new Set(AREAS.map((a) => a.id)).size).toBe(10);
  });

  it('every Tokyo ward + Kansai city resolves', () => {
    [...TOKYO_WARDS, ...KANSAI_CITIES].forEach((id) => {
      expect(byId[id], id).toBeTruthy();
    });
  });

  for (const a of AREAS) {
    describe(a.id, () => {
      it('has a tagline + >=3 cards', () => {
        expect(a.header.tagline_en.length).toBeGreaterThan(0);
        expect(a.cards.length).toBeGreaterThanOrEqual(3);
      });
      it('has free samples (>=1) and lived cards (>=2)', () => {
        expect(a.cards.filter((c) => c.is_free_sample).length).toBeGreaterThanOrEqual(1);
        expect(a.cards.filter((c) => c.layer === 'lived').length).toBeGreaterThanOrEqual(2);
      });
      it('every card has the fields the UI renders', () => {
        a.cards.forEach((c) => {
          expect(c.title_en, c.id).toBeTruthy();
          expect(c.free_intro_en, c.id).toBeTruthy();
          expect(c.paid_reveal_en, c.id).toBeTruthy();
          expect(['culture', 'eat', 'off_guidebook']).toContain(c.section);
        });
      });
      it('has a sister-app dialect mapping', () => {
        expect(DIALECT[a.id], a.id).toBeTruthy();
      });
    });
  }
});
