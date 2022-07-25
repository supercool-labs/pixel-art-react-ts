import { List, Map } from 'immutable';
import paletteReducer from './paletteReducer';
import framesReducer from './framesReducer';
import activeFrameReducer from './activeFrameReducer';
import drawingToolReducer from './drawingToolReducer';
import devReducer from './devReducer';
import { State } from '../types';
import * as types from '../actions/actionTypes';

function setInitialState(
  state: State,
  action: types.SetInitialState | types.NewProject
): State {
  const cellSize = 10;
  const initialState = {
    cellSize,
    loading: false,
    notifications: List(),
    duration: 1,
    options: action.options
  };
  return state.merge(initialState);
}

function setDrawing(state: State, action: types.SetDrawing): State {
  return state.set('cellSize', action.cellSize);
}

function setCellSize(state: State, cellSize: number): State {
  return state.merge({ cellSize });
}

function showSpinner(state: State): State {
  return state.merge({ loading: true });
}

function hideSpinner(state: State): State {
  return state.merge({ loading: false });
}

function sendNotification(state: State, message: string): State {
  return state.merge({
    notifications: message === '' ? List() : List([{ message, id: 0 }])
  });
}

function setDuration(state: State, duration: number): State {
  return state.merge({ duration });
}

function updateGridBoundaries(
  state: State,
  action: types.UpdateGridBoundaries
): State {
  const { x, y, width, height } = action.gridElement.getBoundingClientRect();
  return state.set('gridBoundaries', {
    x,
    y,
    width,
    height
  });
}

function generateDefaultState(): State {
  return setInitialState(Map(), {
    type: types.SET_INITIAL_STATE,
    state: {},
    options: {
      showFrameControls: true,
      showDimensionsUI: true,
      appUrlScheme: 'http',
      appHost: 'localhost:3000',
      templates: []
    }
  });
}

function setEth(state: State, action: types.SetEth): State {
  return state
    .set('ethAccountAddress', action.ethAccountAddress)
    .set('ethContracts', action.ethContracts);
}

function setOpenColorPicker(
  state: State,
  action: types.OpenColorPicker
): State {
  return state.set('isColorPickerOpen', action.isOpen);
}

type ReducerFn = (state: State, action: types.Action) => State;

const pipeReducers =
  (reducers: ReducerFn[]) => (initialState: State, action: types.Action) =>
    reducers.reduce(
      (state: State, reducer: ReducerFn) => reducer(state, action),
      initialState
    );

function partialReducer(state: State, action: types.Action): State {
  switch (action.type) {
    case types.SET_INITIAL_STATE:
      return setInitialState(state, action);
    case types.SET_ETH:
      return setEth(state, action);
    case types.SET_DRAWING:
      return setDrawing(state, action);
    case types.SET_CELL_SIZE:
      return setCellSize(state, action.cellSize);
    case types.SHOW_SPINNER:
      return showSpinner(state);
    case types.HIDE_SPINNER:
      return hideSpinner(state);
    case types.SEND_NOTIFICATION:
      return sendNotification(state, action.message);
    case types.SET_DURATION:
      return setDuration(state, action.duration);
    case types.NEW_PROJECT:
      return setInitialState(state, action);
    case types.UPDATE_GRID_BOUNDARIES:
      return updateGridBoundaries(state, action);
    case types.OPEN_COLOR_PICKER:
      return setOpenColorPicker(state, action);
    default:
  }
  return state;
}

export default function (
  state: State = generateDefaultState(),
  action: types.Action
): State {
  const newState = partialReducer(state, action).merge({
    drawingTool: drawingToolReducer(state.get('drawingTool'), action),
    palette: paletteReducer(state.get('palette'), action),
    frames: pipeReducers([framesReducer, activeFrameReducer])(
      state.get('frames'),
      action
    )
  });
  return devReducer(newState, action);
}
