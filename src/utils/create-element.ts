export function createElement({ tag = "div", className = "", id = "", innerHTML = "" }): HTMLElement {
  const element = document.createElement(tag);
  if (className !== "") element.className = className;
  if (id !== "") element.id = id;
  if (innerHTML !== "") element.innerHTML = innerHTML;
  return element;
}
