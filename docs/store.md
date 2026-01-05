---
layout: default
title: Store / StoreBase
permalink: /store/
---

# Store / StoreBase

`Store` — отдельная сущность для коллекций моделей и работы со списками. Базовый класс `StoreBase` дает список моделей, CRUD-операции и утилиты загрузки.

## Базовый пример

```ts
import { Store, StoreBase } from "rvm-toolkit";
import { UserModel } from "./model";

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

## Поля и методы StoreBase

- `items` — массив моделей.
- `cash` — исходные (сырые) данные до маппинга в модели.
- `add/remove/clear` — управление коллекцией.
- `addMany` — bulk add items with a single array expansion.
- `find/filter/findBy` — поиск по предикату или ключу.
- `applyLoaded(data, { model, mode, cash })` — записать загрузку в `items`.
- `load()` — можно переопределить в наследнике (Promise/Generator/AsyncGenerator).

## DI для stores

```ts
import { GetStore, InjectStore, type InjectStoreType } from "rvm-toolkit";

const usersStore = GetStore("UsersStore");

class Vm {
  @InjectStore("UsersStore")
  store: InjectStoreType<"UsersStore">;
}
```

## Performance notes

- Prefer `applyLoaded(data, { model, cash: false })` for large datasets to avoid duplicating raw data in `cash`.
- Use `addMany` instead of calling `add` in a tight loop.
