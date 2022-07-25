import React from 'react';
import styled from '@emotion/styled';

const Category = styled.h3`
  margin-top: 1.6em;
  font-size: 1.2em;
  border-bottom: 1px solid;
`;

const Wrapper = styled.div`
  padding: 2em;
  padding-top: 0em;
  margin: 0 auto;
  width: 50%;
  @media only screen and (max-width: 1000px) {
    width: 100%;
  }
  @media only screen and (max-width: 600px) {
    padding: 1em 0;
    font-size: 0.8em;
  }
`;

const ShortcutList = styled.div`
  &:before,
  &:after {
    display: table;
    content: ' ';
    clear: both;
  }
  &:after {
    clear: both;
  }
  padding: 0;
`;

const ShortcutOption = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1em 0;

  & > * {
    width: 50%;
  }
`;

const KeyContainer = styled.span`
  padding: 0.1em 0.5em;
  background-color: #4b4949;
  border: 3px solid #313131;
  color: #e0e0e0;
  @media only screen and (max-width: 600px) {
    font-size: 0.8em;
  }
`;

const Shortcut = ({ label, keyList }) => {
  const combination = keys => {
    const keyCount = keys.length;
    return keys.map((key, index) => (
      <span key={key}>
        <KeyContainer>{key}</KeyContainer>
        {`${index < keyCount - 1 ? ' + ' : ''}`}
      </span>
    ));
  };

  return (
    <ShortcutOption>
      <div>
        <b>{label}</b>
      </div>
      <div>{combination(keyList)}</div>
    </ShortcutOption>
  );
};

const KeyBindingsLegend = () => (
  <Wrapper>
    <Category>History</Category>
    <ShortcutList>
      <Shortcut label="Undo" keyList={['CTRL', 'Z']} />
      <Shortcut label="Redo" keyList={['CTRL', 'Y']} />
    </ShortcutList>
    <Category>Switch Tool</Category>
    <ShortcutList>
      <Shortcut label="Bucket" keyList={['B']} />
      <Shortcut label="Eraser" keyList={['E']} />
      <Shortcut label="Eyedropper" keyList={['O']} />
      <Shortcut label="Move" keyList={['M']} />
      <Shortcut label="Color picker" keyList={['P']} />
    </ShortcutList>
    <Category>Canvas Dimension</Category>
    <ShortcutList>
      <Shortcut label="Add column" keyList={['CTRL', 'RIGHT']} />
      <Shortcut label="Remove column" keyList={['CTRL', 'LEFT']} />
      <Shortcut label="Add row" keyList={['CTRL', 'DOWN']} />
      <Shortcut label="Remove row" keyList={['CTRL', 'UP']} />
    </ShortcutList>
  </Wrapper>
);

export default KeyBindingsLegend;
