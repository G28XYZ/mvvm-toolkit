// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { PropFromView, Service, view } from "../src";

interface TestProps {
  title: string;
}

describe("view", () => {
  const renderWithRoot = (element: React.ReactElement) => {
    const container = document.createElement("div");
    const root: Root = createRoot(container);
    act(() => {
      root.render(element);
    });
    return {
      unmount: () => act(() => root.unmount()),
    };
  };

  it("прокидывает props во view model через PropFromView", () => {
    @Service
    class ViewModel {
      @PropFromView("title")
      title: string = "";
    }

    let captured: ViewModel;

    const Component = view<TestProps, typeof ViewModel>(ViewModel, (props) => {
      const { viewModel } = props as { viewModel: ViewModel };
      captured = viewModel;
      return React.createElement("div", null, viewModel?.title);
    });

    const Wrapped = Component as React.FC<any>;
    renderToString(React.createElement(Wrapped, { title: "Hello" }));

    // @ts-ignore
    expect(captured).toBeInstanceOf(ViewModel);
    // @ts-ignore
    expect(captured?.title).toBe("Hello");
  });

  it("поддерживает legacy PropFromView", () => {
    class LegacyViewModel {
      title: string = "";
    }

    PropFromView("title")(LegacyViewModel.prototype, "title");
    Service(LegacyViewModel);

    let captured: LegacyViewModel;

    const Component = view<TestProps, typeof LegacyViewModel>(LegacyViewModel, (props) => {
      const { viewModel } = props as { viewModel: LegacyViewModel };
      captured = viewModel;
      return React.createElement("div", null, viewModel?.title);
    });

    const Wrapped = Component as React.FC<any>;
    renderToString(React.createElement(Wrapped, { title: "Legacy" }));

    // @ts-ignore
    expect(captured).toBeInstanceOf(LegacyViewModel);
    // @ts-ignore
    expect(captured?.title).toBe("Legacy");
  });

  it("переиспользует инстанс сервиса при регистрации view model", () => {
    @Service
    class ServiceViewModel {
      value = 1;
    }

    let first: ServiceViewModel;
    let second: ServiceViewModel;

    const Component = view(ServiceViewModel, (props) => {
      const { viewModel } = props as { viewModel: ServiceViewModel };
      if (!first) first = viewModel;
      else second = viewModel;
      return React.createElement("div");
    });

    const Wrapped = Component as React.FC<any>;
    renderToString(React.createElement(Wrapped, {}));
    renderToString(React.createElement(Wrapped, {}));

    // @ts-ignore
    expect(first).toBeInstanceOf(ServiceViewModel);
    // @ts-ignore
    expect(second).toBeInstanceOf(ServiceViewModel);
    // @ts-ignore
    expect(first).toBe(second);
  });

  it("вызывает onInit и onDispose в жизненном цикле", () => {
    const onInit = vi.fn();
    const onDispose = vi.fn();

    @Service
    class LifecycleVm {
      onInit() {
        onInit();
      }
      onDispose() {
        onDispose();
      }
    }

    const Component = view(LifecycleVm, () => React.createElement("div"));
    const Wrapped = Component as React.FC<any>;

    const { unmount } = renderWithRoot(React.createElement(Wrapped, {}));
    expect(onInit).toHaveBeenCalledTimes(1);

    unmount();
    expect(onDispose).toHaveBeenCalledTimes(1);
  });
});
