import { ActionCreators } from 'redux-undo';
import { BigNumber } from 'ethers';
import * as types from './actionTypes';
import { FlatRGBAGrid } from '../../utils/grid';

export function setInitialState(
  options: Pick<types.SetInitialState, 'options'>
): types.SetInitialState {
  return {
    type: types.SET_INITIAL_STATE,
    state: {},
    options
  };
}

export function changeDimensions(
  gridProperty: unknown,
  increment: unknown
): unknown {
  return {
    type: types.CHANGE_DIMENSIONS,
    gridProperty,
    increment
  };
}

export function updateGridBoundaries(gridElement: unknown): unknown {
  return {
    type: types.UPDATE_GRID_BOUNDARIES,
    gridElement
  };
}

export function selectPaletteColor(position: unknown): unknown {
  return {
    type: types.SELECT_PALETTE_COLOR,
    position
  };
}

export function setCustomColor(customColor: unknown): unknown {
  return {
    type: types.SET_CUSTOM_COLOR,
    customColor
  };
}

export function cellAction({
  id,
  drawingTool,
  color,
  paletteColor,
  columns,
  rows
}: Record<string, unknown>): unknown {
  return {
    type: `APPLY_${drawingTool}`,
    id,
    color,
    paletteColor,
    columns,
    rows
  };
}

export function moveDrawing({
  xDiff,
  yDiff,
  cellWidth
}: Record<string, unknown>): unknown {
  return {
    type: 'MOVE_DRAWING',
    moveDiff: { xDiff, yDiff, cellWidth }
  };
}

export function setDrawing(
  frames: unknown,
  paletteGridData: unknown,
  cellSize: unknown,
  columns: unknown,
  rows: unknown,
  hoveredIndex: unknown
): unknown {
  return {
    type: types.SET_DRAWING,
    frames,
    paletteGridData,
    cellSize,
    columns,
    rows,
    hoveredIndex
  };
}

export function endDrag(): unknown {
  return {
    type: types.END_DRAG
  };
}

export function switchTool(tool: unknown): unknown {
  return {
    type: types.SWITCH_TOOL,
    tool
  };
}

export function setCellSize(cellSize: unknown): unknown {
  return {
    type: types.SET_CELL_SIZE,
    cellSize
  };
}

export function resetGrid(): types.SetResetGrid {
  return {
    type: types.SET_RESET_GRID
  };
}

export function showSpinner(): unknown {
  return {
    type: types.SHOW_SPINNER
  };
}

export function hideSpinner(): unknown {
  return {
    type: types.HIDE_SPINNER
  };
}

export function sendNotification(message: unknown): unknown {
  return {
    type: types.SEND_NOTIFICATION,
    message
  };
}

export function changeActiveFrame(frameIndex: number): unknown {
  return {
    type: types.CHANGE_ACTIVE_FRAME,
    frameIndex
  };
}

export function reorderFrame(
  selectedIndex: unknown,
  destinationIndex: unknown
): unknown {
  return {
    type: types.REORDER_FRAME,
    selectedIndex,
    destinationIndex
  };
}

export function createNewFrame(): unknown {
  return {
    type: types.CREATE_NEW_FRAME
  };
}

export function deleteFrame(frameId: unknown): unknown {
  return {
    type: types.DELETE_FRAME,
    frameId
  };
}

export function duplicateFrame(frameId: unknown): unknown {
  return {
    type: types.DUPLICATE_FRAME,
    frameId
  };
}

export function setDuration(duration: number): types.SetDuration {
  return {
    type: types.SET_DURATION,
    duration
  };
}

export function changeFrameInterval(
  frameIndex: number,
  interval: number
): types.ChangeFrameInterval {
  return {
    type: types.CHANGE_FRAME_INTERVAL,
    frameIndex,
    interval
  };
}

export function newProject(options: types.NewProjectOpts): types.NewProject {
  return {
    type: types.NEW_PROJECT,
    options
  };
}

export function changeHoveredCell(cell: unknown): types.ChangeHoveredIndex {
  return {
    type: types.CHANGE_HOVERED_CELL,
    cell
  };
}

export function undo(): ReturnType<typeof ActionCreators.undo> {
  return ActionCreators.undo();
}

export function redo(): ReturnType<typeof ActionCreators.redo> {
  return ActionCreators.redo();
}

export function setFrameName(name: string): types.SetFrameName {
  return {
    type: types.SET_FRAME_NAME,
    name
  };
}

export function openColorPicker(isOpen: boolean): types.OpenColorPicker {
  return {
    type: types.OPEN_COLOR_PICKER,
    isOpen
  };
}

export function applyTemplate(
  grid: FlatRGBAGrid,
  tokenId?: BigNumber
): types.ApplyTemplate {
  return {
    type: types.APPLY_TEMPLATE,
    grid,
    tokenId
  };
}

export function setEth(
  ethAccountAddress: string | null,
  ethContracts: types.EthContracts | null
): types.SetEth {
  return {
    type: types.SET_ETH,
    ethAccountAddress,
    ethContracts
  };
}

// dev actions
export function saveGrid(): types.SaveGrid {
  return {
    type: types.SAVE_GRID
  };
}

export function loadGrid(): types.LoadGrid {
  return {
    type: types.LOAD_GRID
  };
}

// dev actions
export function devPrintGrid(): types.DevPrintGrid {
  return {
    type: types.DEV_PRINT_GRID
  };
}

export function devLoadGrid(grid: FlatRGBAGrid): types.DevLoadGrid {
  return {
    type: types.DEV_LOAD_GRID,
    grid
  };
}
