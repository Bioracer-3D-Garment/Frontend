export interface HighlightedPart {
  text: string;
  highlight: boolean;
}

export function getHighlightedParts(text: string, query: string): HighlightedPart[] {
  if (!query) return [{ text, highlight: false }];

  const highlightedParts: HighlightedPart[] = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return [{ text, highlight: false }];
  }

  if (index > 0) {
    highlightedParts.push({ text: text.substring(0, index), highlight: false });
  }

  highlightedParts.push({ text: text.substring(index, index + query.length), highlight: true });

  if (index + query.length < text.length) {
    highlightedParts.push({ text: text.substring(index + query.length), highlight: false });
  }

  return highlightedParts;
}