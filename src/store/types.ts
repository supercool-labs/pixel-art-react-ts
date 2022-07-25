import { List, Map } from 'immutable';

// TODO(dbmikus) replace with Record types
// https://immutable-js.com/docs/v4.0.0/Record/
export type State = Map<string, any>;
export type UndoableState = {
  present: State;
  past: State[];
  future: State[];
};

export type Frames = Map<string, any>;
export type FrameGrid = List<string>;
