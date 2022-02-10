//

import {
  SlideTemplateManager
} from "../generator/transformer";


let manager = new SlideTemplateManager();

manager.registerElementRule("use-style", "header", (transformer, document, element) => {
  let self = document.createDocumentFragment();
  self.appendElement("link", (self) => {
    let href = element.getAttribute("href");
    self.setAttribute("rel", "stylesheet");
    self.setAttribute("type", "text/css");
    self.setAttribute("href", href);
  });
  return self;
});

manager.registerElementRule(true, "header", (transformer, document) => {
  return document.createDocumentFragment();
});

manager.registerTextRule("header", (transformer, document) => {
  return document.createDocumentFragment();
});

export default manager;