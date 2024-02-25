import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { LocalStore } from "./local-store";
import { APP_PREFIX, UpdateTodoItem, type TodoItem } from "./calendar-api";

describe("LocalStore", () => {
  let localStore: LocalStore;
  const USER_PREFIX = "test";
  const namespace = `${APP_PREFIX}@${USER_PREFIX}#`;

  beforeEach(() => {
    localStore = new LocalStore(USER_PREFIX);
  });

  afterEach(() => {
    localStorage.clear();
  });

  const defaultItem: TodoItem = {
    id: "1",
    taskText: "test",
    status: true,
    tags: "tag1, tag2",
    dueDateUTC: new Date(2024, 2, 1).toUTCString(),
    creationDateUTC: new Date().toUTCString(),
  };

  it("should be a function", () => {
    expect(localStore).toBeInstanceOf(LocalStore);
  });

  it("should create a new todo item", async () => {
    const testItem = { ...defaultItem };
    const testId = new Date(testItem.creationDateUTC).valueOf().toString();
    const setItem = jest.spyOn(Storage.prototype, "setItem");
    testItem.id = testId;

    const newId = await localStore.create(testItem);
    testItem.id = newId;
    expect(setItem).toHaveBeenLastCalledWith(namespace + newId, JSON.stringify(testItem));
  });

  it("should read all todo items", async () => {
    const testData: TodoItem[] = [];
    const testItemsCount = 10;
    for (let i = 0; i < testItemsCount; i += 1) {
      const testItem = { ...defaultItem };
      const testId = new Date(2024, 2, i + 1).valueOf().toString();
      testItem.id = testId;
      testData.push(testItem);
      localStorage.setItem(`${namespace}${testId}`, JSON.stringify(testItem));
    }
    expect(localStorage.length).toBe(testItemsCount);

    const getItem = jest.spyOn(Storage.prototype, "getItem");

    const result = await localStore.read({});
    expect(getItem).toHaveBeenCalledTimes(testItemsCount);
    expect(result[0]).toEqual(testData[0]);
  });

  it("should read filtered by text items", async () => {
    const testData: TodoItem[] = [];
    const testItemsCount = 10;
    for (let i = 0; i < testItemsCount; i += 1) {
      const testItem = { ...defaultItem };
      const testId = new Date(2024, 2, i + 1).valueOf().toString();
      testItem.id = testId;
      testItem.taskText = `test${i}`;
      testData.push(testItem);
      localStorage.setItem(`${namespace}${testId}`, JSON.stringify(testItem));
    }
    expect(localStorage.length).toBe(testItemsCount);

    testData.forEach(async (item) => {
      const result = await localStore.read({ taskText: item.taskText });
      expect(result[0].taskText).toEqual(item.taskText);
    });
  });

  it("should read filtered by status items", async () => {
    const testData: TodoItem[] = [];
    const testItemsCount = 10;
    for (let i = 0; i < testItemsCount; i += 1) {
      const testItem = { ...defaultItem };
      const testId = new Date(2024, 2, i + 1).valueOf().toString();
      testItem.id = testId;
      testItem.taskText = `test${i}`;
      testItem.status = Boolean(i % 2);
      testData.push(testItem);
      localStorage.setItem(`${namespace}${testId}`, JSON.stringify(testItem));
    }
    expect(localStorage.length).toBe(testItemsCount);
    let testStatus = true;
    let result = await localStore.read({ status: testStatus });
    expect(result.every((el) => el.status === testStatus)).toBe(true);
    expect(result.length).toBe(5);

    testStatus = false;
    result = await localStore.read({ status: testStatus });
    expect(result.every((el) => el.status === testStatus)).toBe(true);
    expect(result.some((el) => el.status === !testStatus)).toBe(false);

    expect(result.length).toBe(5);
  });

  it("should read filtered by date items", async () => {
    const testData: TodoItem[] = [];
    const testItemsCount = 10;
    for (let i = 1; i <= testItemsCount; i += 1) {
      const testItem = { ...defaultItem };
      const testId = new Date(2024, 2, i).valueOf().toString();
      testItem.id = testId;
      testItem.taskText = `test${i}`;
      testItem.dueDateUTC = new Date(2024, 2, i).toUTCString();
      testData.push(testItem);
      localStorage.setItem(`${namespace}${testId}`, JSON.stringify(testItem));
    }
    expect(localStorage.length).toBe(testItemsCount);

    testData.forEach(async (item, index) => {
      const testDate = new Date(item.dueDateUTC);
      const result = await localStore.read({ dateFrom: testDate });
      expect(result.length).toBe(testItemsCount - index);
    });

    testData.forEach(async (item, index) => {
      const testDate = new Date(item.dueDateUTC);
      const result = await localStore.read({ dateTo: testDate });
      expect(result.length).toBe(index + 1);
    });

    testData.forEach(async (item) => {
      const testDate = new Date(item.dueDateUTC);
      const result = await localStore.read({ dateFrom: testDate, dateTo: testDate });
      expect(result.length).toBe(1);
    });
  });

  it("should read filtered by tag items", async () => {
    const testData: TodoItem[] = [];
    const testItemsCount = 10;
    for (let i = 0; i < testItemsCount; i += 1) {
      const testItem = { ...defaultItem };
      const testId = new Date(2024, 2, i + 1).valueOf().toString();
      testItem.id = testId;
      testItem.taskText = `test${i}`;
      testItem.tags = `tag${i}`;
      testData.push(testItem);
      localStorage.setItem(`${namespace}${testId}`, JSON.stringify(testItem));
    }
    expect(localStorage.length).toBe(testItemsCount);
    testData.forEach(async (item) => {
      const result = await localStore.read({ taskTags: item.tags });
      expect(result.length).toBe(1);
    });
  });

  it("should delete item by id", async () => {
    const testData: TodoItem[] = [];
    const testItemsCount = 10;
    for (let i = 0; i < testItemsCount; i += 1) {
      const testItem = { ...defaultItem };
      const testId = new Date(2024, 2, i + 1).valueOf().toString();
      testItem.id = testId;
      testItem.taskText = `test task text${i}`;
      testData.push(testItem);
      localStorage.setItem(`${namespace}${testId}`, JSON.stringify(testItem));
    }
    expect(localStorage.length).toBe(testItemsCount);

    testData.forEach(async (item, index) => {
      expect(localStorage.length).toBe(testItemsCount - index);
      await localStore.delete(item.id!);
    });
  });

  it("should update tasktext by id", async () => {
    const testData: TodoItem[] = [];
    const testItemsCount = 10;
    for (let i = 0; i < testItemsCount; i += 1) {
      const testItem = { ...defaultItem };
      const testId = new Date(2024, 2, i + 1).valueOf().toString();
      testItem.id = testId;
      testItem.taskText = `test task text${i}`;
      testData.push(testItem);
      localStorage.setItem(`${namespace}${testId}`, JSON.stringify(testItem));
    }
    expect(localStorage.length).toBe(testItemsCount);

    testData.forEach(async (item, index) => {
      const resultItem = await localStore.update({ id: item.id!, taskText: `${item.taskText} updated ${index * 3}` });
      expect(resultItem).toEqual({ ...item, taskText: `${item.taskText} updated ${index * 3}` });
    });
  });

  it("should update status by id", async () => {
    const testData: TodoItem[] = [];
    const testItemsCount = 10;
    for (let i = 0; i < testItemsCount; i += 1) {
      const testItem = { ...defaultItem };
      const testId = new Date(2024, 2, i + 1).valueOf().toString();
      testItem.id = testId;
      testItem.status = false;
      testData.push(testItem);
      localStorage.setItem(`${namespace}${testId}`, JSON.stringify(testItem));
    }
    expect(localStorage.length).toBe(testItemsCount);

    testData.forEach(async (item) => {
      await localStore.update({ id: item.id!, status: !item.status });
    });
    const result = await localStore.read({});
    expect(result.every((el) => el.status === true)).toBe(true);
  });

  it("should handle error if update of non-exist item", () => {
    const testItem = { ...defaultItem };
    testItem.id = "not exist";
    return localStore.update(testItem as UpdateTodoItem).catch((err) => {
      expect(err.message).toBe("Not found");
    });
  });

  it("should create an instance without user prefix", async () => {
    const localStoreWithNoPrefix = new LocalStore();
    const testItem = { ...defaultItem };
    testItem.id = new Date().valueOf().toString();
    const newId = await localStoreWithNoPrefix.create(testItem);
    testItem.id = newId;
    expect(localStorage.length).toBe(1);
    expect(localStorage.key(0)?.startsWith("calendar@user#")).toBe(true);
  });
});
