import { type Filter, type CalendarAPI, type TodoItem, APP_PREFIX, USER_PREFIX, UpdateTodoItem } from "./calendar-api";

export const API_KEY = "AIzaSyBTsQ82-UIICuUNrkAV9uuhiQjOpyK1iOI";
export const DB_NAME = "nv-otus-default-rtdb";

export class Firebase implements CalendarAPI {
  private appPrefix: string = APP_PREFIX;

  private user: { [name: string]: string } = {};

  constructor(private userPrefix: string = USER_PREFIX) {
    this.authenticate();
  }

  async authenticate(): Promise<void> {
    const raw = JSON.stringify({
      email: this.userPrefix,
      password: "123456",
      returnSecureToken: true,
    });

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    };

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      requestOptions,
    );
    const user = await response.json();

    this.user = user;
  }

  async create(data: TodoItem): Promise<string | undefined> {
    await this.authenticate();
    const raw = JSON.stringify(data);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    };

    const response = await fetch(
      `https://${DB_NAME}.firebaseio.com/${this.appPrefix}/${this.user.localId}.json?auth=${this.user.idToken}`,
      requestOptions,
    );
    const result = await response.json();
    return result.name;
  }

  async read(filter: Partial<Filter>): Promise<any[]> {
    await this.authenticate();

    const requestOptions = {
      method: "GET",
    };

    const response = await fetch(
      `https://${DB_NAME}.firebaseio.com/${this.appPrefix}/${this.user.localId}.json?auth=${this.user.idToken}`,
      requestOptions,
    );
    const allItems = await response.json();

    // if (allItems !== null) {
    const filteredItems = Object.entries(allItems);
    return filteredItems
      .reduce((acc: TodoItem[], [_uid, value]) => {
        const el = value as TodoItem;
        el.id = _uid;
        let result = true;
        if (filter.taskText !== undefined && !el.taskText.includes(filter.taskText)) result = false;
        if (filter.status !== undefined && filter.status !== el.status) result = false;
        const dueDateUTC = new Date(el.dueDateUTC);
        if (filter.dateFrom !== undefined && dueDateUTC < filter.dateFrom) result = false;
        if (filter.dateTo !== undefined && dueDateUTC > filter.dateTo) result = false;
        if (filter.taskTags !== undefined && !el.tags.includes(filter.taskTags)) result = false;
        if (result) acc.push(el);
        return acc;
      }, [])
      .sort((el1: TodoItem, el2: TodoItem) => {
        if (el1.creationDateUTC < el2.creationDateUTC) return -1;
        if (el1.creationDateUTC > el2.creationDateUTC) return 1;
        return 0;
      });
    // }
    // return [];
  }

  async update(item: UpdateTodoItem): Promise<TodoItem | undefined> {
    if (item.id === undefined) return undefined;
    await this.authenticate();

    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    };

    const response = await fetch(
      `https://${DB_NAME}.firebaseio.com/${this.appPrefix}/${this.user.localId}/${item.id}.json?auth=${this.user.idToken}`,
      requestOptions,
    );
    const result = await response.json();
    return result as TodoItem;
  }

  async delete(id: string): Promise<void> {
    await this.authenticate();

    const requestOptions = {
      method: "DELETE",
    };

    await fetch(
      `https://${DB_NAME}.firebaseio.com/${this.appPrefix}/${this.user.localId}/${id}.json?auth=${this.user.idToken}`,
      requestOptions,
    );
  }
}
