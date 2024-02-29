// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc, addDoc, Firestore } from "firebase/firestore";
import { type Filter, type CalendarAPI, type TodoItem, APP_PREFIX, USER_PREFIX, UpdateTodoItem } from "./calendar-api";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBTsQ82-UIICuUNrkAV9uuhiQjOpyK1iOI",
  authDomain: "nv-otus.firebaseapp.com",
  projectId: "nv-otus",
  storageBucket: "nv-otus.appspot.com",
  messagingSenderId: "536193599681",
  appId: "1:536193599681:web:3404e99943955059312c40",
};

// Initialize Firebase

export class Firebase implements CalendarAPI {
  private app: FirebaseApp;

  private db!: Firestore;

  private readonly namespace: string = `${APP_PREFIX}@${USER_PREFIX}#`;

  constructor(userPrefix?: string) {
    this.namespace = userPrefix !== undefined ? `${APP_PREFIX}@${userPrefix}#` : this.namespace;
    this.app = initializeApp(firebaseConfig);

    if (this.app) this.db = getFirestore(this.app);
  }

  async create(data: TodoItem): Promise<string | undefined> {
    try {
      const response = await addDoc(collection(this.db, this.namespace), data);
      return response.id;
    } catch (e: any) {
      if (e instanceof Error) throw new Error(`firebase read error: ${e.message}`);
    }
    return undefined;
  }

  async read(filter: Partial<Filter>): Promise<any[]> {
    const allItems = await this.findAllRecords();
    const filteredItems = allItems
      .filter((el) => {
        let result = true;
        if (filter.taskText !== undefined && !el.taskText.includes(filter.taskText)) result = false;
        if (filter.status !== undefined && filter.status !== el.status) result = false;

        const dueDateUTC = new Date(el.dueDateUTC);
        if (filter.dateFrom !== undefined && dueDateUTC < filter.dateFrom) result = false;
        if (filter.dateTo !== undefined && dueDateUTC > filter.dateTo) result = false;
        if (filter.taskTags !== undefined && !el.tags.includes(filter.taskTags)) result = false;
        return result;
      })
      .sort((el1, el2) => {
        if (el1.creationDateUTC < el2.creationDateUTC) return -1;
        if (el1.creationDateUTC > el2.creationDateUTC) return 1;
        return 0;
      });
    return filteredItems;
  }

  async update(item: UpdateTodoItem): Promise<TodoItem | undefined> {
    if (item.id === undefined) return undefined;
    const docRef = doc(this.db, this.namespace, item.id);

    const dbItem: Partial<TodoItem> = {};
    dbItem.id = item.id;
    if (item.taskText && item.taskText !== "") dbItem.taskText = item.taskText;
    if (item.status !== undefined) dbItem.status = item.status;

    await updateDoc(docRef, dbItem);
    const resultItems: TodoItem[] = await this.read({});
    if (!resultItems) return undefined;
    const result = resultItems.find((el: TodoItem) => el.id === item.id);
    return result as TodoItem;
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.db, this.namespace, id));
  }

  private async findAllRecords(): Promise<TodoItem[]> {
    try {
      const response = await getDocs(collection(this.db, this.namespace));
      const newData = response.docs.map((newDoc) => ({
        id: newDoc.id,
        taskText: newDoc.data().taskText,
        status: newDoc.data().status,
        tags: newDoc.data().tags,
        creationDateUTC: newDoc.data().creationDateUTC,
        dueDateUTC: newDoc.data().dueDateUTC,
      }));
      return newData;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("firebase read error: ", e);
      return [];
    }
  }
}
