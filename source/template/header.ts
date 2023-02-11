//

import {
  SlideTemplateManager
} from "../generator/transformer";


const manager = new SlideTemplateManager();

manager.registerElementRule("use-style", "header", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  const content = element.textContent;
  if (content === null || content === "") {
    self.appendElement("link", (self) => {
      self.setAttribute("rel", "stylesheet");
      self.setAttribute("type", "text/css");
      self.setAttribute("href", element.getAttribute("href"));
    });
  } else {
    self.appendElement("style", (self) => {
      self.setAttribute("type", "text/css");
      self.appendTextNode(content);
    });
  }
  self.appendTextNode("\n");
  return self;
});

manager.registerElementRule("use-script", "header", (transformer, document, element) => {
  const self = document.createDocumentFragment();
  self.appendElement("script", (self) => {
    const content = element.textContent;
    if (content === null || content === "") {
      self.setAttribute("src", element.getAttribute("src"));
    } else {
      self.appendTextNode(content);
    }
  });
  self.appendTextNode("\n");
  return self;
});

manager.registerElementRule(true, "header", (transformer, document) => {
  return document.createDocumentFragment();
});

manager.registerTextRule("header", (transformer, document) => {
  return document.createDocumentFragment();
});

export default manager;