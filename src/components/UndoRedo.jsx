import React from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { EmbossedButton as Button } from '@supercool/ui-components';
import * as actionCreators from '../store/actions/actionCreators';
import { colors } from '../utils/color';

const UndoRedo = props => {
  const undo = () => {
    props.actions.undo();
  };

  const redo = () => {
    props.actions.redo();
  };

  return (
    <UndoRedoStyled>
      <Button
        type="button"
        ariaLabel="undo"
        onClick={() => {
          undo();
        }}
      >
        <UndoIcon />
      </Button>
      <Button
        type="button"
        ariaLabel="redo"
        onClick={() => {
          redo();
        }}
      >
        <RedoIcon />
      </Button>
    </UndoRedoStyled>
  );
};

const UndoRedoStyled = styled.div`
  lost-utility: clearfix;
  display: flex;
  flex-direction: row;
  margin: 1em 0;

  button {
    width: calc(99.9% * 1 / 2 - (0.5em - 0.5em * 1 / 2));
    margin-right: 0.5em;
    background-color: ${colors.purple};

    &:last-child {
      margin-right: 0;
    }

    font-size: 1.2em;
  }

  & button:hover,
  & button.selected {
    background-color: ${colors.darkPurple} !important;
  }
`;

const UndoIcon = styled.span`
  font: normal normal normal 14px/1 WebFontIcons;
  display: block;

  &:before {
    content: '\\70';
  }
`;

const RedoIcon = styled.span`
  font: normal normal normal 14px/1 WebFontIcons;
  display: block;

  &:before {
    content: '\\71';
  }
`;

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

const UndoRedoContainer = connect(null, mapDispatchToProps)(UndoRedo);
export default UndoRedoContainer;
