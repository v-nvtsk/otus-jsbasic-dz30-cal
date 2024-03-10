import { API_KEY, DB_NAME, Firebase } from "./firebase";
import { APP_PREFIX, TodoItem, USER_PREFIX, UpdateTodoItem } from "./calendar-api";

describe("firebase", () => {
  const testTodoItem: TodoItem = {
    taskText: "test",
    status: false,
    tags: "tag1, tag2",
    creationDateUTC: new Date().toISOString(),
    dueDateUTC: new Date().toISOString(),
    id: "testTodoItem_id",
  };

  const testAuthData = {
    localId: "test_local_id",
    idToken: "test_token",
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(testAuthData),
    }),
  ) as jest.Mock;

  const fireStore = new Firebase(USER_PREFIX);

  it("should be an instance of Firebase", () => {
    expect(fireStore).toBeInstanceOf(Firebase);
    expect(fireStore.authenticate).toBeInstanceOf(Function);
    expect(fireStore.create).toBeInstanceOf(Function);
    expect(fireStore.read).toBeInstanceOf(Function);
    expect(fireStore.update).toBeInstanceOf(Function);
    expect(fireStore.delete).toBeInstanceOf(Function);
  });

  it("should authenticate", async () => {
    expect(fireStore.authenticate).toBeInstanceOf(Function);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(testAuthData),
      }),
    ) as jest.Mock;

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: USER_PREFIX,
        password: "123456",
        returnSecureToken: true,
      }),
    };
    await fireStore.authenticate();
    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(url, options);
  });

  it("should create", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(testAuthData),
      }),
    ) as jest.Mock;

    const url = `https://${DB_NAME}.firebaseio.com/${APP_PREFIX}/${testAuthData.localId}.json?auth=${testAuthData.idToken}`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testTodoItem),
    };
    await fireStore.create(testTodoItem);
    expect(global.fetch).toHaveBeenLastCalledWith(url, options);
  });

  it("should read", async () => {
    global.fetch = jest.fn((url) => {
      if (url.includes(`${APP_PREFIX}/${testAuthData.localId}.json`))
        return Promise.resolve({
          json: () => Promise.resolve({ some_name: testTodoItem }),
        });
      return Promise.resolve({
        json: () => Promise.resolve(testAuthData),
      });
    }) as jest.Mock;

    expect(await fireStore.read({ taskText: "testing non existing filter" })).toEqual([]);

    const url = `https://${DB_NAME}.firebaseio.com/${APP_PREFIX}/${testAuthData.localId}.json?auth=${testAuthData.idToken}`;
    const getOptions = {
      method: "GET",
    };
    await fireStore.create(testTodoItem);
    await fireStore.read({});

    expect(global.fetch).toHaveBeenLastCalledWith(url, getOptions);
  });

  it("should return sorted by date on read", async () => {
    const returnData = {
      testTodoItem1: { ...testTodoItem, creationDateUTC: "2024-03-10T00:00:00.000Z" },
      testTodoItem2: { ...testTodoItem, creationDateUTC: "2025-03-10T00:00:00.000Z" },
      testTodoItem3: { ...testTodoItem, creationDateUTC: "2022-03-10T00:00:00.000Z" },
      testTodoItem4: { ...testTodoItem, creationDateUTC: "2022-03-10T00:00:00.000Z" },
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(returnData),
      }),
    ) as jest.Mock;

    expect(await fireStore.read({})).toEqual([
      returnData.testTodoItem3,
      returnData.testTodoItem4,
      returnData.testTodoItem1,
      returnData.testTodoItem2,
    ]);
  });

  it("should return empty array if no data after filter", async () => {
    const testTodoItem1: TodoItem = {
      taskText: "filtered test",
      status: false,
      tags: "tag1, tag2",
      creationDateUTC: new Date(2024, 2, 1).toISOString(),
      dueDateUTC: "2024-03-10T02:25:57.402Z",
    };
    const testTodoItem2: TodoItem = {
      taskText: "test",
      status: false,
      tags: "tag1, tag2",
      creationDateUTC: new Date(2023, 2, 2).toISOString(),
      dueDateUTC: "2024-03-10T00:00:00.000Z",
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            testTodoItem_id1: testTodoItem1,
            testTodoItem_id2: testTodoItem2,
          }),
      }),
    ) as jest.Mock;

    expect(
      await fireStore.read({
        taskText: "filtered test with missing text",
        status: true,
        dateFrom: new Date(2025, 2, 1),
        dateTo: new Date(2022, 4, 1),
        taskTags: "fault tag",
      }),
    ).toEqual([]);
  });

  it("should update", async () => {
    global.fetch = jest.fn((url) => {
      if (url.includes(`${APP_PREFIX}/${testAuthData.localId}`))
        return Promise.resolve({
          json: () => Promise.resolve({ some_name: testTodoItem }),
        });
      return Promise.resolve({
        json: () => Promise.resolve(testAuthData),
      });
    }) as jest.Mock;

    fireStore.create(testTodoItem);

    const testTodoItem2 = { ...testTodoItem, taskText: "test2" };

    const url = `https://${DB_NAME}.firebaseio.com/${APP_PREFIX}/${testAuthData.localId}/${testTodoItem.id}.json?auth=${testAuthData.idToken}`;
    const updateOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testTodoItem2),
    };

    await fireStore.update(testTodoItem2 as UpdateTodoItem);
    expect(global.fetch).toHaveBeenLastCalledWith(url, updateOptions);
  });

  it("should not update without id", async () => {
    expect(await fireStore.update({} as UpdateTodoItem)).toBe(undefined);
  });

  it("should delete", async () => {
    global.fetch = jest.fn((url) => {
      if (url.includes(`${APP_PREFIX}/${testAuthData.localId}`))
        return Promise.resolve({
          json: () => Promise.resolve({ some_name: testTodoItem }),
        });
      return Promise.resolve({
        json: () => Promise.resolve(testAuthData),
      });
    }) as jest.Mock;

    const url = `https://${DB_NAME}.firebaseio.com/${APP_PREFIX}/${testAuthData.localId}/${testTodoItem.id}.json?auth=${testAuthData.idToken}`;
    const updateOptions = {
      method: "DELETE",
    };

    await fireStore.delete(testTodoItem.id!);
    expect(global.fetch).toHaveBeenLastCalledWith(url, updateOptions);
  });
});
