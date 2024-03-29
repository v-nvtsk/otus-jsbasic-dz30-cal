import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderFilterControls } from "./filter-controls";

describe("FilterControls", () => {
  it("should be a function", () => {
    expect(renderFilterControls).toBeInstanceOf(Function);
  });

  let parent: HTMLElement;
  let filterForm: HTMLFormElement;
  let filterDateFrom: HTMLInputElement;
  let filterDateTo: HTMLInputElement;
  let filterText: HTMLInputElement;
  let filterStatus: HTMLSelectElement;
  let filterTags: HTMLSelectElement;
  let filterBtn: HTMLButtonElement;
  let clearBtn: HTMLButtonElement;
  const onFilter = jest.fn();

  beforeEach(() => {
    if (!parent) parent = document.createElement("div");
    parent.innerHTML = "";
    renderFilterControls(parent, onFilter);

    filterForm = parent.querySelector(".filter-controls")!;
    filterDateFrom = parent.querySelector(".filter__date-from")!;
    filterDateTo = parent.querySelector(".filter__date-to")!;
    filterText = parent.querySelector(".filter__text")!;
    filterStatus = parent.querySelector(".filter__status")!;
    filterTags = parent.querySelector(".filter__tags")!;
    filterBtn = parent.querySelector(".filter__btn-filter")!;
    clearBtn = parent.querySelector(".filter__btn-clear")!;
  });

  it("should create initial markup", () => {
    expect(parent.innerHTML).not.toBe("");
    expect(parent.querySelector(".filter-controls")).not.toBeNull();
    expect(filterDateFrom).not.toBeNull();
    expect(filterDateTo).not.toBeNull();
    expect(filterText).not.toBeNull();
    expect(filterStatus).not.toBeNull();
    expect(filterTags).not.toBeNull();
    expect(filterBtn).not.toBeNull();
    expect(clearBtn).not.toBeNull();
  });

  it("should call onFilter function on filter button click", () => {
    filterDateFrom.value = "2024-01-01";
    filterForm.submit();
    expect(onFilter).toHaveBeenCalledTimes(1);
    expect(onFilter).toHaveBeenLastCalledWith({
      taskText: "",
      taskDateFrom: "2024-01-01",
      taskDateTo: "",
      taskStatus: "",
      taskTags: "",
    });

    filterDateTo.value = "2024-01-02";
    filterForm.submit();
    expect(onFilter).toHaveBeenCalledTimes(2);
    expect(onFilter).toHaveBeenLastCalledWith({
      taskText: "",
      taskDateFrom: "2024-01-01",
      taskDateTo: "2024-01-02",
      taskStatus: "",
      taskTags: "",
    });

    filterText.value = "test";
    filterForm.submit();
    expect(onFilter).toHaveBeenCalledTimes(3);
    expect(onFilter).toHaveBeenLastCalledWith({
      taskText: "test",
      taskDateFrom: "2024-01-01",
      taskDateTo: "2024-01-02",
      taskStatus: "",
      taskTags: "",
    });

    filterStatus.value = "1";
    filterForm.submit();
    expect(onFilter).toHaveBeenCalledTimes(4);
    expect(onFilter).toHaveBeenLastCalledWith({
      taskText: "test",
      taskDateFrom: "2024-01-01",
      taskDateTo: "2024-01-02",
      taskStatus: "1",
      taskTags: "",
    });

    filterTags.value = "tag1";
    filterForm.submit();
    expect(onFilter).toHaveBeenCalledTimes(5);
    expect(onFilter).toHaveBeenLastCalledWith({
      taskText: "test",
      taskDateFrom: "2024-01-01",
      taskDateTo: "2024-01-02",
      taskStatus: "1",
      taskTags: "tag1",
    });

    filterDateFrom.value = "2024-02-01";
    filterDateTo.value = "2024-01-02";
    filterForm.submit();
    expect(onFilter).toHaveBeenCalledTimes(6);
    expect(onFilter).toHaveBeenLastCalledWith({
      taskText: "test",
      taskDateFrom: "2024-02-01",
      taskDateTo: "2024-02-01",
      taskStatus: "1",
      taskTags: "tag1",
    });
  });
  it("should clear form on clear button click", () => {
    filterDateFrom.value = "2024-01-01";
    filterDateTo.value = "2024-01-02";
    filterText.value = "test";
    filterStatus.value = "1";
    filterTags.value = "tag1";

    clearBtn.click();
    expect(filterDateFrom.value).toBe("");
    expect(filterDateTo.value).toBe("");
    expect(filterText.value).toBe("");
    expect(filterStatus.value).toBe("");
    expect(filterTags.value).toBe("");
  });
});
