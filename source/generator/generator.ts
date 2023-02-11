//

import {
  DOMImplementation
} from "@zenml/xmldom";
import {
  ZenmlParser,
  ZenmlPluginManager,
  measureAsync
} from "@zenml/zenml";
import chalk from "chalk";
import commandLineArgs from "command-line-args";
import fs from "fs/promises";
import glob from "glob-promise";
import pathUtil from "path";
import sass from "sass";
import {
  SourceSpan as SassSourceSpan
} from "sass";
import defaultTemplateManagers from "../template";
import {
  SlideDocument
} from "./dom";
import {
  SlideTemplateManager,
  SlideTransformer
} from "./transformer";


export class SlideGenerator {

  private parser!: ZenmlParser;
  private transformer!: SlideTransformer;
  private configs!: SlideConfigs;
  private options!: any;

  public constructor(configs: SlideConfigs) {
    this.configs = configs;
  }

  public async execute(): Promise<void> {
    const options = commandLineArgs([
      {name: "documentPaths", multiple: true, defaultOption: true},
      {name: "image", alias: "i", type: Boolean}
    ]);
    this.parser = this.createParser();
    this.transformer = this.createTransformer();
    this.options = options;
    if (options.image) {
      throw new Error("not implemented");
    } else {
      await this.executeNormal();
    }
  }

  private async executeNormal(): Promise<void> {
    const documentPaths = await this.getDocumentPaths(this.options.documentPaths ?? []);
    const promises = documentPaths.map(async (documentPath) => {
      await this.saveNormal(documentPath);
    });
    await Promise.all(promises);
  }

  private async saveNormal(documentPath: string): Promise<void> {
    const intervals = {convert: 0};
    try {
      intervals.convert = await measureAsync(async () => {
        await this.transformNormal(documentPath);
      });
      this.printNormal(documentPath, intervals, true);
    } catch (error) {
      this.printNormal(documentPath, intervals, false);
      await this.logError(documentPath, error);
    }
  }

  private async transformNormal(documentPath: string): Promise<void> {
    const extension = pathUtil.extname(documentPath).slice(1);
    const outputPaths = this.getOutputPaths(documentPath);
    const promises = outputPaths.map(async (outputPath) => {
      if (extension === "zml") {
        await this.transformNormalZml(documentPath, outputPath);
      } else if (extension === "scss") {
        await this.transformNormalScss(documentPath, outputPath);
      }
    });
    await Promise.all(promises);
  }

  private async transformNormalZml(documentPath: string, outputPath: string): Promise<void> {
    const inputString = await fs.readFile(documentPath, {encoding: "utf-8"});
    const inputDocument = this.parser.tryParse(inputString);
    const outputString = this.transformer.transformStringify(inputDocument);
    await fs.mkdir(pathUtil.dirname(outputPath), {recursive: true});
    await fs.writeFile(outputPath, outputString, {encoding: "utf-8"});
  }

  private async transformNormalScss(documentPath: string, outputPath: string): Promise<void> {
    const logMessage = function (message: string, options: {span?: SassSourceSpan}): void {
      Function.prototype();
    };
    const options = {
      file: documentPath,
      logger: {debug: logMessage, warn: logMessage}
    };
    const outputString = sass.renderSync(options).css.toString("utf-8");
    await fs.mkdir(pathUtil.dirname(outputPath), {recursive: true});
    await fs.writeFile(outputPath, outputString, {encoding: "utf-8"});
  }

  private printNormal(documentPath: string, intervals: {convert: number}, succeed: boolean): void {
    let output = "";
    output += " ";
    output += chalk.cyan(Math.min(intervals.convert, 9999).toString().padStart(4));
    output += chalk.cyan(" ms");
    output += "  |  ";
    if (succeed) {
      output += chalk.yellow(documentPath);
    } else {
      output += chalk.bgYellow.black(documentPath);
    }
    console.log(output);
  }

  private async logError(documentPath: string, error: unknown): Promise<void> {
    let output = "";
    const logPath = this.configs.errorLogPath;
    output += `[${documentPath}]` + "\n";
    if (error instanceof Error) {
      output += error.message.trim() + "\n";
      output += (error.stack ?? "").trim() + "\n";
    } else {
      output += ("" + error).trim() + "\n";
    }
    output += "\n";
    await fs.appendFile(logPath, output, {encoding: "utf-8"});
  }

  protected createParser(): ZenmlParser {
    const implementation = new DOMImplementation();
    const parser = new ZenmlParser(implementation, {specialElementNames: {brace: "x", bracket: "xn", slash: "i"}});
    for (const manager of this.configs.pluginManagers ?? []) {
      parser.registerPluginManager(manager);
    }
    return parser;
  }

  protected createTransformer(): SlideTransformer {
    const transformer = new SlideTransformer(() => new SlideDocument({includeDeclaration: false, html: true}));
    for (const manager of this.configs.templateManagers ?? []) {
      transformer.regsiterTemplateManager(manager);
    }
    for (const manager of defaultTemplateManagers) {
      transformer.regsiterTemplateManager(manager);
    }
    return transformer;
  }

  private async getDocumentPaths(rawDocumentPaths: Array<string>): Promise<Array<string>> {
    const allDocumentPaths = (rawDocumentPaths.length >= 1) ? rawDocumentPaths : await glob(this.configs.documentDirPath + "/**/*", {nodir: true});
    const documentPaths = allDocumentPaths.filter((documentPath) => this.checkValidDocumentPath(documentPath));
    return documentPaths;
  }

  private getOutputPaths(documentPath: string): Array<string> {
    let outputPath = pathUtil.join(this.configs.outputDirPath, pathUtil.relative(this.configs.documentDirPath, documentPath));
    outputPath = outputPath.replace(/\.zml$/, ".html");
    outputPath = outputPath.replace(/\.scss$/, ".css");
    outputPath = outputPath.replace(/\.tsx?$/, ".js");
    return [outputPath];
  }

  private checkValidDocumentPath(documentPath: string): boolean {
    if (this.configs.filterDocumentPath !== undefined) {
      return this.configs.filterDocumentPath(documentPath);
    } else {
      return true;
    }
  }

}


export type SlideConfigs = {
  pluginManagers?: Array<ZenmlPluginManager>,
  templateManagers?: Array<SlideTemplateManager>,
  filterDocumentPath?: (documentPath: string) => boolean,
  documentDirPath: string,
  outputDirPath: string,
  errorLogPath: string
};