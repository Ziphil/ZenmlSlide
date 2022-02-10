//

import {
  SlideTemplateManager
} from "../generator/transformer";
import {
  Range
} from "../util/range";


let manager = new SlideTemplateManager();

function calcMaxIndex(element: Element): number {
  let rawIndices = element.searchXpath("descendant::node()[@range]").map((child) => {
    if (child instanceof Node && child.isElement()) {
      let rangeString = child.getAttribute("range");
      let range = Range.fromString(rangeString);
      let endIndex = range?.end ?? range?.start ?? null;
      return endIndex;
    } else {
      return null;
    }
  });
  let indices = rawIndices.filter((index) => index !== null) as Array<number>;
  let maxIndex = (indices.length > 0) ? Math.max(...indices) : 0;
  return maxIndex;
}

manager.registerElementRule("root", "", (transformer, document, element) => {
  let headerNode = document.createDocumentFragment();
  let mainNode = document.createDocumentFragment();
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
  let self = document.createDocumentFragment();
  let maxIndex = calcMaxIndex(element);
  for (let index = 0 ; index <= maxIndex ; index ++) {
    let page = transformer.variables.slideSize ++;
    self.appendElement("article", (self) => {
      self.addClassName("slide");
      self.setAttribute("data-page", page.toString());
      self.setAttribute("data-index", index.toString());
      self.appendElement("div", (self) => {
        self.addClassName("slide-container");
        self.appendChild(transformer.apply(element, "slide", {page, index}));
      });
    });
  }
  return self;
});

export default manager;