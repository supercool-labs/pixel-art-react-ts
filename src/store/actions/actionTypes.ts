import { BigNumber as actionTypes } from 'ethers';
import {
  PixlyNFTv7 as PixlyNFT,
  MintPassFactory,
  TraitBagsV1 as TraitBags
} from '../../../typechain';
import {
  PENCIL,
  ERASER,
  BUCKET,
  EYEDROPPER
} from '../reducers/drawingToolStates';
import { FlatRGBAGrid, RGBAGrid } from '../../utils/grid';

export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
export interface SetInitialState {
  type: 'SET_INITIAL_STATE';
  state: unknown;
  options: unknown;
}

export const CHANGE_DIMENSIONS = 'CHANGE_DIMENSIONS';
export const SET_GRID_DIMENSION = 'SET_GRID_DIMENSION';
export const SELECT_PALETTE_COLOR = 'SELECT_PALETTE_COLOR';
export const SET_CUSTOM_COLOR = 'SET_CUSTOM_COLOR';

export const APPLY_PENCIL: 'APPLY_PENCIL' = `APPLY_${PENCIL}`;
export interface ApplyPencil {
  type: 'APPLY_PENCIL';
  paletteColor: string;
  id: number;
}
export const APPLY_ERASER: 'APPLY_ERASER' = `APPLY_${ERASER}`;
export interface ApplyEraser {
  type: 'APPLY_ERASER';
  id: number;
}
export const APPLY_BUCKET: 'APPLY_BUCKET' = `APPLY_${BUCKET}`;
export interface ApplyBucket {
  type: 'APPLY_BUCKET';
  paletteColor: string;
  columns: number;
  rows: number;
  id: number;
}
export const APPLY_EYEDROPPER = `APPLY_${EYEDROPPER}`;
export interface ApplyEyedropper {
  type: 'APPLY_EYEDROPPER';
}

export const MOVE_DRAWING = 'MOVE_DRAWING';
export interface MoveDrawing {
  type: 'MOVE_DRAWING';
  moveDiff: {
    xDiff: number;
    yDiff: number;
    cellWidth: number;
  };
}

export const SET_DRAWING = 'SET_DRAWING';
export interface SetDrawing {
  type: 'SET_DRAWING';
  [k: string]: unknown;
}

export const END_DRAG = 'END_DRAG';
export const SWITCH_TOOL = 'SWITCH_TOOL';

export const SET_CELL_SIZE = 'SET_CELL_SIZE';
export interface SetCellSize {
  type: 'SET_CELL_SIZE';
  cellSize: number;
}

export const SET_RESET_GRID = 'SET_RESET_GRID';
export interface SetResetGrid {
  type: 'SET_RESET_GRID';
}

export const SHOW_SPINNER = 'SHOW_SPINNER';
export interface ShowSpinner {
  type: 'SHOW_SPINNER';
}

export const HIDE_SPINNER = 'HIDE_SPINNER';
export interface HideSpinner {
  type: 'HIDE_SPINNER';
}

export const SEND_NOTIFICATION = 'SEND_NOTIFICATION';
export interface SendNotification {
  type: 'SEND_NOTIFICATION';
  message: string;
}

export const CHANGE_ACTIVE_FRAME = 'CHANGE_ACTIVE_FRAME';
export const REORDER_FRAME = 'REORDER_FRAME';
export const CREATE_NEW_FRAME = 'CREATE_NEW_FRAME';
export const DELETE_FRAME = 'DELETE_FRAME';
export const DUPLICATE_FRAME = 'DUPLICATE_FRAME';

export const SET_DURATION = 'SET_DURATION';
export interface SetDuration {
  type: 'SET_DURATION';
  duration: number;
}

export const CHANGE_FRAME_INTERVAL = 'CHANGE_FRAME_INTERVAL';
export interface ChangeFrameInterval {
  type: 'CHANGE_FRAME_INTERVAL';
  frameIndex: number;
  interval: number;
}

export const NEW_PROJECT = 'NEW_PROJECT';
export interface NewProject {
  type: 'NEW_PROJECT';
  options: NewProjectOpts;
}

export interface NewProjectOpts {
  columns: number;
  rows: number;
  showFrameControls: boolean;
  showDimensionsUI: boolean;
  appUrlScheme: string;
  appHost: string;
  templates: TemplateData[];
}

export interface TemplateData {
  tokenId: actionTypes;
  name: string;
  grid: RGBAGrid;
}

export const UPDATE_GRID_BOUNDARIES = 'UPDATE_GRID_BOUNDARIES';
export interface UpdateGridBoundaries {
  type: 'UPDATE_GRID_BOUNDARIES';
  gridElement: {
    getBoundingClientRect: () => {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  [k: string]: unknown;
}

export const CHANGE_HOVERED_CELL = 'CHANGE_HOVERED_CELL';
export interface ChangeHoveredIndex {
  type: 'CHANGE_HOVERED_CELL';
  cell: unknown;
}

export const SET_FRAME_NAME = 'SET_FRAME_NAME';
export interface SetFrameName {
  type: 'SET_FRAME_NAME';
  name: string;
}

export const OPEN_COLOR_PICKER = 'OPEN_COLOR_PICKER';
export interface OpenColorPicker {
  type: 'OPEN_COLOR_PICKER';
  isOpen: boolean;
}

export const APPLY_TEMPLATE = 'APPLY_TEMPLATE';
export interface ApplyTemplate {
  type: 'APPLY_TEMPLATE';
  grid: FlatRGBAGrid;
  tokenId?: actionTypes;
}

export const SAVE_GRID = 'SAVE_GRID';
export interface SaveGrid {
  type: 'SAVE_GRID';
}

export const LOAD_GRID = 'LOAD_GRID';
export interface LoadGrid {
  type: 'LOAD_GRID';
}

export const SET_ETH = 'SET_ETH';
export interface SetEth {
  type: 'SET_ETH';
  ethAccountAddress: string | null;
  // from packages/frontend/reducers/shared.ts
  ethContracts: EthContracts | null;
}

export interface EthContracts {
  pixlyNFT: PixlyNFT;
  mintPassFactory: MintPassFactory | null;
  traitBags: TraitBags | null;
}

// Dev actions
export const DEV_PRINT_GRID = 'DEV_PRINT_GRID';
export interface DevPrintGrid {
  type: 'DEV_PRINT_GRID';
}

export const DEV_LOAD_GRID = 'DEV_LOAD_GRID';
export interface DevLoadGrid {
  type: 'DEV_LOAD_GRID';
  grid: FlatRGBAGrid;
}

export type Action =
  | SetInitialState
  | SetDuration
  | ChangeFrameInterval
  | NewProject
  | UpdateGridBoundaries
  | ChangeHoveredIndex
  | SetFrameName
  | OpenColorPicker
  | ApplyTemplate
  | SaveGrid
  | LoadGrid
  | SetEth
  | DevPrintGrid
  | DevLoadGrid
  | MoveDrawing
  | SetDrawing
  | SetCellSize
  | ShowSpinner
  | HideSpinner
  | SendNotification
  | SetResetGrid
  | ApplyBucket
  | ApplyEraser
  | ApplyEyedropper
  | ApplyPencil;
