import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderTaskItem } from "./task-item";
import type { TodoItem } from "../../api/calendar-api";

const sleep = async (x: number = 0) =>
  new Promise((resolve) => {
    setTimeout(resolve, x);
  });

describe("renderTaskItem", () => {
  const list = document.createElement("ul");
  let taskCheckbox: HTMLInputElement | null;
  let taskTextEl: HTMLElement | null;
  let taskTagsEl: HTMLElement | null;
  let taskInputEl: HTMLInputElement | null;
  let taskBtnEl: HTMLButtonElement | null;
  let taskDeleteBtnEl: HTMLButtonElement | null;

  const defaultItem: TodoItem = {
    id: "1",
    taskText: "test",
    status: true,
    tags: "tag1, tag2",
    dueDateUTC: new Date(2024, 2, 1).toUTCString(),
    creationDateUTC: new Date().toUTCString(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    list.innerHTML = "";
    renderTaskItem({ parent: list, itemData: defaultItem, onEdit: (): any => {}, onDelete: (): any => {} });
    taskCheckbox = list.querySelector(".item__input-checkbox");
    taskTextEl = list.querySelector(".item__title");
    taskInputEl = list.querySelector(".item__input-text");
    taskBtnEl = list.querySelector(".item__btn-edit");
    taskDeleteBtnEl = list.querySelector(".item__btn-delete");
    taskTagsEl = list.querySelector(".item__task-tags");
  });

  it("should be a function", () => {
    expect(renderTaskItem).toBeInstanceOf(Function);
  });

  it("should create initial markup", () => {
    expect(list.innerHTML).not.toBe("");
    expect(taskCheckbox).not.toBeNull();
    expect(taskTextEl).not.toBeNull();
    expect(taskTextEl?.textContent).toEqual("test");
    expect(taskInputEl).not.toBeNull();
    expect(taskInputEl?.value).toEqual("test");
    expect(taskTagsEl).not.toBeNull();
    expect(taskTagsEl?.childElementCount).toEqual(2);
    expect(taskBtnEl).not.toBeNull();
    expect(taskDeleteBtnEl).not.toBeNull();
  });

  it("should render task item with unchecked checkbox", () => {
    const item: TodoItem = {
      ...defaultItem,
      status: false,
    };
    const itemEl = renderTaskItem({
      parent: list,
      itemData: item,
      onEdit: (): any => {},
      onDelete: (): any => {},
    });
    const checkBox = itemEl.querySelector('input[type="checkbox"][checked="checked"]');
    expect(checkBox).toBeNull();
  });

  it("should render task item with checked checkbox", () => {
    const itemEl = renderTaskItem({
      parent: list,
      itemData: defaultItem,
      onEdit: (): any => {},
      onDelete: (): any => {},
    });
    const checkBox = itemEl.querySelector('input[type="checkbox"][checked="checked"]');
    expect(checkBox).not.toBeNull();
  });

  it("should render task item with empty tags", () => {
    const item: TodoItem = {
      ...defaultItem,
      tags: "",
    };
    const itemEl = renderTaskItem({
      parent: list,
      itemData: item,
      onEdit: (): any => {},
      onDelete: (): any => {},
    });
    const tags = itemEl.querySelectorAll(".tags_tag");
    expect(tags.length).toBe(0);
  });

  it("should call onDelete callback on 'Delete' button click", () => {
    const onDelete = jest.fn(async () => {
      await Promise.resolve();
    });
    const itemEl = renderTaskItem({
      parent: list,
      itemData: defaultItem,
      onEdit: (): any => {},
      onDelete,
    });
    const btnDelete = itemEl.querySelector(".item__btn-delete");
    if (itemEl !== null && btnDelete !== null) {
      (btnDelete as HTMLButtonElement).click();
      expect(onDelete).toHaveBeenCalled();
    } else {
      throw new Error("itemEl is null");
    }
  });

  it("should call onEdit callback on 'Edit' button click", () => {
    const onEdit = jest.fn(async (): Promise<TodoItem | undefined> => Promise.resolve(defaultItem));
    const itemEl = renderTaskItem({
      parent: list,
      itemData: defaultItem,
      onEdit,
      onDelete: (): any => {},
    });
    const btnEdit = itemEl.querySelector(".item__btn-edit");
    if (itemEl !== null && btnEdit !== null) {
      (btnEdit as HTMLButtonElement).click();
      expect(itemEl.classList.contains("edit-mode")).toBe(true);
      (btnEdit as HTMLButtonElement).click();
      expect(itemEl.classList.contains("edit-mode")).toBe(false);
      expect(onEdit).toHaveBeenCalled();
    } else {
      throw new Error("itemEl is null");
    }
  });

  it("should handle errors for onDelete callback", async () => {
    const onDelete = jest.fn(async () => Promise.reject(new Error("Error message")));

    const itemEl = renderTaskItem({
      parent: list,
      itemData: defaultItem,
      onEdit: (): any => {},
      onDelete,
    });

    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

    const btnDelete = itemEl.querySelector(".item__btn-delete");
    if (itemEl !== null && btnDelete !== null) {
      (btnDelete as HTMLButtonElement).click();
      expect(onDelete).toHaveBeenCalled();
      await sleep();
      expect(consoleErrorMock).toHaveBeenCalled();
    } else {
      throw new Error("itemEl is null");
    }
  });

  it("should handle errors for onEdit callback", () => {
    const onEdit = jest.fn(async (): Promise<TodoItem | undefined> => Promise.reject(new Error("Error")));
    const itemEl = renderTaskItem({
      parent: list,
      itemData: defaultItem,
      onEdit,
      onDelete: (): any => {},
    });

    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});

    const btnEdit = itemEl.querySelector(".item__btn-edit");
    if (itemEl !== null && btnEdit !== null) {
      (btnEdit as HTMLButtonElement).click();
      expect(itemEl.classList.contains("edit-mode")).toBe(true);
      (btnEdit as HTMLButtonElement).click();
      expect(itemEl.classList.contains("edit-mode")).toBe(false);
      expect(onEdit).toHaveBeenCalled();
      sleep()
        .then(() => {
          expect(consoleErrorMock).toHaveBeenCalled();
        })
        .catch(() => {});
    } else {
      throw new Error("itemEl or btnEdit is null");
    }
  });

  it("should update task record on checkbox click", () => {
    const onEdit = jest.fn(async (): Promise<TodoItem | undefined> => Promise.resolve(defaultItem));
    const itemEl = renderTaskItem({
      parent: list,
      itemData: defaultItem,
      onEdit,
      onDelete: (): any => {},
    });
    const checkboxEl = itemEl.querySelector(".item__input-checkbox");
    if (itemEl !== null && checkboxEl !== null) {
      (checkboxEl as HTMLInputElement).click();
      expect(onEdit).toHaveBeenCalled();
    } else {
      throw new Error("itemEl is null");
    }
  });

  it("should handle an error on checkbox click", () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    const onEdit = jest.fn(async (): Promise<TodoItem | undefined> => Promise.reject(new Error("Error")));
    const itemEl = renderTaskItem({
      parent: list,
      itemData: defaultItem,
      onEdit,
      onDelete: (): any => {},
    });
    const checkboxEl = itemEl.querySelector(".item__input-checkbox");

    if (itemEl !== null && checkboxEl !== null) {
      (checkboxEl as HTMLInputElement).click();
      expect(onEdit).toHaveBeenCalled();
      sleep()
        .then(() => {
          expect(consoleErrorMock).toHaveBeenCalled();
        })
        .catch(() => {});
    } else {
      throw new Error("itemEl is null");
    }
  });
});
