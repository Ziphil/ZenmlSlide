//

import {
  BaseTransformer,
  LightTransformer,
  NodeLikeOf,
  TemplateManager
} from "@zenml/zenml";
import dotjs from "dot";
import DEFAULT_SCRIPT_STRING from "../../dist/script.js";
import DEFAULT_STYLE_STRING from "../resource/style.scss";
import TEMPLATE_HTML from "../template-default/template.html";
import type {
  SlideDocument
} from "./dom";


export class SlideTransformer extends BaseTransformer<SlideDocument, SlideTransformerEnvironments, SlideTransformerVariables> {

  private template: (...args: Array<any>) => string;

  public constructor(implementation: () => SlideDocument) {
    super(implementation);
    this.template = dotjs.template(TEMPLATE_HTML, {...dotjs.templateSettings, strip: false});
  }

  protected applyElement(element: Element, scope: string, args: any): NodeLikeOf<SlideDocument> {
    let self = super.applyElement(element, scope, args);
    let index = args?.index;
    if (typeof index === "number") {
      self.setRange(element, index);
    }
    return self;
  }

  protected stringify(document: SlideDocument): string {
    let defaultHeader = `<style>${DEFAULT_STYLE_STRING}</style><script>${DEFAULT_SCRIPT_STRING}</script>`;
    let view = {
      environments: this.environments,
      variables: this.variables,
      defaultHeader,
      document
    };
    let output = this.template(view);
    return output;
  }

  protected resetEnvironments(initialEnvironments?: Partial<SlideTransformerEnvironments>): void {
    this.environments = {...initialEnvironments};
  }

  protected resetVariables(initialVariables?: Partial<SlideTransformerVariables>): void {
    this.variables = {slideSize: 0, ...initialVariables};
  }

}


export class SlideTemplateManager extends TemplateManager<SlideDocument, SlideTransformerEnvironments, SlideTransformerVariables> {

}


export type SlideLightTransformer = LightTransformer<SlideDocument, SlideTransformerEnvironments, SlideTransformerVariables>;

export type SlideTransformerEnvironments = {
};
export type SlideTransformerVariables = {
  title?: string,
  headerNode?: NodeLikeOf<SlideDocument>,
  slideSize: number
};