import { UpdateTodoItem, type TodoItem } from "../../api/calendar-api";
import { createElementFromHTML } from "../../utils/create-element-from-html";
import "./style.css";

function renderTags(tags: string): string {
  let result: string = "";
  if (tags.length === 0) {
    result = "";
  } else {
    result = tags
      .split(",")
      .map((tag) => `<span class="tags_tag">${tag.trim()}</span>`)
      .join(" ");
  }

  return result;
}

function saveAfterEdit(
  id: string,
  newItem: Element,
  onEdit: (data: UpdateTodoItem) => Promise<TodoItem | undefined>,
): void {
  const taskTextEl: HTMLInputElement | null = newItem.querySelector(".item__input-text");
  const taskTextLabel = newItem.querySelector(".item__title");
  if (taskTextEl !== null && taskTextLabel !== null) {
    taskTextLabel.textContent = taskTextEl.value;
    onEdit({ id, taskText: taskTextEl.value }).catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
    });
  }
}

export function renderTaskItem(options: {
  parent: HTMLElement;
  itemData: TodoItem;
  onDelete: (id: string) => Promise<void>;
  onEdit: (data: UpdateTodoItem) => Promise<TodoItem | undefined>;
}): Element {
  const { parent, itemData, onDelete, onEdit } = options;

  const newItem = createElementFromHTML(`
  <li class="list__item" data-id="${itemData.id}">
      <div class="item__checkbox">
        <input class="item__input-checkbox" type="checkbox">
      </div>
      <div class="input__wrapper">
        <label class="item__title task">${itemData.taskText}</label>
        <input class="item__input-text task" type="text" value="${itemData.taskText}">
      </div>
      <div class="item__dates">
        <span class="item__creation-date">Created: ${new Date(itemData.creationDateUTC).toLocaleDateString()}</span>
        <span class="item__due-date">Complete due: ${new Date(itemData.dueDateUTC).toLocaleDateString()}</span>
      </div>
      <div class="item__btn">
        <button class="btn item__btn-edit" data-id="${itemData.id}">✏️</button>
        <button class="btn item__btn-delete" data-id="${itemData.id}">🗑️</button>
      </div>
      <div class="item__task-tags tags">
        ${renderTags(itemData.tags)}
      </div>
  </li>`)[0];

  if (itemData.status) {
    const checkbox = newItem.querySelector(".item__input-checkbox")!;
    checkbox.setAttribute("checked", "checked");
  }
  parent.append(newItem);

  newItem.addEventListener("click", (e) => {
    const id = itemData.id ?? "";
    if (e.target !== null) {
      const target = e.target as HTMLInputElement;
      if (target.classList.contains("item__input-checkbox")) {
        onEdit({ id, status: target.checked }).catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
      } else if (target.classList.contains("item__btn-edit")) {
        if (newItem.classList.contains("edit-mode")) {
          saveAfterEdit(id, newItem, onEdit);
        }
        newItem.classList.toggle("edit-mode");
      } else if (target.classList.contains("item__btn-delete")) {
        onDelete(id)
          .then(() => {
            newItem.remove();
          })
          // eslint-disable-next-line no-console
          .catch(console.error);
      }
    }
  });

  return newItem;
}
