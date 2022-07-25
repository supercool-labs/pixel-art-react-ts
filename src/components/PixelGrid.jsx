import React from 'react';
import styled from '@emotion/styled';
import PixelCell from './PixelCell';

const PixelGrid = ({
  cells,
  drawHandlers,
  classes,
  className,
  nbrColumns,
  nbrRows,
  hoveredCell
}) => (
  <div
    className={`${className} ${classes}`}
    onTouchMove={drawHandlers.onTouchMove}
  >
    {cells.map(cell => (
      <PixelCell
        key={cell.id}
        cell={cell}
        id={cell.id}
        drawHandlers={drawHandlers}
        onFocus={(id, ev) => drawHandlers.onMouseOver(id, ev)}
        nbrColumns={nbrColumns}
        nbrRows={nbrRows}
        hoveredCell={hoveredCell}
      />
    ))}
  </div>
);

const cssHeight = '60vh';
// height: ${cssHeight};
// width: calc(${props => props.nbrColumns / props.nbrRows} * ${cssHeight});

const StyledPixelGrid = styled(PixelGrid)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;

  ${
    '' /* width: auto;
  height: calc(${props => props.nbrRows / props.nbrColumns} * 111vh); */
  }

  height: ${cssHeight};
  width: calc(${props => props.nbrColumns / props.nbrRows} * ${cssHeight});

  // TODO(dbmikus) [#10] This is a hack to prevent the grid from horizontally
  // overflowing on mobile. However, it slightly compresses the pixels so they
  // are not square.
  max-width: 100%;

  border: solid 2px white;

  @media only screen and (max-width: 740px) {
    width: 100%;
    height: calc(${props => props.nbrRows / props.nbrColumns} * 1vw * 100);
  }
`;

export default StyledPixelGrid;
