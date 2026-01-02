import { TodoItem } from "./item";
import { view } from "mvvm-tools";
import { useI18n } from "../i18n/I18nProvider";


export const TodoList = view('ListVM', ({ viewModel: vm }) => {
  const { t } = useI18n();

  return (
    <div className="todoBody">
      <ul className="todoList" aria-label={t("a11y.todoList")}>
        {vm.items.map((t) => (
          <TodoItem key={t.id} item={t} />
        ))}
      </ul>
    </div>
  );
})
