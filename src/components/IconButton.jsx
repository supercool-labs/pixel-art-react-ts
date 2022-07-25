import React from 'react';
import styled from '@emotion/styled';
import { colors } from '../utils/color';

function IconButton({
  helpOn,
  helpTooltip,
  isSelected,
  ariaLabel,
  onClick,
  content
}) {
  return (
    <ButtonWrapper
      isSelected={isSelected}
      data-tooltip={helpOn ? helpTooltip : null}
    >
      <InnerButton
        isSelected={isSelected}
        aria-label={ariaLabel}
        onClick={onClick}
        content={content}
      />
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.div``;

const InnerButton = styled.button`
  display: inline-block;
  font: normal normal normal 14px/1 WebFontIcons;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  font-size: 1.5em;
  cursor: pointer;
  text-align: center;
  color: ${props => (props.isSelected ? 'white' : colors.silver)};
  padding: 0.4em 0;
  width: 100%;
  border: none;
  // background-color: ${props =>
    props.isSelected ? colors.mineShaft : 'transparent'};
  background-color: ${colors.darkBg0};

  &:focus {
    outline: 0;
  }

  &:hover {
    cursor: pointer;
  }

  &:before {
    content: '${props => props.content}';
  }
`;

export default IconButton;
