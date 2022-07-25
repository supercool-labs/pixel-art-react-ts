import React from 'react';
import { generatePixelDrawCssWithGrid } from '../utils/cssParse';

const TemplatePreview = props => {
  const generatePreview = () => {
    const { grid, columns, cellSize } = props;

    const styles = {
      previewWrapper: {
        height: cellSize,
        width: cellSize,
        position: 'absolute',
        top: '-5px',
        left: '-5px'
      }
    };
    const cssString = generatePixelDrawCssWithGrid(
      grid,
      columns,
      cellSize,
      'string'
    );

    styles.previewWrapper.boxShadow = cssString;
    styles.previewWrapper.MozBoxShadow = cssString;
    styles.previewWrapper.WebkitBoxShadow = cssString;

    return <div style={styles.previewWrapper} />;
  };

  const { columns, rows, cellSize } = props;
  const style = {
    width: columns * cellSize,
    height: rows * cellSize,
    position: 'relative',
    backgroundColor: 'black'
  };

  return (
    <div className="preview" style={style}>
      {generatePreview()}
    </div>
  );
};
export default TemplatePreview;
