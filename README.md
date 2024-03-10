[![Lint and Test](https://github.com/v-nvtsk/otus-jsbasic-dz30-cal/actions/workflows/lint-test.yaml/badge.svg)](https://github.com/v-nvtsk/otus-jsbasic-dz30-cal/actions/workflows/lint-test.yaml) ![Endpoint Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/v-nvtsk/f9b687636482339cabd6a8c4b369f3eb/raw/ffb2ac96927666af874670e4f03f583c651e1e83/otus-jsbasic-dz30-cal-junit-tests.json) [![pages-build-deployment](https://github.com/v-nvtsk/otus-jsbasic-dz30-cal/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/v-nvtsk/otus-jsbasic-dz30-cal/actions/workflows/pages/pages-build-deployment)

# Разработка API для работы с календарем задач - CRUD, фильтрация и поиск

## Цель работы:

Разработать собственный API для библиотеки асинхронной работы с хранилищами данных.

## Выполнено:

[Preview on GitHub Pages](https://v-nvtsk.github.io/otus-jsbasic-dz30-cal/)

Класс Calendar может быть инициализирован с хранилищем localStorage или Firebase.
Для этого реализовани единый интерфейс CRUD календаря и создан асинхронный интерфейс для работы с localStorage.

Календарь поддерживает операции создания, чтения, изменения и удаления задач.
При чтении задач поддерживается фильтрация (по тексту, дате, статусу, тегам).

## Описание API

API хранения данных:

```js
interface CalendarAPI {
  create: (data: TodoItem) => Promise<string | undefined>;
  read: (filter: Partial<Filter>) => Promise<TodoItem[]>;
  update: (data: UpdateTodoItem) => Promise<TodoItem | undefined>;
  delete: (id: string) => Promise<void>;
}
```

Данные хранятся в виде структуры:

```js
interface TodoItem {
id?: string;
taskText: string;
status: boolean;
tags: string;
creationDateUTC: string;
dueDateUTC: string;
}

```

API фильтрации данных:

```js
interface Filter {
  dateFrom?: Date;
  dateTo?: Date;
  taskText?: string;
  status?: boolean;
  taskTags?: string;
}
```
