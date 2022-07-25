import { BigNumber } from 'ethers';
import * as types from '../actions/actionTypes';
import Grid, { flattenGrid } from '../../utils/grid';

export const getFrameHash = activeIndex =>
  ['frames', activeIndex, 'savedGrid'].join('~');

const saveGrid = state => {
  const frames = state.get('frames');
  const activeIndex = frames.get('activeIndex');
  const grid = new Grid(
    frames.getIn(['list', activeIndex]).get('grid'),
    frames.get('columns')
  );
  const frameHash = getFrameHash(activeIndex);
  const templateTokenId = frames.getIn([
    'list',
    activeIndex,
    'templateTokenId'
  ]);
  localStorage.setItem(
    frameHash,
    JSON.stringify({
      templateTokenId: templateTokenIdToString(templateTokenId),
      grid: grid.toGridArray()
    })
  );
  if (templateTokenId !== undefined) {
    console.log(
      `Saved grid for template token ID ${templateTokenId.toString()}.`
    );
  } else {
    console.log(`Saved grid.`);
  }
  return state;
};

const devPrintGrid = state => {
  const frames = state.get('frames');
  const activeIndex = frames.get('activeIndex');
  const grid = new Grid(
    frames.getIn(['list', activeIndex]).get('grid'),
    frames.get('columns')
  );
  console.log(
    JSON.stringify({
      templateTokenId: templateTokenIdToString(
        frames.getIn(['list', activeIndex, 'templateTokenId'])
      ),
      grid: grid.toGridArray()
    })
  );
  return state;
};

const loadGrid = state => {
  const frames = state.get('frames');
  const activeIndex = frames.get('activeIndex');
  const frameHash = getFrameHash(activeIndex);
  const savedGrid = localStorage.getItem(frameHash);
  if (savedGrid !== null) {
    const loadedGrid = JSON.parse(savedGrid);
    let newState = state.setIn(
      ['frames', 'list', activeIndex, 'grid'],
      flattenGrid(savedGrid)
    );
    if (loadedGrid.templateTokenId !== undefined) {
      newState = newState.setIn(
        ['frames', 'list', activeIndex, 'templateTokenId'],
        BigNumber.from(loadedGrid.templateTokenId)
      );
      console.log(
        `Loaded grid for template token ID ${loadedGrid.templateTokenId}.`
      );
    } else {
      console.log(`Loaded grid.`);
    }
    return newState;
  }
  return state;
};

const devLoadGrid = (state, gridJSON) => {
  const frames = state.get('frames');
  const activeIndex = frames.get('activeIndex');
  let newState = state.setIn(
    ['frames', 'list', activeIndex, 'grid'],
    flattenGrid(gridJSON)
  );
  let maybeTemplateTokenId;
  if (gridJSON.tokenId !== undefined) {
    maybeTemplateTokenId = gridJSON.tokenId;
  } else if (gridJSON.templateTokenId !== undefined) {
    maybeTemplateTokenId = gridJSON.templateTokenId;
  }
  newState = newState.setIn(
    ['frames', 'list', activeIndex, 'templateTokenId'],
    maybeTemplateTokenId
  );
  return newState;
};

const templateTokenIdToString = maybeTemplateTokenId => {
  if (maybeTemplateTokenId === undefined) {
    return undefined;
  }
  return maybeTemplateTokenId.toString();
};

export default function (state, action) {
  switch (action.type) {
    case types.SAVE_GRID:
      return saveGrid(state);
    case types.LOAD_GRID:
      return loadGrid(state);
    case types.DEV_PRINT_GRID:
      return devPrintGrid(state);
    case types.DEV_LOAD_GRID:
      return devLoadGrid(state, action.grid);
    default:
      return state;
  }
}
