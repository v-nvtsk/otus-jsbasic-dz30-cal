import { UpdateTodoItem, type TodoItem } from "../../api/calendar-api";
import { renderTaskItem } from "../task-item/task-item";
import "./style.css";

export class TaskList {
  private readonly parent: HTMLElement;

  public taskListEl: HTMLElement = document.createElement("ul");

  private items: TodoItem[] = [];

  private onDelete: (id: string) => Promise<void>;

  private onEdit: (data: UpdateTodoItem) => Promise<TodoItem | undefined>;

  constructor(options: {
    parent: HTMLElement;
    onDelete: (id: string) => Promise<void>;
    onEdit: (data: UpdateTodoItem) => Promise<TodoItem | undefined>;
  }) {
    const { parent, onDelete, onEdit } = options;
    this.parent = parent;
    this.items = [];
    this.onDelete = onDelete;
    this.onEdit = onEdit;
  }

  public renderTaskList(items?: TodoItem[]) {
    if (items !== undefined) this.items = [...items];

    const tempEl = this.parent.querySelector(".task-list") as HTMLElement;
    if (tempEl === null) {
      this.taskListEl.className = "task-list list";
      this.parent.append(this.taskListEl);
    }

    this.taskListEl.innerHTML = "";

    if (this.items.length !== 0) {
      this.items.forEach((item) =>
        renderTaskItem({
          parent: this.taskListEl as HTMLElement,
          itemData: item,
          onDelete: this.onDeleteProxy.bind(this),
          onEdit: this.onEdit,
        }),
      );
    } else {
      this.taskListEl.innerHTML = "<li class='empty-list'>No tasks</li>";
    }
    return this.taskListEl;
  }

  private onDeleteProxy(id: string): Promise<void> {
    this.renderTaskList(this.items.filter((el) => el.id !== id));
    return this.onDelete(id);
  }

  public additemToList(item: TodoItem) {
    this.items.push(item);
    this.renderTaskList();
  }
}
