import { List } from 'immutable';
import { Frames, FrameGrid } from '../types';
import * as actionTypes from '../actions/actionTypes';
import Grid from '../../utils/grid';

export const GRID_INITIAL_COLOR = 'rgba(49, 49, 49, 1)';

type PropReducer = (stateProp: any, action: any) => any;
type ReducerAction = any;

const updateFrameProp =
  (prop: string, maybeDefault?: any) =>
  (propReducer: PropReducer) =>
  (frames: Frames, action?: ReducerAction) => {
    const activeIndex = frames.get('activeIndex');
    if (maybeDefault === undefined) {
      return frames.updateIn(['list', activeIndex, prop], stateProp =>
        propReducer(stateProp, action)
      );
    }
    return frames.updateIn(
      ['list', activeIndex, prop],
      maybeDefault,
      stateProp => propReducer(stateProp, action)
    );
  };

const updateGrid = updateFrameProp('grid');
const updateInterval = updateFrameProp('interval');
const updateName = updateFrameProp('name', '');

const isSameColor = (colorA: string, colorB: string): boolean =>
  (colorA || GRID_INITIAL_COLOR) === (colorB || GRID_INITIAL_COLOR);

const getSameColorAdjacentCells = (
  frameGrid: FrameGrid,
  columns: number,
  rows: number,
  id: number,
  color: string
): number[] => {
  const adjacentCollection = [];
  let auxId;

  if ((id + 1) % columns !== 0) {
    // Not at the very right
    auxId = id + 1;
    if (isSameColor(frameGrid.get(auxId), color)) {
      adjacentCollection.push(auxId);
    }
  }
  if (id % columns !== 0) {
    // Not at the very left
    auxId = id - 1;
    if (isSameColor(frameGrid.get(auxId), color)) {
      adjacentCollection.push(auxId);
    }
  }
  if (id >= columns) {
    // Not at the very top
    auxId = id - columns;
    if (isSameColor(frameGrid.get(auxId), color)) {
      adjacentCollection.push(auxId);
    }
  }
  if (id < columns * rows - columns) {
    // Not at the very bottom
    auxId = id + columns;
    if (isSameColor(frameGrid.get(auxId), color)) {
      adjacentCollection.push(auxId);
    }
  }

  return adjacentCollection;
};

const drawPixel = (pixelGrid: FrameGrid, color: string, id: number) =>
  pixelGrid.set(id, color);

interface ApplyBucketToGridOpts {
  id: number;
  paletteColor: string;
  columns: number;
  rows: number;
}

const applyBucketToGrid = (
  grid: FrameGrid,
  { id, paletteColor, columns, rows }: ApplyBucketToGridOpts
) => {
  const queue = [id];
  const cellColor = grid.get(id);
  let currentId;
  let newGrid = grid;
  let adjacents;
  let auxAdjacentId;
  let auxAdjacentColor;

  while (queue.length > 0) {
    currentId = queue.shift();
    if (currentId === undefined) {
      break;
    }
    newGrid = drawPixel(newGrid, paletteColor, currentId);
    adjacents = getSameColorAdjacentCells(
      newGrid,
      columns,
      rows,
      currentId,
      cellColor
    );

    for (let i = 0; i < adjacents.length; i++) {
      auxAdjacentId = adjacents[i];
      auxAdjacentColor = newGrid.get(auxAdjacentId);
      // Avoid introduce repeated or painted already cell into the queue
      if (
        queue.indexOf(auxAdjacentId) === -1 &&
        auxAdjacentColor !== paletteColor
      ) {
        queue.push(auxAdjacentId);
      }
    }
  }

  return newGrid;
};

interface ApplyPencilToGridOpts {
  paletteColor: string;
  id: number;
}

const applyPencilToGrid = (
  pixelGrid: FrameGrid,
  { paletteColor, id }: ApplyPencilToGridOpts
) => drawPixel(pixelGrid, paletteColor, id);

const applyBucket = updateGrid(applyBucketToGrid);

const shiftPixelsDown = (grid: FrameGrid, columnCount: number): FrameGrid =>
  grid.withMutations(mutableGrid => {
    for (let i = 0; i < columnCount; i++) {
      const lastValue = mutableGrid.last();
      mutableGrid.pop().unshift(lastValue);
    }
  });

const shiftPixelsUp = (grid: FrameGrid, columnCount: number): FrameGrid =>
  grid.withMutations(mutableGrid => {
    for (let i = 0; i < columnCount; i++) {
      const firstValue = mutableGrid.first();
      mutableGrid.shift().push(firstValue);
    }
  });

const getGridColumnIndexes = (
  columnId: number,
  columnCount: number,
  cellCount: number
): number[] => {
  let i = 0;
  const indexes = [];
  while (i < cellCount) {
    if (i % columnCount === columnId) {
      indexes.push(i);
      i += columnCount;
    } else {
      i += 1;
    }
  }
  return indexes;
};

const shiftPixelsLeft = (grid: FrameGrid, columnCount: number): FrameGrid => {
  const indexArray = getGridColumnIndexes(0, columnCount, grid.size);
  let tempGrid = grid;
  for (const cellIndex of indexArray) {
    const valueToMove = tempGrid.get(cellIndex);
    const target = cellIndex + columnCount;
    tempGrid = tempGrid.insert(target, valueToMove);
    tempGrid = tempGrid.delete(cellIndex);
  }
  return tempGrid;
};

const shiftPixelsRight = (grid: FrameGrid, columnCount: number): FrameGrid => {
  const indexArray = getGridColumnIndexes(
    columnCount - 1,
    columnCount,
    grid.size
  );
  let tempGrid = grid;
  for (const cellIndex of indexArray) {
    const valueToMove = tempGrid.get(cellIndex);
    const target = cellIndex - columnCount + 1;
    tempGrid = tempGrid.insert(target < 0 ? 1 : target, valueToMove);
    tempGrid = tempGrid.delete(cellIndex + 1);
  }
  return tempGrid;
};

const applyMove = (frames: Frames, action: actionTypes.MoveDrawing): Frames => {
  const { xDiff, yDiff, cellWidth } = action.moveDiff;
  const x = xDiff / cellWidth;
  const y = yDiff / cellWidth;
  const xDirection = x < 0 ? 'LEFT' : 'RIGHT';
  const yDirection = y < 0 ? 'UP' : 'DOWN';
  const horizontal = Math.abs(x) > 1 ? xDirection : '';
  const vertical = Math.abs(y) > 1 ? yDirection : '';
  const activeIndex = frames.get('activeIndex');
  const currentFrame = frames.get('list').get(activeIndex).get('grid');

  const columnCount = frames.get('columns');
  let frameShifted = currentFrame;

  switch (horizontal) {
    case 'LEFT':
      frameShifted = shiftPixelsLeft(currentFrame, columnCount);
      break;
    case 'RIGHT':
      frameShifted = shiftPixelsRight(currentFrame, columnCount);
      break;
    default:
  }

  switch (vertical) {
    case 'UP':
      frameShifted = shiftPixelsUp(frameShifted, columnCount);
      break;
    case 'DOWN':
      frameShifted = shiftPixelsDown(frameShifted, columnCount);
      break;
    default:
  }
  return frames.setIn(['list', activeIndex, 'grid'], frameShifted);
};

const applyPencil = updateGrid(applyPencilToGrid);

const applyEraser = updateGrid((pixelGrid, { id }) =>
  drawPixel(pixelGrid, '', id)
);

const resetGrid = (frames: Frames) => {
  const activeIndex = frames.get('activeIndex');
  const newFrames = frames.setIn(
    ['list', activeIndex, 'templateTokenId'],
    undefined
  );
  return updateGrid(pixelGrid => pixelGrid.map(() => ''))(newFrames);
};

const changeFrameInterval = updateInterval(
  (previousInterval, { interval }) => interval
);

const changeFrameName = updateName((previousName, { name }) => name);

const applyTemplate = (frames: Frames, action: actionTypes.ApplyTemplate) => {
  const { grid } = action;
  const activeIndex = frames.get('activeIndex');

  const templateGrid = new Grid(grid, frames.get('columns')).toGridArray();

  const mergedGrid = [];
  for (let row = 0; row < templateGrid.length; row++) {
    const sub = [];
    for (let col = 0; col < templateGrid[row].length; col++) {
      const templateCellValue = templateGrid[row][col];
      // If template cell value non empty then "stick" it on top of active cell
      sub.push(templateCellValue);
    }
    mergedGrid.push(sub);
  }

  const newGrid = List(
    mergedGrid.reduce<string[]>(
      (flattenedGrid, gr) =>
        flattenedGrid.concat(
          gr.map(cell => `rgba(${cell.r},${cell.g},${cell.b},${cell.a})`)
        ),
      []
    )
  );

  let newFrames = frames.setIn(['list', activeIndex, 'grid'], newGrid);
  newFrames = newFrames.setIn(
    ['list', activeIndex, 'templateTokenId'],
    action.tokenId
  );

  return newFrames;
};

export default function (frames: Frames, action: actionTypes.Action): Frames {
  switch (action.type) {
    case actionTypes.APPLY_PENCIL:
      return applyPencil(frames, action);
    case actionTypes.APPLY_ERASER:
      return applyEraser(frames, action);
    case actionTypes.APPLY_BUCKET:
      return applyBucket(frames, action);
    case actionTypes.MOVE_DRAWING:
      return applyMove(frames, action);
    case actionTypes.SET_RESET_GRID:
      return resetGrid(frames);
    case actionTypes.CHANGE_FRAME_INTERVAL:
      return changeFrameInterval(frames, action);
    case actionTypes.SET_FRAME_NAME:
      return changeFrameName(frames, action);
    case actionTypes.APPLY_TEMPLATE:
      return applyTemplate(frames, action);
    default:
      return frames;
  }
}
