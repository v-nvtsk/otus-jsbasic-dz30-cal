import type { CalendarAPI, Filter, TodoItem, UpdateTodoItem } from "../../api/calendar-api";
import { LocalStore } from "../../api/local-store";
import { createElementFromHTML } from "../../utils/create-element-from-html";
import { taskAdd } from "../task-add/task-add";
import { renderFilterControls } from "../filter-controls/filter-controls";
import { TaskList } from "../task-list/task-list";

function isFieldValid(field: string) {
  return field !== null && field !== undefined && field !== "";
}

export class Calendar {
  private readonly calendar: HTMLElement;

  private readonly activeDate: Date;

  private taskList: TaskList;

  private Elements: {
    taskAddForm: HTMLElement | null;
    taskListEl: HTMLElement | null;
    filterForm: HTMLElement | null;
  } = { taskAddForm: null, taskListEl: null, filterForm: null };

  constructor(
    private readonly root: HTMLElement,
    private readonly store: CalendarAPI = new LocalStore(),
  ) {
    this.calendar = createElementFromHTML(`<div class="calendar"></div>`)[0] as HTMLElement;
    this.activeDate = new Date();
    this.taskList = new TaskList({
      parent: this.calendar,
      onDelete: this.delete.bind(this),
      onEdit: this.update.bind(this),
    });
  }

  public init(): void {
    this.root.append(this.calendar);
    this.Elements.taskAddForm = taskAdd(this.calendar, this.onAddTask.bind(this));
    this.Elements.filterForm = renderFilterControls(this.calendar, this.onFilter.bind(this));

    this.read({})
      .then((res) => {
        this.Elements.taskListEl = this.taskList.renderTaskList(res);
      })
      // eslint-disable-next-line no-console
      .catch(console.error);
  }

  private onAddTask(taskText: string, taskDate: string, taskTags: string): void {
    const newTaskItem: TodoItem = {
      creationDateUTC: new Date().toUTCString(),
      dueDateUTC: new Date(taskDate).toUTCString(),
      taskText,
      tags: taskTags,
      status: false,
    };
    this.create(newTaskItem)
      .then((id: string | undefined) => {
        if (id !== undefined && this.Elements.taskListEl !== null) {
          newTaskItem.id = id;
          this.taskList.additemToList(newTaskItem);
        }
      })
      // eslint-disable-next-line no-console
      .catch(console.error);
  }

  private onFilter(fields: {
    taskText: string;
    taskDateFrom: string;
    taskDateTo: string;
    taskStatus: string;
    taskTags: string;
  }): void {
    const filter: Partial<Filter> = {};
    if (isFieldValid(fields.taskText)) filter.taskText = fields.taskText;
    if (isFieldValid(fields.taskDateFrom)) filter.dateFrom = new Date(fields.taskDateFrom);
    if (isFieldValid(fields.taskDateTo)) filter.dateTo = new Date(fields.taskDateTo);
    if (isFieldValid(fields.taskStatus)) filter.status = Boolean(Number(fields.taskStatus));
    if (isFieldValid(fields.taskTags)) filter.taskTags = fields.taskTags;

    this.read(filter)
      .then((res) => {
        if (this.Elements.taskListEl !== null) {
          this.taskList.renderTaskList(res);
        }
      })
      // eslint-disable-next-line no-console
      .catch(console.error);
  }

  private async create(data: TodoItem): Promise<string | undefined> {
    const result = await this.store.create(data);
    return result;
  }

  private async read(filter: Partial<Filter>): Promise<TodoItem[]> {
    const result = await this.store.read(filter);
    return result;
  }

  private async update(data: UpdateTodoItem): Promise<TodoItem | undefined> {
    const result = await this.store.update(data);
    return result;
  }

  private async delete(id: string): Promise<void> {
    await this.store.delete(id);
  }
}
