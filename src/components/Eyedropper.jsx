import React from 'react';
import { connect } from 'react-redux';
import { switchTool } from '../store/actions/actionCreators';
import { EYEDROPPER } from '../store/reducers/drawingToolStates';
import IconButton from './IconButton';

const Eyedropper = ({
  helpOn,
  helpTooltip,
  eyedropperOn,
  switchEyedropper
}) => (
  <IconButton
    type="button"
    aria-label="Eyedropper Tool"
    isSelected={eyedropperOn}
    onClick={switchEyedropper}
    content={'\\6f'}
    helpOn={helpOn}
    helpTooltip={helpTooltip}
  />
);

const mapStateToProps = state => ({
  eyedropperOn: state.present.get('drawingTool') === EYEDROPPER
});

const switchEyedropperAction = switchTool(EYEDROPPER);
const mapDispatchToProps = dispatch => ({
  switchEyedropper: () => dispatch(switchEyedropperAction)
});

const EyedropperContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Eyedropper);
export default EyedropperContainer;
