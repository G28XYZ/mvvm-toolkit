---
layout: default
title: View и ViewModel
permalink: /view/
---

# View и ViewModel

`view()` связывает React-компонент с ViewModel и управляет жизненным циклом. `ViewModel` инкапсулирует сценарии UI, а View остается декларативной.

## View + lifecycle

```tsx
import React from "react";
import { Service, view } from "mvvm-toolkit";

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

## Проброс props в ViewModel

`@PropFromView(name)` позволяет прокинуть prop из view в ViewModel.

```ts
import { PropFromView, Service, ViewModel } from "mvvm-toolkit";

@Service
class PostVM extends ViewModel {
  @PropFromView("postId")
  postId = "";
}
```

```tsx
import React from "react";
import { view } from "mvvm-toolkit";

export const PostView = view("PostVM", ({ viewModel, postId }: { postId: string }) => {
  return <div>Post: {viewModel.postId}</div>;
});
```
