// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useVirtualScroller, type VirtualScroll } from "../src/hooks";

type TestProps = {
  rowHeight: number;
  overscan?: number;
  initialScrollTop?: number;
  initialViewportHeight?: number;
};

const setClientHeight = (el: HTMLElement, height: number) => {
  Object.defineProperty(el, "clientHeight", {
    value: height,
    configurable: true,
  });
};

describe("useVirtualScroller", () => {
  let root: Root | null = null;
  let host: HTMLDivElement | null = null;
  let latestScroller: VirtualScroll | null = null;

  const TestComponent = ({
    rowHeight,
    overscan,
    initialScrollTop,
    initialViewportHeight,
  }: TestProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const scroller = useVirtualScroller({ targetRef: ref, rowHeight, overscan });

    useLayoutEffect(() => {
      const container = ref.current;
      if (!container) return;
      if (typeof initialViewportHeight === "number") {
        setClientHeight(container, initialViewportHeight);
      }
      if (typeof initialScrollTop === "number") {
        container.scrollTop = initialScrollTop;
      }
    }, [initialScrollTop, initialViewportHeight]);

    useEffect(() => {
      latestScroller = scroller;
    });

    return <div ref={ref} />;
  };

  beforeAll(() => {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (cb) =>
        window.setTimeout(() => cb(Date.now()), 0);
      window.cancelAnimationFrame = (id) => window.clearTimeout(id);
    }
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root?.unmount();
      });
      root = null;
    }
    if (host) {
      host.remove();
      host = null;
    }
    latestScroller = null;
  });

  const render = async ({ rowHeight, overscan, initialScrollTop, initialViewportHeight }: TestProps) => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);

    await act(async () => {
      root?.render(
        <TestComponent
          rowHeight={rowHeight}
          overscan={overscan}
          initialScrollTop={initialScrollTop}
          initialViewportHeight={initialViewportHeight}
        />
      );
    });

    await act(async () => {
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      });
    });

    const container = host.firstElementChild as HTMLDivElement | null;
    if (!container) throw new Error("Missing container element");

    return container;
  };

  it("читает начальные метрики и реагирует на scroll/resize", async () => {
    const container = await render({
      rowHeight: 10,
      overscan: 1,
      initialScrollTop: 40,
      initialViewportHeight: 120,
    });
    const scroller = latestScroller;

    expect(scroller).toBeTruthy();
    expect(scroller?.scrollTop).toBe(40);
    expect(scroller?.viewportHeight).toBe(120);

    await act(async () => {
      container.scrollTop = 80;
      container.dispatchEvent(new Event("scroll"));
    });
    expect(scroller?.scrollTop).toBe(80);

    await act(async () => {
      setClientHeight(container, 200);
      window.dispatchEvent(new Event("resize"));
    });
    expect(scroller?.viewportHeight).toBe(200);
  });

  it("вычисляет срез с учетом overscan", async () => {
    const container = await render({ rowHeight: 10, overscan: 1 });
    const scroller = latestScroller as VirtualScroll;
    const items = Array.from({ length: 100 }, (_, i) => i);

    await act(async () => {
      container.scrollTop = 30;
      container.dispatchEvent(new Event("scroll"));
      setClientHeight(container, 50);
      window.dispatchEvent(new Event("resize"));
    });

    const slice = scroller.getSlice(items);
    expect(slice.startIndex).toBe(2);
    expect(slice.endIndex).toBe(9);
    expect(slice.total).toBe(100);
    expect(slice.totalHeight).toBe(1000);
    expect(slice.visibleItems).toEqual(items.slice(2, 9));
  });

  it("обновляет rowHeight и overscan при изменении props", async () => {
    const container = await render({ rowHeight: 10, overscan: 0 });
    const scroller = latestScroller as VirtualScroll;
    const items = Array.from({ length: 50 }, (_, i) => i);

    await act(async () => {
      container.scrollTop = 40;
      container.dispatchEvent(new Event("scroll"));
      setClientHeight(container, 80);
      window.dispatchEvent(new Event("resize"));
    });

    await act(async () => {
      root?.render(<TestComponent rowHeight={20} overscan={2} />);
    });

    const slice = scroller.getSlice(items);
    expect(slice.startIndex).toBe(0);
    expect(slice.endIndex).toBe(8);
    expect(slice.totalHeight).toBe(1000);
  });
});
