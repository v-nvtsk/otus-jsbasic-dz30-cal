export type DateCallback = (date: Date) => void;

export interface Calendar {
  init: () => void;
  onMonthChange: DateCallback;
  onDaySelect: DateCallback;
  onHourSelect: DateCallback;
  showAddTodo: () => void;
  save: () => void;
}

export interface TodoItem {
  id?: string;
  taskText: string;
  status: boolean;
  tags: string;
  creationDateUTC: string;
  dueDateUTC: string;
}

export type UpdateTodoItem = {
  id: string;
} & Omit<Partial<TodoItem>, "id">;

export interface Filter {
  dateFrom?: Date;
  dateTo?: Date;
  taskText?: string;
  status?: boolean;
  taskTags?: string;
}

export interface CalendarAPI {
  create: (data: TodoItem) => Promise<string | undefined>;
  read: (filter: Partial<Filter>) => Promise<TodoItem[]>;
  update: (data: UpdateTodoItem) => Promise<TodoItem | undefined>;
  delete: (id: string) => Promise<void>;
}

export const APP_PREFIX = "calendar";
export const USER_PREFIX = "user";
