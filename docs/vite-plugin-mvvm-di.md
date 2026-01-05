---
layout: default
title: Vite-плагин mvvm-di
permalink: /vite-plugin-mvvm-di/
---

# Vite-плагин mvvm-di

Плагин автоматически создает/обновляет файлы `container.d.ts` и `di.d.ts` для корректной типизации DI.

## Установка

Добавьте плагин в `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import { mvvmServiceDiPlugin } from "rvm-toolkit/vite-plugins";

export default defineConfig({
  plugins: [mvvmServiceDiPlugin()],
});
```

## Как работает

- Ищет классы с декоратором `@Service` (из `rvm-toolkit`).
- Добавляет типы в ближайший `container.d.ts` (рядом с модулем).
- Добавляет контейнеры в `di.d.ts` проекта.
- Если `di.d.ts` отсутствует — создает его на старте.

## Пример

```ts
// src/modules/users/service.ts
import { Service } from "rvm-toolkit";

@Service("UsersService")
export class UsersService {}
```

После запуска Vite:

```ts
// src/modules/users/container.d.ts
import type { UsersService } from "./service";

export interface UsersServices {
  UsersService: typeof UsersService;
}
```

```ts
// di.d.ts
import type { UsersServices } from "./src/modules/users/container";

declare module "rvm-toolkit" {
  interface DiServices extends UsersServices {}
}
```

Теперь типы DI доступны через `GetService`/`InjectType`:

```ts
import { GetService, type InjectType } from "rvm-toolkit";

const service = GetService("UsersService", "instance");
const typed: InjectType<"UsersService"> = service;
```

## Примечания

- Для корректной типизации `DiServices` убедитесь, что `di.d.ts` включен в `tsconfig.json` проекта.
- Плагин использует `typescript` как внешнюю зависимость (не бандлится).
