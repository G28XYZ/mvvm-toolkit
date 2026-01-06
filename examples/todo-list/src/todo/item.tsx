import type { CSSProperties } from "react";
import type { Todo } from "./types";
import { InjectType, view, ViewProps } from "rvm-toolkit";
import { useI18n } from "../i18n/I18nProvider";

type Props = ViewProps<InjectType<'ItemVM'>, {
  item: Todo;
  style?: CSSProperties;
}>;

export const TodoItem = view('ItemVM', ({
	viewModel: vm,
  item,
  style,
}: Props) => {
  const { t } = useI18n();
  const { id, done } = item;
  const errorText = vm.errors?.text ? t(vm.errors.text) : "";

  return (
    <li
      className={`todoItem ${done ? "isDone" : ""} ${vm.isEditing ? "isEditing" : ""}`}
      style={style}
    >
      <div className="todoItem__left">
        <button
          type       = "button"
          className  = {`check ${done ? "check--done" : ""}`}
          aria-label = {done ? t("todo.toggleUndone") : t("todo.toggleDone")}
          onClick    = {() => vm.toggle(item)}
          disabled   = {vm.isEditing}
          title      = {done ? t("todo.toggleUndone") : t("todo.toggleDone")}
        >
          {done ? "✓" : ""}
        </button>
      </div>

      <div className="todoItem__content">
        {!vm.isEditing ? (
          <button
            type       = "button"
            className  = "todoTextBtn"
            onClick    = {vm.setIsEditing}
            aria-label = {t("todo.edit")}
            title      = {t("todo.edit")}
          >
            <span className="todoItem__text">{item.text}</span>
          </button>
        ) : (
					<div className="todoEditWrap">
						<input
							autoFocus
							className = {`todoEditInput ${vm.errors.text ? "hasError" : ""}`}
							value     = {item.text}
							onChange  = {(e) => vm.updateText(item, e.target.value)}
							onBlur    = {vm.onSave}
							aria-label = {t("todo.edit")}
						/>
						{errorText && <div className="todoEditError">{errorText}</div>}
					</div>
        )}
      </div>

      {!vm.isEditing ? (
        <div className="todoItem__actions">
          <button
            type       = "button"
            className  = "todoIconBtn"
            onClick    = {vm.setIsEditing}
            aria-label = {t("todo.edit")}
            title      = {t("todo.edit")}
          >
            ✎
          </button>
          <button
            type       = "button"
            className  = "todoIconBtn"
            aria-label = {t("todo.remove")}
            title      = {t("todo.remove")}
            onClick    = {() => vm.remove(item)}
          >
            ×
          </button>
        </div>
      ) : (
        <div className="todoItem__actions">
          <button
            type        = "button"
            className   = "todoIconBtn"
            onMouseDown = {(e) => e.preventDefault()}  // чтобы не сработал blur раньше клика
            onClick     = {vm.onCommit}
            aria-label  = {t("todo.save")}
            title       = {t("todo.save")}
						disabled    = {Boolean(vm.errors.text)}
          >
            ✓
          </button>
          <button
            type        = "button"
            className   = "todoIconBtn"
            onMouseDown = {(e) => e.preventDefault()}
            onClick     = {vm.onCancel}
            aria-label  = {t("todo.cancel")}
            title       = {t("todo.cancel")}
          >
            ↩
          </button>
        </div>
      )}
    </li>
  );
})
