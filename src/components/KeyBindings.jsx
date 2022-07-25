import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import tinykeys from 'tinykeys';
import {
  undo,
  redo,
  switchTool,
  openColorPicker
  // commented out because we commented out the keybinding using it
  // changeDimensions
} from '../store/actions/actionCreators';
import {
  MOVE,
  ERASER,
  BUCKET,
  EYEDROPPER
} from '../store/reducers/drawingToolStates';

const KeyBindings = ({ onClick }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const keyCombinations = {
      '$mod+KeyZ': wrapCheckOverride(event => {
        event.preventDefault();
        dispatch(undo());
      }),
      '$mod+KeyY': wrapCheckOverride(event => {
        event.preventDefault();
        dispatch(redo());
      }),
      // prettier-ignore
      'KeyM': wrapCheckOverride(event => {
        event.preventDefault();
        dispatch(switchTool(MOVE));
      }),
      // prettier-ignore
      'KeyE': wrapCheckOverride(event => {
        event.preventDefault();
        dispatch(switchTool(ERASER));
      }),
      // prettier-ignore
      'KeyB': wrapCheckOverride(event => {
        event.preventDefault();
        dispatch(switchTool(BUCKET));
      }),
      // prettier-ignore
      'KeyO': wrapCheckOverride(event => {
        event.preventDefault();
        dispatch(switchTool(EYEDROPPER));
      }),
      // prettier-ignore
      'KeyP': wrapCheckOverride(event => {
        event.preventDefault();
        dispatch(openColorPicker(true));
      })

      // The below are disabled because we don't allow redefining the canvas
      // size.

      // '$mod+ArrowRight': event => {
      //   event.preventDefault();
      //   dispatch(changeDimensions('columns', 1));
      // },
      // '$mod+ArrowLeft': event => {
      //   event.preventDefault();
      //   dispatch(changeDimensions('columns', -1));
      // },
      // '$mod+ArrowDown': event => {
      //   event.preventDefault();
      //   dispatch(changeDimensions('rows', 1));
      // },
      // '$mod+ArrowUp': event => {
      //   event.preventDefault();
      //   dispatch(changeDimensions('rows', -1));
      // }
    };
    const unsubscribe = tinykeys(window, keyCombinations);
    return () => {
      unsubscribe();
    };
  });
  return (
    <button
      type="button"
      className="app__shortcuts-button"
      aria-label="Show keyboard shortcuts"
      onClick={onClick}
    />
  );
};

// Determines whether we should skip the keybinding or not.
function isBindingOverridden(event) {
  return event.target.tagName.toLowerCase() === 'input';
}

function wrapCheckOverride(eventHandlerFn) {
  return event => {
    if (isBindingOverridden(event)) {
      return;
    }
    eventHandlerFn(event);
  };
}

export default KeyBindings;
