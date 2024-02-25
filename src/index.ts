import { Firebase } from "./api/firebase";
import { LocalStore } from "./api/local-store";
import "./style.css";
import { Calendar } from "./components/calendar/calendar";

const root = document.createElement("div");
root.id = "root";
document.body.append(root);

root.style.cssText = ` \
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

// Демонстрация работы с LocalStorage
const localStore = new LocalStore("user");
const calendarWithLocalStore = new Calendar(root, localStore);
calendarWithLocalStore.init();

// // Раскомментировать, чтобы проверить работу одновременной работы
// // с LocalStorage в разных пространствах имен
// const localStore2 = new LocalStore("other");
// const calendarWithLocalStore2 = new Calendar(root, localStore2);
// calendarWithLocalStore2.init();

// Демонстрация работы с Firebase (не покрыта тестами, оставила для демонстрации)
const fireStore = new Firebase("user");
const calendarWithFireStore = new Calendar(root, fireStore);
calendarWithFireStore.init();
