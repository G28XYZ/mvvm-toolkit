# DevTools

Для отладки состояния можно подключить Redux DevTools Extension. В dev-режиме модели и сторы будут автоматически подключаться к devtools, если один раз выставить флаг.

## Включение

```ts
// src/devtools.ts
const isDev = typeof import.meta !== "undefined" && Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV);
const globalAny = globalThis as { __MVVM_DEVTOOLS_AUTO__?: boolean };
globalAny.__MVVM_DEVTOOLS_AUTO__ = isDev;
```

Импортируйте файл один раз при старте приложения:

```ts
import "./devtools";
```

## Переопределение на уровне модели/стора

```ts
new UserModel(data, { devtools: { name: "UserModel", enabled: true } });

@Store({ id: "UsersStore", devtools: { name: "UsersStore", enabled: true } })
class UsersStore extends StoreBase<UserModel> {}
```
