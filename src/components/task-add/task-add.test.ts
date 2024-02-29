import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { taskAdd } from "./task-add";

describe("taskAdd", () => {
  it("should be a function", () => {
    expect(taskAdd).toBeInstanceOf(Function);
  });

  let onAddTask = jest.fn();
  let parent: HTMLElement;
  let taskTextEl: HTMLInputElement;
  let taskDateEl: HTMLInputElement;
  let taskTagsEl: HTMLInputElement;
  let taskBtnEl: HTMLButtonElement;

  beforeEach(() => {
    onAddTask = jest.fn();
    parent = document.createElement("div");
    taskAdd(parent, onAddTask);

    taskTextEl = parent.querySelector(".task-add__input-text")!;
    taskDateEl = parent.querySelector(".task-add__input-date")!;
    taskTagsEl = parent.querySelector(".task-add__input-tags")!;
    taskBtnEl = parent.querySelector(".task-add__btn-add")!;
  });

  afterEach(() => {
    onAddTask.mockClear();
  });

  it("should create initial markup", () => {
    expect(parent.innerHTML).not.toBe("");
    expect(parent.querySelector(".task-add")).not.toBeNull();
    expect(taskTextEl).not.toBeNull();
    expect(taskDateEl).not.toBeNull();
    expect(taskTagsEl).not.toBeNull();
    expect(taskBtnEl).not.toBeNull();
  });

  it("should not add task if form is invalid", () => {
    taskBtnEl.click();
    expect(onAddTask).not.toHaveBeenCalled();
  });

  it("should call onAddTask with values", () => {
    taskTextEl.value = "test task";
    taskDateEl.value = "2022-01-01";
    taskTagsEl.value = "tag1, tag2";
    const form = parent.querySelector(".task-add")! as HTMLFormElement;
    form.submit();
    expect(onAddTask).toHaveBeenCalledWith("test task", "2022-01-01", "tag1, tag2");
  });
});
