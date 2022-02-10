//

import {
  BaseDocument,
  BaseDocumentFragment,
  BaseElement,
  BaseElementOptions,
  BaseText,
  BaseTextOptions,
  NodeCallback,
  NodeLikeOf
} from "@zenml/zenml";
import {
  Range
} from "../util/range";


export class SlideElement extends BaseElement<SlideDocument, SlideDocumentFragment, SlideElement, SlideText> {

  public addClassName(className: string): void {
    let currentClassName = this.attributes.get("class");
    let nextClassName = (currentClassName) ? currentClassName + " " + className : className;
    this.attributes.set("class", nextClassName);
  }

  public setRange(element: Element, index: number): void {
    let range = Range.fromString(element.getAttribute("range"));
    if (range !== null && !range.covers(index)) {
      this.setAttribute("style", (this.getAttribute("style") ?? "") + " visibility: hidden;");
    }
  }

}


export class SlideDocument extends BaseDocument<SlideDocument, SlideDocumentFragment, SlideElement, SlideText> {

  protected prepareDocumentFragment(): SlideDocumentFragment {
    return new SlideDocumentFragment(this);
  }

  protected prepareElement(tagName: string): SlideElement {
    return new SlideElement(this, tagName);
  }

  protected prepareTextNode(content: string): SlideText {
    return new SlideText(this, content);
  }

}


export class SlideDocumentFragment extends BaseDocumentFragment<SlideDocument, SlideDocumentFragment, SlideElement, SlideText> {

  public setRange(element: Element, index: number): void {
    for (let node of this.nodes) {
      node.setRange(element, index);
    }
  }

}


export class SlideText extends BaseText<SlideDocument, SlideDocumentFragment, SlideElement, SlideText> {

  public setRange(element: Element, index: number): void {
  }

}