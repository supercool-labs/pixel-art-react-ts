import React from 'react';
import { connect } from 'react-redux';
import { switchTool } from '../store/actions/actionCreators';
import { ERASER } from '../store/reducers/drawingToolStates';
import IconButton from './IconButton';

const Eraser = ({ helpOn, helpTooltip, eraserOn, switchEraser }) => (
  <IconButton
    type="button"
    aria-label="Eraser Tool"
    isSelected={eraserOn}
    onClick={switchEraser}
    content={'\\65'}
    helpOn={helpOn}
    helpTooltip={helpTooltip}
  />
);

const mapStateToProps = state => ({
  eraserOn: state.present.get('drawingTool') === ERASER
});

const switchEraserAction = switchTool(ERASER);
const mapDispatchToProps = dispatch => ({
  switchEraser: () => dispatch(switchEraserAction)
});

const EraserContainer = connect(mapStateToProps, mapDispatchToProps)(Eraser);
export default EraserContainer;
