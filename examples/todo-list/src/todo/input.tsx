import { view } from "rvm-toolkit";
import { useI18n } from "../i18n/I18nProvider";

export const TodoInput = view('InputVM', ({ viewModel: vm }) => {
  const { t } = useI18n();

  return (
    <form className="todoInputWrap" onSubmit={(e) => (e.preventDefault(), vm.addTodo.execute())}>
      <div className="todoInputRow">
        <input
          className   = "todoInput"
          value       = {vm.draft}
          onChange    = {(e) => vm.updateText(e.target.value)}
          placeholder = {t("input.placeholder")}
          aria-label  = {t("a11y.newTask")}
        />

        <button type="submit" className={"todoAddBtn" + (vm.addTodo.isExecuting ? ' spinner' : '')} aria-label={t("a11y.addTodo")} disabled={!vm.addTodo.canExecute}>
          {t("input.add")}
        </button>
      </div>
    </form>
  );
})
