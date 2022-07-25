import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import EraserContainer from './Eraser';
import BucketContainer from './Bucket';
import PencilContainer from './Pencil';
import MoveContainer from './Move';
import EyedropperContainer from './Eyedropper';
import PaletteGridContainer from './PaletteGrid';

import * as drawingToolStates from '../store/reducers/drawingToolStates';
import { colors } from '../utils/color';

function DrawingControls({ selectedTool, helpOn, className }) {
  return (
    <div className={`${className} app__mobile--group`}>
      <StyledColorPicker>
        <PaletteGridContainer />
      </StyledColorPicker>
      <StyledControls>
        <ToolWrapper isSelected={selectedTool === drawingToolStates.PENCIL}>
          <PencilContainer
            helpOn={helpOn}
            helpTooltip="Draw pixels on the canvas"
          />
        </ToolWrapper>
        <ToolWrapper isSelected={selectedTool === drawingToolStates.BUCKET}>
          <BucketContainer
            helpOn={helpOn}
            helpTooltip="It fills an area of the current frame based on color similarity (B)"
          />
        </ToolWrapper>
        <ToolWrapper isSelected={selectedTool === drawingToolStates.EYEDROPPER}>
          <EyedropperContainer
            helpOn={helpOn}
            helpTooltip="Sample a color from your drawing (O)"
          />
        </ToolWrapper>
        <ToolWrapper isSelected={selectedTool === drawingToolStates.ERASER}>
          <EraserContainer helpOn={helpOn} helpTooltip="Remove colors (E)" />
        </ToolWrapper>
        <ToolWrapper isSelected={selectedTool === drawingToolStates.MOVE}>
          <MoveContainer
            helpOn={helpOn}
            helpTooltip="Move your drawing around the canvas (M)"
          />
        </ToolWrapper>
      </StyledControls>
    </div>
  );
}

const mapStateToProps = state => ({
  selectedTool: state.present.get('drawingTool')
});

const StyledColorPicker = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const StyledControls = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  min-width: 180px;
`;

const ConnectedDrawingControls = connect(mapStateToProps)(DrawingControls);

const StyledDrawingControls = styled(ConnectedDrawingControls)`
  text-align: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: calc(24 / 30 * 60vh);
  width: 100%;
  justify-content: space-between;
  align-items: center;

  border-radius: 10px 10px 0px 0px;

  background-color: ${colors.darkBg0};
  padding: 0px 20px 0 20px;

  & > * {
    margin: 1em 0;
  }

  @media only screen and (max-width: 740px) {
    margin-top: 0;
    flex-direction: row;
    padding: 1vh;
    max-width: 100%;

    & > * {
      margin: 0;
    }
  }

  @media only screen and (max-width: 434px) {
    margin-top: 0;
    flex-direction: row;
    padding-bottom: 1vh;
    max-width: 100%;
    justify-content: center;

    & > * {
      margin: 0;
    }
  }
`;

function fullCircleCss(size, color) {
  const ret = `
        background-color: ${color};
        display: inline-block;
        width: ${size}px;
        height: ${size}px;
        border-bottom-right-radius: ${size}px;
        border-bottom-left-radius: ${size}px;
        border-top-right-radius: ${size}px;
        border-top-left-radius: ${size}px;
    `;
  return ret;
}

const StyledToolWrapper = styled.div`
  position: relative;

  ${props =>
    props.isSelected
      ? `&:before {
        content: '';

        ${fullCircleCss(props.size, props.color)};

        // height: 10px;
        // width: 10px;
        // border-radius: 50%;
        // display: inline-block;

        position: absolute;
        transform: translate(250%, 250%);
        left: -0.6em;
        top: 50%;
    }`
      : null}
`;

const ToolWrapper = props => (
  <StyledToolWrapper size={7} color="white" {...props} />
);

export default StyledDrawingControls;
