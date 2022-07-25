import { List, Map, fromJS } from 'immutable';
import shortid from 'shortid';
import * as types from '../actions/actionTypes';
import { GRID_INITIAL_COLOR } from './activeFrameReducer';

const getPositionFirstMatchInPalette = (grid, color) =>
  grid.findIndex(gridColor => gridColor.get('color') === color);

const isColorInPalette = (grid, color) =>
  getPositionFirstMatchInPalette(grid, color) !== -1;

const parseColorToString = colorData =>
  typeof colorData === 'string'
    ? colorData
    : `rgba(${colorData.r},${colorData.g},${colorData.b},${colorData.a})`;

const disableColor = (palette, action) => {
  if (action.tool === 'ERASER' || action.tool === 'MOVE') {
    return palette.set('position', -1);
  }
  return palette;
};

const addColorToLastGridCell = (palette, newColor) => {
  const grid = palette.get('grid');
  const lastPosition = grid.size - 1;
  return palette.merge({
    grid: grid.setIn([lastPosition, 'color'], parseColorToString(newColor)),
    position: lastPosition
  });
};

const createPaletteGrid = () =>
  List([
    'rgba(255, 255, 255, 1)',
    'rgba(0, 0, 0, 1)',
    'rgba(194, 24, 91, 1)',
    'rgba(10, 151, 166, 1)',
    '',
    ''
  ]).map(color => Map({ color, id: shortid.generate() }));

const isColorSelected = palette => palette.get('position') !== -1;

const resetSelectedColorState = palette => palette.set('position', 0);

const createPalette = () =>
  Map({
    grid: createPaletteGrid(),
    position: 0
  });

const getCellColor = ({ color }) => color || GRID_INITIAL_COLOR;

const eyedropColor = (palette, action) => {
  const cellColor = getCellColor(action);
  const grid = palette.get('grid');

  if (!isColorInPalette(grid, cellColor)) {
    return addColorToLastGridCell(palette, cellColor);
  }
  return palette.set(
    'position',
    getPositionFirstMatchInPalette(grid, cellColor)
  );
};

const preparePalette = palette => {
  if (!isColorSelected(palette)) {
    return resetSelectedColorState(palette);
  }
  return palette;
};

const selectPaletteColor = (palette, action) =>
  palette.set('position', action.position);

const setCustomColor = (palette, { customColor }) => {
  if (!isColorSelected(palette)) {
    return addColorToLastGridCell(palette, customColor);
  }
  const customColorRgba = parseColorToString(customColor);
  return palette.setIn(
    ['grid', palette.get('position'), 'color'],
    customColorRgba
  );
};

const setPalette = (palette, action) => {
  const defaultPalette = action.paletteGridData.length === 0;
  return palette.set(
    'grid',
    fromJS(defaultPalette ? createPaletteGrid() : action.paletteGridData)
  );
};

export default function paletteReducer(palette = createPalette(), action) {
  switch (action.type) {
    case types.SET_INITIAL_STATE:
    case types.NEW_PROJECT:
      return createPalette();
    case types.APPLY_EYEDROPPER:
      return eyedropColor(palette, action);
    case types.APPLY_PENCIL:
    case types.APPLY_BUCKET:
      return preparePalette(palette);
    case types.SELECT_PALETTE_COLOR:
      return selectPaletteColor(palette, action);
    case types.SET_CUSTOM_COLOR:
      return setCustomColor(palette, action);
    case types.SWITCH_TOOL:
      return disableColor(palette, action);
    case types.SET_DRAWING:
      return setPalette(palette, action);
    default:
      return palette;
  }
}
