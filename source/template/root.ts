//

import {
  SlideTemplateManager
} from "../generator/transformer";
import {
  Range
} from "../util/range";


const manager = new SlideTemplateManager();

function calcMaxIndex(element: Element): number {
  const rawIndices = element.searchXpath("descendant::node()[@range]").map((child) => {
    if (child instanceof Node && child.isElement()) {
      const rangeString = child.getAttribute("range");
      const range = Range.fromString(rangeString);
      const endIndex = range?.end ?? range?.start ?? null;
      return endIndex;
    } else {
      return null;
    }
  });
  const indices = rawIndices.filter((index) => index !== null) as Array<number>;
  const maxIndex = (indices.length > 0) ? Math.max(...indices) : 1;
  return maxIndex;
}

manager.registerElementRule("root", "", (transformer, document, element) => {
  const headerNode = document.createDocumentFragment();
  const mainNode = document.createDocumentFragment();
  headerNode.appendChild(transformer.apply(element, "header"));
  mainNode.appendElement("div", (self) => {
    self.addClassName("root");
    self.setAttribute("id", "root");
    self.appendChild(transformer.apply(element, "root"));
  });
  transformer.variables.headerNode = headerNode;
  return mainNode;
});

manager.registerElementRule("slide", "root", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const maxIndex = calcMaxIndex(element);
  for (let index = 1 ; index <= maxIndex ; index ++) {
    const page = ++ transformer.variables.slideSize;
    self.appendElement("article", (self) => {
      self.addClassName("slide");
      self.setAttribute("data-page", page.toString());
      self.setAttribute("data-index", index.toString());
      self.appendElement("div", (self) => {
        self.addClassName("content-container");
        self.appendChild(transformer.apply(element, "slide", {page, index}));
      });
    });
  }
  return self;
});

export default manager;