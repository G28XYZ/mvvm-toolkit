import { FC } from "react";

export type ViewType<T> = { viewModel?: T };

export type ViewFC<T, P extends Record<string, any> = null> = P extends null ? FC<ViewType<T>> : FC<ViewType<T> & P>

export type ViewProps<T, P extends Record<string, any> = {}> = ViewType<T> & P;

/**
 * Базовый класс ViewModel с методами жизненного цикла.
 */
export class ViewModel {
  /**
   * Вызывается при маунте компонента.
   */
  onInit?(): void | Promise<void>;
  /**
   * Вызывается при размонтировании компонента.
   */
  onDispose?(): void | Promise<void>;
}
