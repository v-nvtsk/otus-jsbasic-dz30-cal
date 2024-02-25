import { describe, expect, it, jest } from "@jest/globals";
import { TaskList } from "./task-list";
import { type TodoItem } from "../../api/calendar-api";

describe("TaskList", () => {
  const onEdit: any = jest.fn();
  const onDelete: any = jest.fn();

  const parent = document.createElement("div");

  const taskList = new TaskList({
    parent,
    onEdit,
    onDelete,
  });

  it("taskList should be an instance of TaskList", () => {
    expect(taskList).toBeInstanceOf(TaskList);
  });

  it("taskList methods should be functions", () => {
    expect(typeof taskList.renderTaskList).toBe("function");
    expect(typeof taskList.additemToList).toBe("function");
  });

  it("should render task list", () => {
    const items: TodoItem[] = [];
    for (let i = 0; i < 10; i += 1) {
      items.push({
        id: `${i}`,
        creationDateUTC: new Date().toUTCString(),
        dueDateUTC: new Date(new Date().getTime() + 24 * i * 3600 * 1000).toUTCString(),
        taskText: `Task ${i}`,
        status: Boolean(i % 2),
        tags: `tag${i}`,
      });
    }

    const taskListEl = taskList.renderTaskList(items);
    expect(taskListEl.childElementCount).toBe(10);
  });

  it("should render empty task list", () => {
    const items: TodoItem[] = [];

    const taskListEl = taskList.renderTaskList(items);
    expect(taskListEl.childElementCount).toBe(1);
    expect(taskListEl.innerHTML).toEqual('<li class="empty-list">No tasks</li>');
  });

  it("should not render new task list if already exists", () => {
    const items: TodoItem[] = [];

    const taskListEl1 = taskList.renderTaskList(items);
    const taskListEl2 = taskList.renderTaskList(items);
    expect(taskListEl1).toEqual(taskListEl2);
  });
});
