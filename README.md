# mvvm-tools

Библиотека для MVVM‑подхода на базе MobX + React. Содержит:

- Model: управление состоянием, валидации, сериализация, откат/коммит.
- Decorators: field/validation/submit/exclude/PropFromView/MakeObservable.
- View: обертка для проброса ViewModel и жизненный цикл onInit/onDispose.
- Vite‑плагин: генерация контейнеров типов для DI.

## Быстрый старт

### 1) Model + decorators

```ts
import { Model, field, validation, submit, exclude } from "mvvm-tools";

interface UserDto {
  id: number;
  name: string;
  token: string;
}

class UserModel extends Model<UserDto> {
  @field
  id = 0;

  @field
  @validation((value) => (value ? "" : "name required"))
  name = "";

  @field
  @exclude(true)
  token = "";

  @field
  @submit((value) => value.trim())
  trimmedName = "";
}

const model = new UserModel({ id: 1, name: "Alice", token: "secret" });
model.name = "";
console.log(model.service.validation.name); // "name required"
console.log(model.service.dumpData); // { id: 1, name: "", trimmedName: "" }
```

### Декораторы полей модели

`@field` — помечает свойство как поле модели и подключает его к `dumpData`, `validation` и механизму изменений.

`@validation(fn)` — вызывает функцию валидации при изменениях поля, результат попадает в `model.service.validation`.

`@submit(fn)` — преобразует значение поля при `dumpData`.

`@exclude(fn|true)` — исключает поле из `dumpData` (условно или всегда).

`@PropFromView(name)` — пробрасывает prop из view в view model (работает в `view`).

`@define_prop` — делает свойство неперечисляемым (по умолчанию).

`@MakeObservable` — автоматически вызывает `makeObservable` в конструкторе.

Пример:

```ts
import { Model, field, validation, submit, exclude, PropFromView } from "mvvm-tools";

class PostModel extends Model<{ title: string; count: number }> {
  @field
  @validation((value) => (value ? "" : "title required"))
  title = "";

  @field
  @submit((value) => Number(value))
  count = 0;

  @field
  @exclude(true)
  internal = "hidden";

  @PropFromView("postId")
  postId = "";
}
```

### Сервис модели (model.service)

`model.service` — публичный API для работы с моделью в view.

Доступные поля:

- `dirty` — есть ли изменения.
- `dumpData` — сериализованные данные.
- `validation` — результаты валидации.
- `changes` / `inverseChanges` — патчи изменений.

Доступные методы:

- `loadData(data)` — перезагрузить данные.
- `commit()` — зафиксировать изменения.
- `commitField(field)` — зафиксировать поле.
- `reject()` — откатить изменения к последнему коммиту.
- `toInit()` — сбросить к исходным данным.

Пример:

```ts
const model = new PostModel({ title: "Hello", count: 1 });
model.title = "";
if (!model.service.validation.title) model.service.commit();
const payload = model.service.dumpData;
```

### Store / StoreBase

`Store` — отдельная сущность для коллекций моделей и работы со списками.

```ts
import { Store, StoreBase } from "mvvm-tools";

@Store({ id: "UsersStore" })
class UsersStore extends StoreBase<UserModel> {
  async load() {
    const res = await api.getUsers();
    if (res?.success) {
      this.applyLoaded(res.data, { model: UserModel });
    }
  }
}
```

Доступные поля и методы `StoreBase`:

- `items` — массив моделей.
- `cash` — исходные (сырые) данные до маппинга в модели.
- `add/remove/clear` — управление коллекцией.
- `find/filter/findBy` — поиск по предикату или ключу.
- `applyLoaded(data, { model, mode, cash })` — записать загрузку в `items`.
- `load()` — можно переопределить в наследнике (Promise/Generator/AsyncGenerator).

DI для stores:

```ts
import { GetStore, InjectStore, type InjectStoreType } from "mvvm-tools";

const usersStore = GetStore("UsersStore");

class Vm {
  @InjectStore("UsersStore") store: InjectStoreType<"UsersStore">;
}
```

### DevTools (Redux DevTools Extension)

Для отладки состояния можно подключить Redux DevTools Extension.  
В dev‑режиме модели и сторы будут автоматически подключаться к devtools, если один раз выставить флаг.

```ts
// src/devtools.ts
const isDev = typeof import.meta !== "undefined" && Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV);
const globalAny = globalThis as { __MVVM_DEVTOOLS_AUTO__?: boolean };
globalAny.__MVVM_DEVTOOLS_AUTO__ = isDev;
```

Далее достаточно импортировать файл один раз при старте приложения:

```ts
import "./devtools";
```

Дополнительно можно переопределить имя или отключить devtools на уровне модели/стора:

```ts
new UserModel(data, { devtools: { name: "UserModel", enabled: true } });

@Store({ id: "UsersStore", devtools: { name: "UsersStore", enabled: true } })
class UsersStore extends StoreBase<UserModel> {}
```

### 2) DI сервисы

```ts
import { Service, Inject, GetService } from "mvvm-tools";

@Service
class AuthService {
  token = "abc";
}

class Consumer {
  @Inject(AuthService)
  auth: AuthService = null;
}

const instance = new Consumer();
const auth = GetService(AuthService, "instance");
```

### GetService: второй аргумент и доступные поля

`GetService(name, prop)` позволяет получить не только весь объект сервиса, но и конкретное поле структуры сервиса.

Доступные поля:

- `instance` — инстанс сервиса (создается автоматически).
- `target` — конструктор класса сервиса.
- `context` — `ClassDecoratorContext` (если доступен).
- `options` — опции сервиса (`id`, `transient`, `lazy`).

Примеры:

```ts
const service = GetService(AuthService); // ServiceType
const instance = GetService(AuthService, "instance"); // экземпляр
const target = GetService(AuthService, "target"); // класс
const options = GetService("AuthService", "options"); // опции
```

### Service: опции регистрации

Декоратор `@Service` поддерживает следующие опции:

- `id` — строковый ключ сервиса (используется в `GetService("id")` и `@Inject("id")`).
- `transient` — при каждом обращении к `instance` возвращается новый инстанс.
- `lazy` — инстанс создается при первом обращении к `instance`.

Примеры:

```ts
import { Service, GetService } from "mvvm-tools";

@Service({ id: "ApiService" })
class ApiService {}

@Service({ id: "TransientService", transient: true })
class TransientService {}

@Service({ id: "LazyService", lazy: true })
class LazyService {}

const api = GetService("ApiService", "instance");
const t1 = GetService("TransientService", "instance");
const t2 = GetService("TransientService", "instance"); // новый инстанс

const lazy = GetService("LazyService"); // инстанс еще не создан
const created = GetService("LazyService", "instance"); // создается сейчас
```

Пример инъекции по строковому ключу:

```ts
import { Service, Inject, GetService } from "mvvm-tools";

@Service("AuthService")
class AuthService {
  token = "abc";
}

class Consumer {
  @Inject("AuthService")
  auth: AuthService = null;
}

const auth = GetService("AuthService", "instance");
```

### 3) View + ViewModel lifecycle

```tsx
import React from "react";
import { Service, view } from "mvvm-tools";

@Service
class AppVM {
  onInit() {
    console.log("init");
  }
  onDispose() {
    console.log("dispose");
  }
}

export const App = view("AppVM", ({ viewModel }) => {
  return <div>App loaded</div>;
});
```

## Vite‑плагин mvvm‑di

Плагин автоматически создает/обновляет файлы `container.d.ts` и `di.d.ts` для корректной типизации DI.

### Установка

Добавьте плагин в `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import { mvvmServiceDiPlugin } from "mvvm-tools/vite-plugins/mvvm-di";

export default defineConfig({
  plugins: [mvvmServiceDiPlugin()],
});
```

### Как работает

- Ищет классы с декоратором `@Service` (из `mvvm-tools`).
- Добавляет типы в ближайший `container.d.ts` (рядом с модулем).
- Добавляет контейнеры в `di.d.ts` проекта.
- Если `di.d.ts` отсутствует — создает его на старте.

### Пример

```ts
// src/modules/users/service.ts
import { Service } from "mvvm-tools";

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

declare module "mvvm-tools" {
  interface DiServices extends UsersServices {}
}
```

Теперь типы DI доступны через `GetService`/`InjectType`:

```ts
import { GetService, type InjectType } from "mvvm-tools";

const service = GetService("UsersService", "instance");
const typed: InjectType<"UsersService"> = service;
```

## Примечания

- Для корректной типизации `DiServices` убедитесь, что `di.d.ts` включен в `tsconfig.json` проекта.
- Плагин использует `typescript` как внешнюю зависимость (не бандлится).
