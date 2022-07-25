import React from 'react';
import { List } from 'immutable';
import { BigNumber } from 'ethers';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import TemplatePreview from './TemplatePreview';
import { applyTemplate } from '../store/actions/actionCreators';

interface TemplateBoxProps {
  name: string;
  tokenId: BigNumber | null;
  grid: List<string>;
}

const TemplateBox = (props: TemplateBoxProps): JSX.Element => {
  const { grid, name, tokenId } = props;
  const dispatch = useDispatch();

  const handleTemplateSelect = () => {
    dispatch(applyTemplate(grid, tokenId === null ? undefined : tokenId));
  };

  return (
    <TemplateBoxContainer onClick={handleTemplateSelect}>
      <TemplateName>{name}</TemplateName>
      <TemplatePreview grid={grid} columns={24} rows={30} cellSize={3} />
    </TemplateBoxContainer>
  );
};

const TemplateBoxContainer = styled.div`
  margin: 5px;
  display: flex;
  flex-direction: column;
  /* flex-flow: row nowrap; */
  justify-content: center;
  align-items: center;
`;

const TemplateName = styled.div`
  color: white;
  margin-bottom: 0.5em;
`;

export default TemplateBox;
