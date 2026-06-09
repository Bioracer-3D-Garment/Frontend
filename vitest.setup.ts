import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// React Testing Library auto-cleanup after each test.
afterEach(() => {
  cleanup();
});

// jsdom does not implement these — components touch them indirectly.
if (!('createObjectURL' in URL)) {
  // @ts-expect-error - jsdom stub
  URL.createObjectURL = vi.fn(() => 'blob:mock');
}
if (!('revokeObjectURL' in URL)) {
  // @ts-expect-error - jsdom stub
  URL.revokeObjectURL = vi.fn();
}
