import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Calendar } from "./calendar";
import { LocalStore } from "../../api/local-store";

const sleep = async (x: number = 0) =>
  new Promise((resolve) => {
    setTimeout(resolve, x);
  });

describe("Calendar", () => {
  const root = document.createElement("div");
  let calendar: Calendar;
  let taskAddForm: HTMLFormElement;
  let filterForm: HTMLFormElement;
  let taskListEl: HTMLElement;

  let lsCreate = jest.spyOn(LocalStore.prototype, "create");
  let lsRead = jest.spyOn(LocalStore.prototype, "read");
  let lsDelete = jest.spyOn(LocalStore.prototype, "delete");
  let lsUpdate = jest.spyOn(LocalStore.prototype, "update");

  beforeEach(async () => {
    root.innerHTML = "";
    calendar = new Calendar(root)!;
    calendar.init();
    await sleep();
    taskAddForm = root.querySelector(".task-add")! as HTMLFormElement;
    filterForm = root.querySelector(".filter-controls")!;
    taskListEl = root.querySelector(".task-list")!;

    lsCreate = jest.spyOn(LocalStore.prototype, "create");
    lsRead = jest.spyOn(LocalStore.prototype, "read");
    lsDelete = jest.spyOn(LocalStore.prototype, "delete");
    lsUpdate = jest.spyOn(LocalStore.prototype, "update");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should be a function", () => {
    expect(calendar).toBeInstanceOf(Calendar);
  });

  it("should create initial markup", () => {
    expect(root.innerHTML).not.toBe("");
    expect(taskAddForm).not.toBeNull();
    expect(filterForm).not.toBeNull();
    expect(taskListEl).not.toBeNull();
  });

  it("should handle onAddTask", async () => {
    (taskAddForm.querySelector(".task-add__input-text") as HTMLInputElement).value = "New task";
    (taskAddForm.querySelector(".task-add__input-date") as HTMLInputElement).value = "2022-01-01";
    (taskAddForm.querySelector(".task-add__input-tags") as HTMLInputElement).value = "tag1, tag2";

    taskAddForm.submit();
    await sleep();
    expect(localStorage.length).toBe(1);
  });

  it("should handle onFilter", async () => {
    expect(localStorage.length).toBe(0);
    expect(taskListEl.querySelectorAll(".list-item").length).toBe(0);

    (taskAddForm.querySelector(".task-add__input-text") as HTMLInputElement).value = "New task";
    (taskAddForm.querySelector(".task-add__input-date") as HTMLInputElement).value = "2022-01-01";
    (taskAddForm.querySelector(".task-add__input-tags") as HTMLInputElement).value = "tag1, tag2";

    taskAddForm.submit();
    await sleep();
    expect(lsCreate).toHaveBeenCalled();

    filterForm.submit();
    await sleep();
    expect(lsRead).toHaveBeenLastCalledWith({});

    const filterDateFrom = filterForm.querySelector(".filter__date-from") as HTMLInputElement;
    const filterDateTo = filterForm.querySelector(".filter__date-to") as HTMLInputElement;
    const filterText = filterForm.querySelector(".filter__text") as HTMLInputElement;
    const filterStatus = filterForm.querySelector(".filter__status") as HTMLInputElement;
    const filterTags = filterForm.querySelector(".filter__tags") as HTMLInputElement;

    filterDateFrom.value = "2023-01-01";
    filterDateTo.value = "2023-01-01";
    filterText.value = "Some test for test";
    filterTags.value = "Missing tags";
    filterStatus.value = "0";

    filterForm.submit();
    await sleep();
    expect(lsRead).toHaveBeenLastCalledWith({
      dateFrom: new Date(filterDateFrom.value),
      dateTo: new Date(filterDateTo.value),
      taskText: filterText.value,
      taskTags: filterTags.value,
      status: Boolean(Number(filterStatus.value)),
    });
  });

  it("should handle onDelete", async () => {
    expect(localStorage.length).toBe(0);
    expect(taskListEl.querySelectorAll(".list-item").length).toBe(0);

    (taskAddForm.querySelector(".task-add__input-text") as HTMLInputElement).value = "New task";
    (taskAddForm.querySelector(".task-add__input-date") as HTMLInputElement).value = "2022-01-01";
    (taskAddForm.querySelector(".task-add__input-tags") as HTMLInputElement).value = "tag1, tag2";

    taskAddForm.submit();
    await sleep();
    expect(lsCreate).toHaveBeenCalled();

    const deleteBtn = taskListEl.querySelector(".item__btn-delete") as HTMLButtonElement;
    deleteBtn.click();
    await sleep();
    expect(lsDelete).toHaveBeenCalled();
  });

  it("should handle onEdit", async () => {
    expect(localStorage.length).toBe(0);
    expect(taskListEl.querySelectorAll(".list-item").length).toBe(0);

    (taskAddForm.querySelector(".task-add__input-text") as HTMLInputElement).value = "New task";
    (taskAddForm.querySelector(".task-add__input-date") as HTMLInputElement).value = "2022-01-01";
    (taskAddForm.querySelector(".task-add__input-tags") as HTMLInputElement).value = "tag1, tag2";

    taskAddForm.submit();
    await sleep();
    expect(lsCreate).toHaveBeenCalled();
    const checkBox = taskListEl.querySelector(".item__input-checkbox") as HTMLInputElement;

    checkBox.click();
    await sleep();
    expect(lsUpdate).toHaveBeenCalled();
  });
});
