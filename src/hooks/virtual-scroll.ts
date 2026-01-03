import { action, makeObservable, observable } from "mobx";
import { RefObject, useEffect, useMemo } from "react";

export type VirtualSlice<T> = {
  total: number;
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  visibleItems: T[];
};

export class VirtualScroll {
  @observable accessor scrollTop = 0;
  @observable accessor viewportHeight = 0;

  private overscan: number;
  rowHeight: number;

  constructor({ rowHeight, overscan = 0 }: { rowHeight: number; overscan?: number }) {
    this.rowHeight = rowHeight > 0 ? rowHeight : 1;
    this.overscan = Math.max(0, overscan);

    makeObservable(this);
  }

  @action.bound setScrollTop(value: number) {
    this.scrollTop = Math.max(0, value);
  }

  @action.bound setViewportHeight(value: number) {
    this.viewportHeight = Math.max(0, value);
  }

  @action.bound updateMetrics(scrollTop: number, viewportHeight: number) {
    this.scrollTop = Math.max(0, scrollTop);
    this.viewportHeight = Math.max(0, viewportHeight);
  }

  setRowHeight(rowHeight: number) {
    this.rowHeight = rowHeight > 0 ? rowHeight : 1;
  }

  setOverscan(overscan: number) {
    this.overscan = Math.max(0, overscan);
  }

  getSlice<T>(items: T[]): VirtualSlice<T> {
    const total = items.length;
    const rowHeight = this.rowHeight > 0 ? this.rowHeight : 1;
    const scrollTop = Math.max(0, this.scrollTop);
    const viewportHeight = Math.max(0, this.viewportHeight);
    const overscan = Math.max(0, this.overscan);
    const totalHeight = total * rowHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const endIndex = Math.min(total, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan);
    const visibleItems = items.slice(startIndex, endIndex);

    return { total, totalHeight, startIndex, endIndex, visibleItems };
  }
}

type VirtualScrollOptions = {
  targetRef: RefObject<HTMLElement>;
  rowHeight: number;
  overscan?: number;
};

export const useVirtualScroller = ({ overscan = 0, rowHeight, targetRef }: VirtualScrollOptions) => {
  const scroller = useMemo(() => new VirtualScroll({ rowHeight, overscan }), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cleanup: (() => void) | null = null;
    let frameId: number | null = null;
    let active = true;

    const attach = (container: HTMLElement) => {
      const handleScroll = () => scroller.setScrollTop(container.scrollTop);
      const handleResize = () => scroller.setViewportHeight(container.clientHeight);

      scroller.updateMetrics(container.scrollTop, container.clientHeight);
      container.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleResize);

      cleanup = () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    };

    const tryAttach = () => {
      if (!active) return;
      const container = targetRef.current;
      if (container) {
        attach(container);
        return;
      }
      frameId = window.requestAnimationFrame(tryAttach);
    };

    tryAttach();

    return () => {
      active = false;
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      if (cleanup) cleanup();
    };
  }, [scroller, targetRef]);

  useEffect(() => {
    scroller.setRowHeight(rowHeight);
  }, [scroller, rowHeight]);

  useEffect(() => {
    scroller.setOverscan(overscan);
  }, [scroller, overscan]);

  return scroller;
};
