export type Lang = "ru" | "en";

export const messages = {
  ru: {
    "app.title": "ToDo List",

    "input.placeholder": "Введите задачу...",
    "input.add": "➕",

    "filter.all": "Все",
    "filter.active": "Не выполнены",
    "filter.completed": "Выполнены",
    "filter.clearCompleted": "Очистить выполненные",

    "a11y.todoApp": "Todo app",
    "a11y.todoList": "Список задач",
    "a11y.todoFilters": "Фильтры задач",
    "a11y.newTask": "Новая задача",
    "a11y.addTodo": "Добавить задачу",

    "a11y.filterAll": "Показать все",
    "a11y.filterActive": "Показать невыполненные",
    "a11y.filterCompleted": "Показать выполненные",

    "todo.toggleDone": "Отметить выполненной",
    "todo.toggleUndone": "Снять отметку выполнения",
    "todo.edit": "Редактировать",
    "todo.remove": "Удалить",
    "todo.save": "Сохранить",
    "todo.cancel": "Отменить",

    "validation.required": "Поле не должно быть пустым",

    "lang.ru": "RU",
    "lang.en": "EN",
    "lang.label": "Язык",
  },

  en: {
    "app.title": "ToDo List",

    "input.placeholder": "Type your task...",
    "input.add": "➕",

    "filter.all": "All",
    "filter.active": "Active",
    "filter.completed": "Completed",
    "filter.clearCompleted": "Clear completed",

    "a11y.todoApp": "Todo app",
    "a11y.todoList": "Todo list",
    "a11y.todoFilters": "Todo filters",
    "a11y.newTask": "New task",
    "a11y.addTodo": "Add todo",

    "a11y.filterAll": "Show all",
    "a11y.filterActive": "Show active",
    "a11y.filterCompleted": "Show completed",

    "todo.toggleDone": "Mark as done",
    "todo.toggleUndone": "Mark as not done",
    "todo.edit": "Edit",
    "todo.remove": "Remove",
    "todo.save": "Save",
    "todo.cancel": "Cancel",

    "validation.required": "Field must not be empty",

    "lang.ru": "RU",
    "lang.en": "EN",
    "lang.label": "Language",
  },
} as const;
