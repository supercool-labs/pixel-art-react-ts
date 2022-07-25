import { List } from 'immutable';

// The default color (in other terms, the background color on which you paint)
// is fully opaque black.
export const DEFAULT_CELL_COLOR = { r: 0, g: 0, b: 0, a: 1 };

export interface RGBA {
  // r, g, and b are integers between [0, 255]
  r: number;
  g: number;
  b: number;

  // a is a float in [0, 1]
  a: number;
}

export type RGBAGrid = Array<Array<RGBA>>;

export type FlatRGBAGrid = List<string>;

export default class Grid {
  public readonly rows: number;
  public readonly columns: number;
  private grid: List<string>;

  constructor(grid: List<string>, columns: number) {
    this.grid = grid;
    this.columns = columns;
    this.rows = this.grid.size / columns;
    if (Math.floor(this.rows) !== this.rows) {
      throw new Error('Grid is not rectangular');
    }
  }

  get(x: number, y: number): RGBA {
    if (x < 0 || x >= this.columns) {
      throw new Error(`x out of bounds [0, ${this.columns - 1}]`);
    }
    if (y < 0 || y >= this.rows) {
      throw new Error(`y out of bounds [0, ${this.rows - 1}]`);
    }

    return Grid.strToRGBA(this.grid.get(this.columns * y + x));
  }

  static strToRGBA(rgbaStr: string): RGBA {
    if (rgbaStr.trim() === '') {
      return DEFAULT_CELL_COLOR;
    }
    const parts = rgbaStr.slice(rgbaStr.indexOf('(') + 1, -1).split(',');
    const rgb = parts.slice(0, parts.length - 1).map(v => parseInt(v, 10));
    const alpha = parseFloat(parts[parts.length - 1]);
    return { r: rgb[0], g: rgb[1], b: rgb[2], a: alpha };
  }

  toGridArray(): RGBAGrid {
    const arr = [];
    for (let j = 0; j < this.rows; j++) {
      const rowArr = [];
      for (let i = 0; i < this.columns; i++) {
        rowArr.push(this.get(i, j));
      }
      arr.push(rowArr);
    }
    return arr;
  }
}

export const flattenGrid = (sourceGrid: string): List<string> => {
  const { grid }: { grid: RGBAGrid } = JSON.parse(sourceGrid);
  return flattenObjGrid(grid);
};

export const flattenObjGrid = (sourceGrid: RGBAGrid): List<string> =>
  List(
    sourceGrid.reduce<string[]>(
      (flattenedGrid, row) =>
        flattenedGrid.concat(
          row.map(cell => `rgba(${cell.r},${cell.g},${cell.b},${cell.a})`)
        ),
      []
    )
  );
