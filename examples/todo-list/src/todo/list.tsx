import { TodoItem } from "./item";
import { view } from "rvm-toolkit";
import { useI18n } from "../i18n/I18nProvider";
import { useRef } from "react";
import { useVirtualScroller } from "rvm-toolkit/hooks";


export const TodoList = view('ListVM', ({ viewModel: vm }) => {
  const { t } = useI18n();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const scroller = useVirtualScroller({ targetRef: containerRef, rowHeight: 64, overscan: 6 })

  const { totalHeight, startIndex, visibleItems } = scroller.getSlice(vm.items);

  return (
    <div className="todoBody" ref={containerRef}>
      <ul
        className  = "todoList"
        aria-label = {t("a11y.todoList")}
        style      = {{ height: totalHeight, position: "relative" }}
      >
        {visibleItems.map((todo, index) => {
          const top = (startIndex + index) * scroller.rowHeight;
          return (
            <TodoItem
              key   = {todo.id}
              item  = {todo}
              style = {{ position: "absolute", top, left: 0, right: 0, height: scroller.rowHeight }}
            />
          );
        })}
      </ul>
    </div>
  );
})
