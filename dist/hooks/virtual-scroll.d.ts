import { RefObject } from "react";
export type VirtualSlice<T> = {
    total: number;
    totalHeight: number;
    startIndex: number;
    endIndex: number;
    visibleItems: T[];
};
export declare class VirtualScroll {
    accessor scrollTop: number;
    accessor viewportHeight: number;
    private overscan;
    rowHeight: number;
    constructor({ rowHeight, overscan }: {
        rowHeight: number;
        overscan?: number;
    });
    setScrollTop(value: number): void;
    setViewportHeight(value: number): void;
    updateMetrics(scrollTop: number, viewportHeight: number): void;
    setRowHeight(rowHeight: number): void;
    setOverscan(overscan: number): void;
    getSlice<T>(items: T[]): VirtualSlice<T>;
}
type VirtualScrollOptions = {
    targetRef: RefObject<HTMLElement>;
    rowHeight: number;
    overscan?: number;
};
export declare const useVirtualScroller: ({ overscan, rowHeight, targetRef }: VirtualScrollOptions) => VirtualScroll;
export {};
