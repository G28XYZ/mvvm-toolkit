import { TodoCard } from "./card";
import { TodoHeader } from "./header";
import { TodoList } from "./list";
import { TodoInput } from "./input";
import { view } from "mvvm-tools";
import { TodoFilter } from "./filter";
import { useI18n } from "../i18n/I18nProvider";

export const TodoView = view('TodoVM', ({ viewModel: vm }) => {
	const { t } = useI18n();

  return (
		<TodoCard>
			<TodoHeader title={t("app.title")} />
			<TodoList />
			<TodoInput />
			<TodoFilter viewModel={vm} />
		</TodoCard>
  );
})
