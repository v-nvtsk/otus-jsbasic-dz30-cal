import "./style.css";

export function taskAdd(
  parent: HTMLElement,
  onAddTask: (taskText: string, taskDateStart: string, taskTags: string) => void,
): HTMLElement {
  const taskAddForm = document.createElement("form");
  taskAddForm.className = "task-add";
  taskAddForm.id = "task-add-form";

  taskAddForm.innerHTML = ` \
  <fieldset class="task-add__fieldset">
    <legend>Add task</legend>
    <div class="task-add__group">
      <label class="task-add__label">Task:</label>
      <input type="text" name="taskText" class="task-add__input-text" placeholder="Enter task..." required>
    </div>
    <div class="task-add__group">
      <label class="task-add__label">Due date:</label>
      <input type="date" name="taskDate" class="task-add__input-date" required>
    </div>
    <div class="task-add__group">
      <label class="task-add__label">Tags:</label>
      <input type="text" name="taskTags" class="task-add__input-tags" placeholder="Enter comma separated tags">
    </div>
    <div class="task-add__group">
      <button type="submit" class="task-add__btn-add">Add</button>
    </div>
  </fieldset>
  `;
  parent.append(taskAddForm);

  taskAddForm.addEventListener("submit", (ev: Event) => {
    ev.preventDefault();
    if (taskAddForm.checkValidity()) {
      const taskText = (taskAddForm.elements.namedItem("taskText") as HTMLInputElement).value;
      const taskDate = (taskAddForm.elements.namedItem("taskDate") as HTMLInputElement).value;
      const taskTags = (taskAddForm.elements.namedItem("taskTags") as HTMLInputElement).value;
      onAddTask(taskText, taskDate, taskTags);
      taskAddForm.reset();
    }
  });

  return taskAddForm;
}
