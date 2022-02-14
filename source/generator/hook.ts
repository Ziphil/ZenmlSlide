//

import {
  LightTransformer,
  NodeLikeOf,
  TemplateRule
} from "@zenml/zenml";
import {
  SlideDocument
} from "./dom";


export function withRange<C, V>(rule: TemplateRule<SlideDocument, C, V, Element>): TemplateRule<SlideDocument, C, V, Element> {
  let wrappedRule = function (transformer: LightTransformer<SlideDocument, C, V>, document: SlideDocument, element: Element, scope: string, args: any): NodeLikeOf<SlideDocument> {
    let resultNode = rule(transformer, document, element, scope, args);
    let index = args?.index;
    if (index !== undefined) {
      resultNode.setRange(element, index);
    }
    return resultNode;
  };
  return wrappedRule;
}