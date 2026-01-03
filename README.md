# mvvm-toolkit

[![Tests](https://github.com/G28XYZ/mvvm-toolkit/actions/workflows/tests.yml/badge.svg)](https://github.com/G28XYZ/mvvm-toolkit/actions/workflows/tests.yml)
[![GitHub Pages](https://github.com/G28XYZ/mvvm-toolkit/actions/workflows/todo-list-pages.yml/badge.svg)](https://g28xyz.github.io/mvvm-toolkit/examples/todo-list)
[![License](https://img.shields.io/github/license/G28XYZ/mvvm-toolkit?style=flat)](LICENSE)
[![Stars](https://img.shields.io/github/stars/G28XYZ/mvvm-toolkit?style=flat)](https://github.com/G28XYZ/mvvm-toolkit/stargazers)
[![Issues](https://img.shields.io/github/issues/G28XYZ/mvvm-toolkit?style=flat)](https://github.com/G28XYZ/mvvm-toolkit/issues)
[![Views](https://visitor-badge.laobi.icu/badge?page_id=G28XYZ.mvvm-toolkit)](https://github.com/G28XYZ/mvvm-toolkit)

Примеры и демо: https://g28xyz.github.io/mvvm-toolkit/

Библиотека для MVVM‑подхода на базе MobX + React. Содержит:

- Model: управление состоянием, валидации, сериализация, откат/коммит.
- Decorators: field/validation/submit/exclude/PropFromView/MakeObservable.
- View: обертка для проброса ViewModel и жизненный цикл onInit/onDispose.
- Vite‑плагин: генерация контейнеров типов для DI.

## Зачем и чем помогает

mvvm-toolkit нужен, когда бизнес‑логика и состояние React‑приложения начинают расползаться по компонентам. Он задает понятную структуру MVVM поверх MobX: Model отвечает за данные и валидацию, Store — за коллекции, ViewModel — за сценарии UI, а View остается чистой.

- Меньше бойлерплейта: декораторы связывают поля модели с сериализацией и MobX‑наблюдаемостью.
- Управляемые изменения: `model.service` дает `dirty`, `dumpData`, `changes` и операции `commit/reject/toInit`, что удобно для форм и черновиков.
- Списки и загрузки без хаоса: `StoreBase` + `@Store` упрощают CRUD, фильтры и загрузку данных (см. `docs/store.md` и `examples/todo-list`).
- DI и композиция ViewModel: `@Service`, `@Inject`, `@InjectStore`, `view()` подключают зависимости и жизненный цикл `onInit/onDispose`.
- Типобезопасность и отладка: Vite‑плагин генерирует DI‑типы, а DevTools помогает трекать состояние.

## Документация

- `docs/README.md` — индекс и оглавление.
- `docs/model.md` — Model, декораторы и `model.service`.
- `docs/store.md` — StoreBase, Store и коллекции.
- `docs/di.md` — Service/Inject/GetService.
- `docs/view.md` — view(), ViewModel lifecycle, PropFromView.
- `docs/devtools.md` — Redux DevTools.
- `docs/vite-plugin-mvvm-di.md` — Vite‑плагин для DI типов.

## Быстрый старт

### 1) Model + decorators

```ts
import { Model, field, validation, submit, exclude } from "mvvm-toolkit";

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

Дальше: `docs/model.md`, `docs/store.md`, `docs/di.md`, `docs/view.md`, `docs/devtools.md`, `docs/vite-plugin-mvvm-di.md`.
