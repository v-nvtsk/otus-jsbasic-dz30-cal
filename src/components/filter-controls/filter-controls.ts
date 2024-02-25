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

  filterControls.innerHTML = ` \
    <fieldset class="filter__fieldset">
      <legend>Filter</legend>
      <div class="filter__group">
        <label class="filter__label">From date:</label>
        <input class="filter__date-from" type="date">
      </div>

      <div class="filter__group">
      <label class="filter__label">To date:</label>
      <input class="filter__date-to" type="date">
    </div>

      <div class="filter__group">
        <label class="filter__label">By text content:</label>
        <input class="filter__text" type="text" placeholder="Search">
      </div>

      <div class="filter__group">
        <label class="filter__label">By status:</label>
        <select class="filter__status">
          <option value="">All</option>
          <option value="0">Todo</option>
          <option value="1">Done</option>
        </select>
      </div>

      <div class="filter__group">
        <label class="filter__label">By tag:</label>
        <input class="filter__tags"  type="text" placeholder="Tags">
      </div>

      <div class="filter__group">
        <button class="filter__btn-filter" type="submit">Filter</button>
      </div>
    </fieldset>
  `;

  parent.append(filterControls);

  filterControls.querySelector(".filter__btn-filter")?.addEventListener("click", (ev: Event) => {
    ev.preventDefault();
    const taskText = (filterControls.querySelector(".filter__text") as HTMLInputElement)!.value;
    const taskDateFrom = (filterControls.querySelector(".filter__date-from") as HTMLInputElement)!.value;
    let taskDateTo = (filterControls.querySelector(".filter__date-to") as HTMLInputElement)!.value;
    const taskStatus = (filterControls.querySelector(".filter__status") as HTMLInputElement)!.value;

    if (new Date(taskDateFrom) > new Date(taskDateTo)) {
      taskDateTo = taskDateFrom;
      (filterControls.querySelector(".filter__date-to") as HTMLInputElement).value = taskDateTo;
    }

    const taskTags = (filterControls.querySelector(".filter__tags") as HTMLInputElement)!.value;
    onFilter({ taskText, taskDateFrom, taskDateTo, taskStatus, taskTags });
  });

  return filterControls;
}
