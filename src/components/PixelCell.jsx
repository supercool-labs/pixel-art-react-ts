import React from 'react';
import styled from '@emotion/styled';
import { colors } from '../utils/color';

const GRID_INITIAL_COLOR = 'rgba(0, 0, 0, 1)';

export default class PixelCell extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { cell } = this.props;
    const keys = ['color', 'width'];
    const isSame = keys.every(key => cell[key] === nextProps.cell[key]);
    return !isSame;
  }

  render() {
    const {
      cell: { color, width, height },
      id,
      drawHandlers: { onMouseDown, onMouseOver }
    } = this.props;

    return (
      <StyledPixelCell
        onMouseDown={ev => onMouseDown(id, ev)}
        onMouseOver={ev => onMouseOver(id, ev)}
        onFocus={ev => onMouseOver(id, ev)}
        onTouchStart={ev => onMouseDown(id, ev)}
        dims={{ height, width }}
        color={color}
      />
    );
  }
}

const StyledPixelCell = styled.div`
  box-sizing: border-box;
  background-color: ${props => props.color || GRID_INITIAL_COLOR};
  flex-basis: ${props => props.dims.width}%;
  height: ${props => props.dims.height}%;
  border: 1px solid ${colors.scorpion};
  border-width: 1px 0 0 1px;
`;
