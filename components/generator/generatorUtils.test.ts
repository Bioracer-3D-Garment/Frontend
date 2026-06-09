import { describe, it, expect } from 'vitest';
import { getHighlightedParts } from './generatorUtils';

describe('getHighlightedParts', () => {
  it('returns the whole text unhighlighted when query is empty', () => {
    expect(getHighlightedParts('Patrick', '')).toEqual([
      { text: 'Patrick', highlight: false },
    ]);
  });

  it('returns the whole text unhighlighted when there is no match', () => {
    expect(getHighlightedParts('Patrick', 'xyz')).toEqual([
      { text: 'Patrick', highlight: false },
    ]);
  });

  it('highlights a match in the middle and keeps surrounding parts', () => {
    expect(getHighlightedParts('Patrick', 'tri')).toEqual([
      { text: 'Pa', highlight: false },
      { text: 'tri', highlight: true },
      { text: 'ck', highlight: false },
    ]);
  });

  it('highlights a match at the start without an empty leading part', () => {
    expect(getHighlightedParts('Patrick', 'Pat')).toEqual([
      { text: 'Pat', highlight: true },
      { text: 'rick', highlight: false },
    ]);
  });

  it('highlights a match at the end without an empty trailing part', () => {
    expect(getHighlightedParts('Patrick', 'ick')).toEqual([
      { text: 'Patr', highlight: false },
      { text: 'ick', highlight: true },
    ]);
  });

  it('matches case-insensitively but preserves the original casing', () => {
    expect(getHighlightedParts('Patrick', 'PAT')).toEqual([
      { text: 'Pat', highlight: true },
      { text: 'rick', highlight: false },
    ]);
  });
});
