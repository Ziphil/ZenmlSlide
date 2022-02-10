//


export class Range {

  public start: number | null;
  public end: number | null;

  private constructor(start: number | null, end: number | null) {
    this.start = start;
    this.end = end;
  }

  public covers(index: number): boolean {
    let start = this.start;
    let end = this.end;
    if (start === null) {
      if (end === null) {
        return true;
      } else {
        return index <= end;
      }
    } else {
      if (end === null) {
        return index >= start;
      } else {
        return index >= start && index <= end;
      }
    }
  }

  public static fromString(string: string): Range | null {
    let match = string.match(/(\d*)-(\d*)/);
    if (match !== null) {
      let start = (match[1] === "") ? null : parseInt(match[1]) - 1;
      let end = (match[2] === "") ? null : parseInt(match[2]) - 1;
      let range = new Range(start, end);
      return range;
    } else {
      return null;
    }
  }

}