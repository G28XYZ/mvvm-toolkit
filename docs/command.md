---
layout: default
title: Command и asyncCommand
permalink: /command/
---

# Command и asyncCommand

`asyncCommand` оборачивает async-операцию в наблюдаемый объект и избавляет ViewModel от ручного управления `isLoading`, `try/catch` и повторных кликов. `flowCommand` делает то же самое, но через `mobx.flow` (удобно при `enforceActions: "always"`).

## Базовый пример

```ts
import { Service, asyncCommand } from "rvm-toolkit";
import { UserModel } from "./UserModel";

@Service
class UserVM {
  model = new UserModel({ id: 1, name: "Alice", token: "secret" });

  save = asyncCommand(async (signal?: AbortSignal) => {
    const payload = this.model.service.dumpData;
    // await api.save(payload, { signal })
    this.model.service.commit();
  }, {
    abortable: true,
    concurrency: "restart",
    canExecute: () => {
      const v = this.model.service.validation;
      return this.model.service.dirty && !v.name;
    }
  });

  onDispose() {
    this.save.dispose?.();
  }
}
```

## flowCommand

`flowCommand` оборачивает generator через `mobx.flow`, поэтому изменения стейта внутри генератора безопасны в `enforceActions: "always"`.

```ts
import { flowCommand } from "rvm-toolkit";

const load = flowCommand(function* () {
  const data = yield api.load();
  items.replace(data);
});
```

Если нужен `this`, удобнее вынести генератор в метод и вызвать его через стрелку:

```ts
class UserVM {
  private *loadImpl() {
    const data = yield api.load();
    this.items = data;
  }

  load = flowCommand(() => this.loadImpl());
}
```

## Пример в View

```tsx
<button
  disabled={!viewModel.save.canExecute}
  onClick={viewModel.save.execute}
>
  {viewModel.save.isExecuting ? "Saving..." : "Save"}
</button>

{viewModel.save.error ? <div>Ошибка сохранения</div> : null}
```

## Интерфейс команды

```ts
export interface ICommand<TArgs extends any[] = [], TResult = void> {
  execute: (...args: TArgs) => Promise<TResult>;
  readonly canExecute: boolean;
  readonly state: string;
  readonly states: Record<string, string>;
  readonly isExecuting: boolean;
  readonly activeCount: number;
  readonly isCanceled: boolean;
  readonly isDisposed: boolean;
  readonly error: unknown;
  resetError: () => void;
  cancel?: () => void;
  dispose?: () => void;
  clearQueue?: () => void;
}
```

## Результат и ошибки

`execute` возвращает `Promise<TResult>`, но при `swallowError: true` (по умолчанию) тип становится `Promise<TResult | undefined>`, так как ошибка не пробрасывается наружу, а `execute` может резолвиться в `undefined` (если `TResult` не `void`). Чтобы ловить ошибку снаружи и сохранить строгий `TResult` — укажите `swallowError: false`.

`error` заполняется только если `trackError: true` (по умолчанию). По умолчанию ошибка автоматически сбрасывается при новом запуске; это можно отключить через `resetErrorOnExecute: false`. Ручной сброс — через `resetError()`. Так же можно использовать `onError` для логирования/тостов.

## Опции

- `canExecute`: computed-предикат, получает scope с `state`, `states`, `isExecuting`, `activeCount`, `isCanceled`, `isDisposed`, `error`.
- `onError`: хук для логирования или централизованных тостов.
- `onCancel`: хук при отмене (например, чтобы прервать пользовательские операции).
- `onStart`: хук перед запуском, получает аргументы `execute`.
- `onSuccess`: хук при успешном завершении, получает `(result, ...args)`.
- `onFinally`: хук после завершения, получает `({ ok, canceled, error }, ...args)`.
- `concurrency`: `ignore` | `restart` | `queue` | `parallel`.
- `trackError`: писать ошибку в `error` (по умолчанию true).
- `resetErrorOnExecute`: автоматически очищать `error` при новом запуске (по умолчанию true).
- `swallowError`: не бросать ошибку наружу (по умолчанию true).
- `abortable`: если true, в `execute` добавляется `AbortSignal` как последний аргумент.
- `cancelQueued`: при `cancel()` сбрасывать очередь (актуально для `queue`).
- `queueLimit`: лимит количества ожидающих запусков в `queue`, лишние вызовы игнорируются.
- `states`: карта состояний, по умолчанию `{ load: "load", failure: "failure", ready: "ready" }`.
- `stateKeys`: позволяет использовать другой ключ для `load`/`failure`/`ready` в `states`.

## canExecute и scope

`canExecute` получает scope: `{ state, states, isExecuting, activeCount, isCanceled, isDisposed, error }`. Это удобно для блокировок по состоянию или ошибке:

```ts
const cmd = asyncCommand(loadData, {
  canExecute: ({ state, states, activeCount, error }) => state === states.ready && !error && activeCount === 0,
});
```

Обратите внимание: для `concurrency: "ignore"` команда сама блокируется на время выполнения. Для остальных режимов блокировку можно настроить через `canExecute`.

## Хуки выполнения

```ts
const save = asyncCommand(saveUser, {
  onStart: (id: string) => console.info("start", id),
  onSuccess: (result, id) => console.info("success", result, id),
  onFinally: ({ ok, canceled, error }, id) => {
    console.info("done", { ok, canceled, error, id });
  },
});
```

`onSuccess` вызывается только при успешном выполнении без отмены. Если команда была отменена (`cancel()` или `AbortSignal`), `canceled: true`, `ok: false`.

## Состояния

`state` возвращает одно из значений `states`:

- `load` — команда выполняется.
- `failure` — есть ошибка.
- `ready` — команда свободна.

`state` вычисляется из `isExecuting` и `error`. Если нужно сбросить `failure`, вызовите `resetError()`.

Пример переопределения значений (ключи остаются `load/failure/ready`):

```ts
const save = asyncCommand(saveUser, {
  states: { load: "saving", ready: "idle", failure: "error" },
});

save.state === save.states.load; // true, когда выполняется
```

Если вы меняете именно ключи (например, хотите `saving` вместо `load`), используйте `stateKeys`:

```ts
const states = { saving: "saving", ready: "idle", failure: "error" } as const;

const save = asyncCommand<[], void, typeof states>(saveUser, {
  states,
  stateKeys: { load: "saving" },
});

save.state === save.states.saving; // true, когда выполняется
```

Пример проверки состояния в `canExecute`:

```ts
const cmd = asyncCommand(loadData, {
  concurrency: "parallel",
  canExecute: ({ state, states }) => state === states.ready,
});
```

## AbortSignal и cancel

Если `abortable: true`, в `execute` добавляется `AbortSignal` как последний аргумент:

```ts
const cmd = asyncCommand(async (id: string, signal?: AbortSignal) => {
  const response = await fetch(`/api/${id}`, { signal });
  return response.json();
}, { abortable: true });
```

`cancel()` вызывает `AbortController.abort()` для всех активных запусков и `onCancel`, если он задан. В режиме `restart` отмена выполняется автоматически перед новым запуском.

## MobX strict mode

Если включен `enforceActions: "always"`, изменения observable после `await` нужно оборачивать в `runInAction`.

```ts
import { runInAction } from "mobx";

const cmd = asyncCommand(async () => {
  await api.load();
  runInAction(() => {
    model.value = "ok";
  });
});
```

Можно использовать `flowCommand` или helper `commandAction`:

```ts
import { commandAction, flowCommand } from "rvm-toolkit";

const apply = commandAction((value: string) => {
  model.value = value;
});

const cmd = asyncCommand(async () => {
  const value = await api.load();
  apply(value);
});

const flow = flowCommand(function* () {
  const value = yield api.load();
  model.value = value;
});
```

## Конкурентность

- `ignore`: пока выполняется — новые вызовы игнорируются и возвращают текущий промис.
- `restart`: новый вызов отменяет текущий и стартует заново.
- `queue`: последовательная очередь вызовов, ошибки не ломают очередь.
- `parallel`: все вызовы выполняются параллельно, `isExecuting` true пока есть активные.

## Отмена и очистка

Если `abortable: true`, команда создаёт `AbortController`. Вызов `cancel()` отменяет активные запросы, `dispose()` отменяет и делает команду недоступной: `canExecute` становится `false`, а `execute()` резолвится в `undefined`.

Для `queue` доступны:

- `clearQueue()` — сбросить ожидающие (не начавшиеся) вызовы.
- `cancelQueued: true` — автоматически очищать очередь при `cancel()` (и всегда при `dispose()`).

Дополнительно:

- `isCanceled` выставляется при `cancel()` и при прерывании через `AbortSignal`.
- `isDisposed` выставляется при `dispose()` и остаётся true.
- `isCanceled` сбрасывается при новом запуске.
