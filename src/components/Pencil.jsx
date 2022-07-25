import React from 'react';
import { connect } from 'react-redux';
import { switchTool } from '../store/actions/actionCreators';
import { PENCIL } from '../store/reducers/drawingToolStates';
import IconButton from './IconButton';

const Pencil = React.memo(({ helpOn, helpTooltip, switchPencil, pencilOn }) => (
  <IconButton
    type="button"
    aria-label="Pencil Tool"
    isSelected={pencilOn}
    onClick={switchPencil}
    content={'\\68'}
    helpOn={helpOn}
    helpTooltip={helpTooltip}
  />
));

Pencil.displayName = 'Pencil';

const mapStateToProps = state => ({
  pencilOn: state.present.get('drawingTool') === PENCIL
});

const switchPencilAction = switchTool(PENCIL);
const mapDispatchToProps = dispatch => ({
  switchPencil: () => dispatch(switchPencilAction)
});

const PencilContainer = connect(mapStateToProps, mapDispatchToProps)(Pencil);
export default PencilContainer;
