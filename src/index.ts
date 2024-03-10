import { Firebase } from "./api/firebase";
import { LocalStore } from "./api/local-store";
import "./style.css";
import { Calendar } from "./components/calendar/calendar";
import { createElementFromHTML } from "./utils/create-element-from-html";

const root = createElementFromHTML(
  `<div id="root" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;"></div>`,
)[0] as HTMLElement;
document.body.append(root);

// Демонстрация работы с LocalStorage
const calendarWithLocalStore = new Calendar(root, new LocalStore("user"));
calendarWithLocalStore.init();

// // Раскомментировать, чтобы проверить работу одновременной работы
// // с LocalStorage в разных пространствах имен
// const calendarWithLocalStore2 = new Calendar(root, new LocalStore("other"));
// calendarWithLocalStore2.init();

// Демонстрация работы с Firebase (не покрыта тестами, оставила для демонстрации)
const calendarWithFireStore = new Calendar(root, new Firebase());
calendarWithFireStore.init();
