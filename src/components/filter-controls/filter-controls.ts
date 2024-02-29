import "./style.css";

export function renderFilterControls(
  parent: HTMLElement,
  onFilter: (filterData: {
    taskText: string;
    taskDateFrom: string;
    taskDateTo: string;
    taskStatus: string;
    taskTags: string;
  }) => void,
): HTMLElement {
  const filterControls = document.createElement("form");
  filterControls.className = "filter-controls filter";
  filterControls.id = "filter-controls";

  filterControls.innerHTML = ` \
    <fieldset class="filter__fieldset">
      <legend>Filter</legend>
      <div class="filter__group">
        <label class="filter__label">From date:</label>
        <input class="filter__date-from" name="filterDateFrom" type="date">
      </div>

      <div class="filter__group">
      <label class="filter__label">To date:</label>
      <input class="filter__date-to" name="filterDateTo" type="date">
    </div>

      <div class="filter__group">
        <label class="filter__label">By text content:</label>
        <input class="filter__text" name="filterText" type="text" placeholder="Search">
      </div>

      <div class="filter__group">
        <label class="filter__label">By status:</label>
        <select class="filter__status" name="filterStatus">
          <option value="">All</option>
          <option value="0">Todo</option>
          <option value="1">Done</option>
        </select>
      </div>

      <div class="filter__group">
        <label class="filter__label">By tag:</label>
        <input class="filter__tags" name="filterTags" type="text" placeholder="Tags">
      </div>

      <div class="filter__group">
        <button type="submit" class="filter__btn-filter">Filter</button>
        <button class="filter__btn-clear" ">Filter</button>
      </div>
    </fieldset>
  `;

  parent.append(filterControls);

  filterControls.addEventListener("submit", (ev: Event) => {
    ev.preventDefault();
    const taskText = (filterControls.elements.namedItem("filterText") as HTMLInputElement).value;
    const taskDateFrom = (filterControls.elements.namedItem("filterDateFrom") as HTMLInputElement).value;
    let taskDateTo = (filterControls.elements.namedItem("filterDateTo") as HTMLInputElement).value;
    const taskStatus = (filterControls.elements.namedItem("filterStatus") as HTMLInputElement).value;

    if (new Date(taskDateFrom) > new Date(taskDateTo)) {
      taskDateTo = taskDateFrom;
      (filterControls.querySelector(".filter__date-to") as HTMLInputElement).value = taskDateTo;
    }
    const taskTags = (filterControls.elements.namedItem("filterTags") as HTMLInputElement).value;
    onFilter({ taskText, taskDateFrom, taskDateTo, taskStatus, taskTags });
  });

  return filterControls;
}
