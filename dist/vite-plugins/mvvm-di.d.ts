type VitePluginLike = {
    name: string;
    enforce?: "pre" | "post";
    configResolved?(resolved: {
        root?: string;
    }): void;
    buildStart?(): void | Promise<void>;
    handleHotUpdate?(ctx: {
        file: string;
    }): void | Promise<void>;
};
/**
 * Vite-плагин для автоматического обновления container.d.ts и di.d.ts
 * на основе сервисов, отмеченных декоратором Service.
 *
 * Плагин сканирует исходники и добавляет типы сервисов в ближайший container.d.ts,
 * а также подключает контейнеры к di.d.ts проекта.
 *
 * @example
 * // vite.config.ts
 * import { mvvmServiceDiPlugin } from "mvvm-tools/vite-plugins/mvvm-di";
 *
 * export default defineConfig({
 *   plugins: [mvvmServiceDiPlugin()],
 * });
 */
export declare function mvvmServiceDiPlugin(): VitePluginLike;
export {};
