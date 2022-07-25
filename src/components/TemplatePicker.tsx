import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { BigNumber } from 'ethers';
import { colors } from '../utils/color';
import TemplateBox from './TemplateBox';
import { flattenObjGrid } from '../utils/grid';
import { TemplateData } from '../store/actions/actionTypes';
import { UndoableState } from '../store/types';

interface TemplatePickerProps {
  templates: TemplateData[];
}

interface CustomTemplate extends Omit<TemplateData, 'tokenId'> {
  tokenId: BigNumber | null;
}

const TemplatePicker = (props: TemplatePickerProps): JSX.Element => (
  <div>
    <StyledTitle>Templates</StyledTitle>
    <StyledContainer>
      {joinUpRows(props.templates, 2).map(row => (
        <TemplateRow
          key={row.map(template => template.tokenId?.toString()).join(':')}
        >
          {row.map(template => (
            <TemplateCell key={template.tokenId?.toString()}>
              <TemplateBox
                name={template.name}
                tokenId={template.tokenId}
                grid={flattenObjGrid(template.grid)}
              />
            </TemplateCell>
          ))}
        </TemplateRow>
      ))}
    </StyledContainer>
  </div>
);

const joinUpRows = (
  templates: CustomTemplate[],
  nPerRow: number
): CustomTemplate[][] => {
  const allRows: CustomTemplate[][] = [];
  for (let i = 0; i < templates.length; i++) {
    if (i % nPerRow === 0) {
      allRows.push([]);
    }
    const rowIdx = Math.floor(i / nPerRow);
    allRows[rowIdx].push(templates[i]);
  }
  return allRows;
};

const StyledContainer = styled.div`
  padding: 1em;
  background-color: ${colors.darkBg0};
  margin-bottom: 1em;
  max-height: 65vh;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TemplateRow = styled.div`
  width: 100%;
  background-color: ${colors.darkBg0};
  margin-bottom: 1em;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  text-align: center;
`;

const TemplateCell = styled.div`
  width: 50%;
`;

const StyledTitle = styled.div`
  color: white;
  text-align: center;
  margin-bottom: 1em;
`;

const mapStateToProps = (state: UndoableState) => ({
  templates: state.present.getIn(['options', 'templates']).toJS()
});

const TemplatePickerContainer = connect(mapStateToProps)(TemplatePicker);

export default TemplatePickerContainer;
