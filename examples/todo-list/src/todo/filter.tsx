import { observer } from "mobx-react"
import { InjectType, ViewFC } from "mvvm-tools";
import { TodoFilter as TodoFilterType } from './types';
import { useI18n } from "../i18n/I18nProvider";

export const TodoFilter: ViewFC<InjectType<'TodoVM'>> = observer(({ viewModel: vm }) => {
	const { t } = useI18n();

	return (
		<div className="todoFilters" role="tablist" aria-label={t("a11y.todoFilters")}>
        <button
          type      = "button"
          className = {`todoFilterBtn ${vm.todoFilter === TodoFilterType.All ? "isActive" : ""}`}
          onClick   = {() => vm.setFilter(TodoFilterType.All)}
          aria-label = {t("a11y.filterAll")}
          title      = {t("filter.all")}
        >
          {t("filter.all")}
        </button>
        <button
          type      = "button"
          className = {`todoFilterBtn ${vm.todoFilter === TodoFilterType.Active ? "isActive" : ""}`}
          onClick   = {() => vm.setFilter(TodoFilterType.Active)}
          aria-label = {t("a11y.filterActive")}
          title      = {t("filter.active")}
        >
          ⬜️
        </button>
        <button
          type      = "button"
          className = {`todoFilterBtn ${vm.todoFilter === TodoFilterType.Done ? "isActive" : ""}`}
          onClick   = {() => vm.setFilter(TodoFilterType.Done)}
          aria-label = {t("a11y.filterCompleted")}
          title      = {t("filter.completed")}
        >
          ✅
        </button>
				<button
          type      = "button"
          className = {`todoFilterBtn`}
          onClick   = {() => vm.clearCompleted()}
          aria-label = {t("filter.clearCompleted")}
          title      = {t("filter.clearCompleted")}
        >
          🆑
        </button>
		</div>
	)
})
