import "./style.css";

export function taskAdd(
  parent: HTMLElement,
  onAddTask: (taskText: string, taskDateStart: string, taskTags: string) => void,
): HTMLElement {
  const taskAddForm = document.createElement("form");
  taskAddForm.className = "task-add";

  taskAddForm.innerHTML = ` \
  <fieldset class="task-add__fieldset">
    <legend>Add task</legend>
    <div class="task-add__group">
      <label class="task-add__label">Task:</label>
      <input type="text" class="task-add__input-text" placeholder="Enter task..." required>
    </div>
    <div class="task-add__group">
      <label class="task-add__label">Due date:</label>
      <input type="date" class="task-add__input-date" required>
    </div>
    <div class="task-add__group">
      <label class="task-add__label">Tags:</label>
      <input type="text" class="task-add__input-tags" placeholder="Enter comma separated tags">
    </div>
    <div class="task-add__group">
      <button class="task-add__btn-add">Add</button>
    </div>
  </fieldset>
  `;
  parent.append(taskAddForm);

  taskAddForm.querySelector(".task-add__btn-add")?.addEventListener("click", (ev: Event) => {
    ev.preventDefault();
    if (taskAddForm.checkValidity()) {
      const taskText = (taskAddForm.querySelector(".task-add__input-text") as HTMLInputElement)!.value;
      const taskDate = (taskAddForm.querySelector(".task-add__input-date") as HTMLInputElement)!.value;
      const taskTags = (taskAddForm.querySelector(".task-add__input-tags") as HTMLInputElement)!.value;
      onAddTask(taskText, taskDate, taskTags);
    }
  });

  return taskAddForm;
}
