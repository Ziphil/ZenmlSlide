//


export class Range {

  public start: number | null;
  public end: number | null;

  private constructor(start: number | null, end: number | null) {
    this.start = start;
    this.end = end;
  }

  public covers(index: number): boolean {
    const start = this.start;
    const end = this.end;
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
    const match = string.match(/(\d*)-(\d*)/);
    if (match !== null) {
      const start = (match[1] === "") ? null : parseInt(match[1]);
      const end = (match[2] === "") ? null : parseInt(match[2]);
      const range = new Range(start, end);
      return range;
    } else {
      return null;
    }
  }

}