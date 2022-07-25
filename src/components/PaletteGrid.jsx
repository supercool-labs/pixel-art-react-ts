import styled from '@emotion/styled';
import React, { useRef } from 'react';
import { bindActionCreators } from 'redux';
import { connect, useSelector, useDispatch } from 'react-redux';
import ModalReact from 'react-modal';
import PixlyColorPicker from './PixlyColorPicker';

import {
  selectPaletteColor,
  setCustomColor,
  openColorPicker
} from '../store/actions/actionCreators';
import PaletteColor from './PaletteColor';

const PaletteGrid = ({ grid, position, boundSelectPaletteColor }) => {
  const ref = useRef();
  const colorPickerOn = useSelector(state =>
    state.present.get('isColorPickerOpen')
  );
  const { paletteColor, currentPosition } = useSelector(state => {
    const palette = state.present.get('palette');
    const currentColorPosition = palette.get('position');
    return {
      paletteColor: palette.getIn(['grid', currentColorPosition, 'color']),
      currentPosition: currentColorPosition
    };
  });

  const dispatch = useDispatch();
  const initialPickerColor = paletteColor || 'rgba(255, 255, 255, 1)';

  const handleColorPickerClose = () => {
    dispatch(openColorPicker(false));
  };

  const onPickerChange = color => dispatch(setCustomColor(color.rgb));

  const selectOrSetColor = newPosition => {
    if (newPosition === currentPosition) {
      dispatch(openColorPicker(!colorPickerOn));
    } else {
      boundSelectPaletteColor(newPosition);
    }
  };

  const getColors = () => {
    const width = 100 / 6;

    return grid.map((color, index) => (
      <PaletteColor
        key={color.get('id')}
        positionInPalette={index}
        width={width}
        color={color.get('color')}
        selected={position === index}
        selectPaletteColor={selectOrSetColor}
      />
    ));
  };

  return (
    <div
      style={{ position: 'relative', display: 'flex', flexDirection: 'row' }}
    >
      <div>
        <div className="palette-grid">
          <SpacedGrid>{getColors()}</SpacedGrid>
        </div>
      </div>
      {/* The modal portal container */}
      <div ref={ref} />
      {/* Wrap in this check so we can use the `ref` in `parentSelector` */}
      {ref.current ? (
        <MyPicker
          colorPickerOn={colorPickerOn}
          modalParent={ref.current}
          handleColorPickerClose={handleColorPickerClose}
          initialPickerColor={initialPickerColor}
          onPickerChange={onPickerChange}
        />
      ) : null}
    </div>
  );
};

const SpacedGrid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-width: 200px;
  align-items: center;
`;

function MyPicker({
  colorPickerOn,
  modalParent,
  handleColorPickerClose,
  initialPickerColor,
  onPickerChange
}) {
  const modalStyles = {
    content: {
      position: 'absolute',
      top: 'initial',
      left: 'initial',
      right: 'initial',
      bottom: 'initial',
      padding: 'none',
      border: 'none',
      zIndex: 20,
      marginTop: '30%',
      marginLeft: '-100%'
    },
    overlay: {
      position: 'initial',
      top: 'initial',
      left: 'initial',
      bottom: 'initial',
      right: 'initial',
      backgroundColor: 'initial',
      width: 'fit-content'
    }
  };

  return (
    <ModalReact
      style={modalStyles}
      // isOpen={true}
      isOpen={colorPickerOn}
      onRequestClose={handleColorPickerClose}
      parentSelector={() => modalParent}
    >
      <div>
        <div
          style={{
            textAlign: 'left',
            paddingLeft: 5,
            backgroundColor: 'black'
          }}
        >
          <button
            aria-label="close modal"
            type="button"
            style={{
              cursor: 'pointer',
              fontSize: '1.5em',
              border: 'none',
              background: 'black',
              color: 'white'
            }}
            onClick={handleColorPickerClose}
          >
            x
          </button>
        </div>
        <PixlyColorPicker
          color={initialPickerColor}
          onChangeComplete={onPickerChange}
          onClose={handleColorPickerClose}
          type="sketch"
        />
      </div>
    </ModalReact>
  );
}

const mapStateToProps = state => state.present.get('palette').toObject();

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      boundSelectPaletteColor: selectPaletteColor
    },
    dispatch
  );

const PaletteGridContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PaletteGrid);
export default PaletteGridContainer;
