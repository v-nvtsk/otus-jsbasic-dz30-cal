export function createElementFromHTML(html: string): HTMLCollection {
  const innerHTML = html.trim();

  const template = document.createElement("template");
  template.innerHTML = innerHTML;
  return template.content.children;
}
