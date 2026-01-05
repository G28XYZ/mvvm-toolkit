---
layout: default
title: DI сервисы
permalink: /di/
---

# DI сервисы

DI помогает управлять зависимостями между ViewModel и сервисами. Основные элементы: `@Service`, `@Inject`, `GetService`.

## Базовый пример

```ts
import { Service, Inject, GetService } from "rvm-toolkit";

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

## GetService: второй аргумент и доступные поля

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

## Service: опции регистрации

Декоратор `@Service` поддерживает следующие опции:

- `id` — строковый ключ сервиса (используется в `GetService("id")` и `@Inject("id")`).
- `transient` — при каждом обращении к `instance` возвращается новый инстанс.
- `lazy` — инстанс создается при первом обращении к `instance`.

Примеры:

```ts
import { Service, GetService } from "rvm-toolkit";

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

## Инъекция по строковому ключу

```ts
import { Service, Inject, GetService } from "rvm-toolkit";

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
