import { type TodoItem, type CalendarAPI, type Filter, UpdateTodoItem } from "./calendar-api";
import { APP_PREFIX, USER_PREFIX } from "./calendar-api";

export class LocalStore implements CalendarAPI {
  private readonly namespace: string = `${APP_PREFIX}@${USER_PREFIX}#`;

  constructor(userPrefix?: string) {
    this.namespace = userPrefix !== undefined ? `${APP_PREFIX}@${userPrefix}#` : this.namespace;
  }

  /**
   * Create a new todo item.
   *
   * @param {TodoItem} data - the todo item data to be created
   * @return {Promise<string>} a promise that resolves with the created todo item's ID
   */
  public async create(data: TodoItem): Promise<string | undefined> {
    const newItem = { ...data };
    newItem.id = new Date().valueOf().toString();
    return new Promise((resolve) => {
      localStorage.setItem(this.namespace + newItem.id!, JSON.stringify(newItem));
      resolve(newItem.id);
    });
  }

  public async read(filter: Partial<Filter>): Promise<TodoItem[]> {
    const allItems = Array.from({ length: localStorage.length }, (_, i) => {
      const key = localStorage.key(i);
      return { [key!]: localStorage.getItem(key!) };
    }).reduce((acc, el) => ({ ...acc, ...el }), {});

    const calendarItems: TodoItem[] = Object.entries(allItems)
      .filter(([key]) => key.startsWith(this.namespace))
      .map(([, value]) => {
        let result = null;
        result = JSON.parse(value!);
        return result;
      });

    const filteredItems = calendarItems.filter((el) => {
      let result = true;

      if (filter.taskText !== undefined && !el.taskText.includes(filter.taskText)) result = false;
      if (filter.status !== undefined && filter.status !== el.status) result = false;
      const dueDateUTC = new Date(el.dueDateUTC);
      if (filter.dateFrom !== undefined && dueDateUTC < filter.dateFrom) result = false;
      if (filter.dateTo !== undefined && dueDateUTC > filter.dateTo) result = false;
      if (filter.taskTags !== undefined && !el.tags.includes(filter.taskTags)) result = false;

      return result;
    });

    return new Promise((resolve) => {
      resolve(filteredItems);
    });
  }

  public async update(data: UpdateTodoItem): Promise<TodoItem | undefined> {
    const updatedData = { ...data };
    return new Promise((resolve, reject) => {
      let item = localStorage.getItem(this.namespace + updatedData.id);
      if (item === null) {
        reject(new Error("Not found"));
      } else {
        const savedItem = JSON.parse(item) as TodoItem;
        updatedData.creationDateUTC = savedItem.creationDateUTC;
        updatedData.dueDateUTC = savedItem.dueDateUTC;
        if (!updatedData.taskText) updatedData.taskText = savedItem.taskText;
        if (!updatedData.status) updatedData.status = savedItem.status;
        updatedData.tags = savedItem.tags;
      }
      localStorage.setItem(this.namespace + updatedData.id, JSON.stringify(updatedData));
      item = localStorage.getItem(this.namespace + updatedData.id);
      resolve(JSON.parse(item!) as TodoItem);
    });
  }

  public async delete(id: string): Promise<void> {
    await new Promise((resolve) => {
      localStorage.removeItem(this.namespace + id);
      resolve(null);
    });
  }
}
