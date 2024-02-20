import { beforeEach, describe, expect, it } from "@jest/globals";
import { createElementFromHTML } from "./create-element-from-html";

describe("createElementFromHTML", () => {
  it("should be a function", () => {
    expect(createElementFromHTML).toBeInstanceOf(Function);
  });

  const container = document.createElement("div");
  beforeEach(() => {
    container.innerHTML = "";
  });

  const testData = ['<div class="test1">01</div>', '<div class="test2">02</div><div class="test3">03</div>'];

  testData.forEach((input) => {
    it(`should create element from html`, () => {
      const elements = createElementFromHTML(input);
      Array.from(elements).forEach((element) => {
        container.append(element);
      });
      expect(container.innerHTML).toEqual(input);
    });
  });
});
