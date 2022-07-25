import React from 'react';

const PaletteColor = props => {
  const { positionInPalette, color, selected, selectPaletteColor } = props;

  const handleClick = () => selectPaletteColor(positionInPalette);

  const size = '3vh';
  const minSize = '15px';
  const cellColor = color;
  const styles = {
    minWidth: `${minSize}`,
    width: `${size}`,
    minHeight: `${minSize}`,
    height: `${size}`,
    backgroundColor: cellColor,
    borderBottomRightRadius: `${size}`,
    borderBottomLeftRadius: `${size}`,
    borderTopRightRadius: `${size}`,
    borderTopLeftRadius: `${size}`
  };

  return (
    <button
      type="button"
      aria-label="Color Palette"
      className={`palette-color
        ${selected ? 'selected' : ''}`}
      style={styles}
      onClick={handleClick}
    />
  );
};

export default PaletteColor;
