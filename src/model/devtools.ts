import { reaction, runInAction } from "mobx";
import type { Model } from ".";

type DevtoolsState<T> = {
  data: Partial<T>;
  historyIndex: number;
};

type DevtoolsMessage = {
  type: string;
  payload?: { type?: string };
  state?: string;
};

type DevtoolsConnection = {
  init(state: any): void;
  send(action: any, state: any): void;
  subscribe(listener: (message: DevtoolsMessage) => void): (() => void) | void;
  unsubscribe?: () => void;
  disconnect?: () => void;
};

type DevtoolsExtension = {
  connect(options?: { name?: string; instanceId?: string }): DevtoolsConnection;
};

type DevtoolsOptions = {
  name?: string;
  actionType?: string;
  instanceId?: string;
};

const getDevtools = (): DevtoolsExtension | null => {
  const globalAny = globalThis as unknown as { __REDUX_DEVTOOLS_EXTENSION__?: DevtoolsExtension };
  return globalAny.__REDUX_DEVTOOLS_EXTENSION__ ?? null;
};

const getDevtoolsApplyDepth = () => {
  const globalAny = globalThis as unknown as { __MVVM_DEVTOOLS_APPLYING__?: number };
  return globalAny.__MVVM_DEVTOOLS_APPLYING__ ?? 0;
};

const withDevtoolsApplying = <T>(fn: () => T): T => {
  const globalAny = globalThis as unknown as { __MVVM_DEVTOOLS_APPLYING__?: number };
  globalAny.__MVVM_DEVTOOLS_APPLYING__ = (globalAny.__MVVM_DEVTOOLS_APPLYING__ ?? 0) + 1;
  try {
    return fn();
  } finally {
    globalAny.__MVVM_DEVTOOLS_APPLYING__ = Math.max(0, (globalAny.__MVVM_DEVTOOLS_APPLYING__ ?? 1) - 1);
  }
};

const isDevtoolsApplying = () => getDevtoolsApplyDepth() > 0;

const getModelState = <T>(model: Model<T>): DevtoolsState<T> => ({
  data: model.service.dumpData,
  historyIndex: model.service.historyIndex,
});

/**
 * Подключить модель к Redux DevTools Extension для просмотра и тайм-тревела.
 */
export const attachModelDevtools = <T>(model: Model<T>, options: DevtoolsOptions = {}) => {
  const devtools = getDevtools();
  if (!devtools) return () => {};

  const connection = devtools.connect({ name: options.name, instanceId: options.instanceId });
  let isApplyingDevtools = false;
  try {
    connection.init(getModelState(model));
  } catch {
    // ignore init errors
  }

  const disposeReaction = reaction(
    () => getModelState(model),
    (state) => {
      if (isApplyingDevtools || isDevtoolsApplying()) return;
      try {
        connection.send({ type: options.actionType ?? "model:update" }, state);
      } catch {
        // ignore send errors
      }
    }
  );

  const unsubscribe = connection.subscribe((message) => {
    if (message.type !== "DISPATCH") return;

    const actionType = message.payload?.type;

    if (actionType === "RESET") {
      isApplyingDevtools = true;
      withDevtoolsApplying(() => {
        try {
          model.service.toInit();
        } finally {
          isApplyingDevtools = false;
        }
      });
      return;
    }

    if (actionType === "COMMIT") {
      isApplyingDevtools = true;
      withDevtoolsApplying(() => {
        try {
          model.service.commit();
        } finally {
          isApplyingDevtools = false;
        }
      });
      return;
    }

    if (actionType === "ROLLBACK") {
      isApplyingDevtools = true;
      withDevtoolsApplying(() => {
        try {
          model.service.toInit();
        } finally {
          isApplyingDevtools = false;
        }
      });
      return;
    }

    if (actionType === "JUMP_TO_ACTION" || actionType === "JUMP_TO_STATE") {
      if (!message.state) return;

      try {
        const parsed = JSON.parse(message.state) as Partial<DevtoolsState<T>> | Partial<T>;
        const historyIndex = (parsed as DevtoolsState<T>).historyIndex;
        const history = model.service.history;
        const hasHistory = Array.isArray(history) && history.length > 0;
        const canGoToHistory =
          typeof historyIndex === "number" &&
          ((historyIndex === -1 && hasHistory) || (historyIndex >= 0 && hasHistory && historyIndex < history.length));

        isApplyingDevtools = true;
        withDevtoolsApplying(() => {
          try {
            if (canGoToHistory) {
              model.service.goToHistory(historyIndex);
              return;
            }

            const data = (parsed as DevtoolsState<T>).data ?? parsed;
            runInAction(() => {
              model.service.loadData(data as Partial<T>);
            });
          } finally {
            isApplyingDevtools = false;
          }
        });
      } catch {
        // ignore malformed state
      }
    }
  });

  return () => {
    disposeReaction();
    if (typeof unsubscribe === "function") unsubscribe();
    if (typeof connection.unsubscribe === "function") connection.unsubscribe();
    if (typeof connection.disconnect === "function") connection.disconnect();
  };
};
