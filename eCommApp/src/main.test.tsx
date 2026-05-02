import { beforeEach, describe, expect, it, vi } from 'vitest';

const renderSpy = vi.fn();
const createRootSpy = vi.fn(() => ({ render: renderSpy }));

vi.mock('react-dom/client', () => ({
  default: {
    createRoot: createRootSpy,
  },
  createRoot: createRootSpy,
}));

vi.mock('./App.tsx', () => ({
  default: () => <div>App Root</div>,
}));

describe('main entrypoint', () => {
  beforeEach(() => {
    vi.resetModules();
    renderSpy.mockClear();
    createRootSpy.mockClear();
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('mounts the app into #root and renders once', async () => {
    await import('./main.tsx');

    expect(createRootSpy).toHaveBeenCalledTimes(1);
    expect(createRootSpy).toHaveBeenCalledWith(document.getElementById('root'));
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
