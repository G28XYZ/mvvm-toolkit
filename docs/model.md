# Model и декораторы

`Model<T>` отвечает за данные формы, валидацию, сериализацию и контроль изменений. Поля модели описываются декораторами, которые подключают MobX-наблюдаемость и хук на `dumpData`/`validation`.

## Базовый пример

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

## Декораторы

- `@field` — помечает свойство как поле модели и подключает его к `dumpData`, `validation` и механизму изменений.
- `@validation(fn)` — запускает валидацию при изменении поля, результат хранится в `model.service.validation`.
- `@submit(fn)` — трансформирует значение при `dumpData`.
- `@exclude(fn|true)` — исключает поле из `dumpData` (условно или всегда).
- `@PropFromView(name)` — пробрасывает prop из view в ViewModel (работает в `view`).
- `@define_prop` — делает свойство неперечисляемым (по умолчанию).
- `@MakeObservable` — автоматически вызывает `makeObservable` в конструкторе.

## Сервис модели (model.service)

`model.service` — публичный API для работы с моделью в view.

**Поля:**

- `dirty` — есть ли изменения.
- `dumpData` — сериализованные данные.
- `validation` — результаты валидации.
- `changes` / `inverseChanges` — патчи изменений.

**Методы:**

- `loadData(data)` — перезагрузить данные.
- `commit()` — зафиксировать изменения.
- `commitField(field)` — зафиксировать поле.
- `reject()` — откатить изменения к последнему коммиту.
- `toInit()` — сбросить к исходным данным.

Пример:

```ts
const model = new UserModel({ id: 1, name: "Alice", token: "secret" });
model.name = "";
if (!model.service.validation.name) model.service.commit();
const payload = model.service.dumpData;
```
