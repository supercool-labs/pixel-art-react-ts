import React from 'react';
import styled from '@emotion/styled';

import { List } from 'immutable';
import { Draggable } from 'react-beautiful-dnd';
import Preview from './Preview';

export default class Frame extends React.Component {
  handleClick() {
    const { actions, dataId } = this.props;
    actions.changeActiveFrame(dataId);
  }

  deleteFrame(e) {
    const { active, actions, dataId } = this.props;
    e.stopPropagation();
    if (active) {
      actions.deleteFrame(dataId);
    }
  }

  duplicateFrame(e) {
    const { active, actions, dataId } = this.props;
    e.stopPropagation();
    if (active) {
      actions.duplicateFrame(dataId);
    }
  }

  changeInterval(e) {
    const { active, actions, dataId } = this.props;
    e.stopPropagation();
    if (active) {
      actions.changeFrameInterval(dataId, this.percentage.value);
    }
  }

  render() {
    const { active, dataId, frame, columns, rows } = this.props;
    return (
      <Draggable key={dataId} draggableId={dataId.toString()} index={dataId}>
        {provided => (
          <div
            className={`frame${active ? ' active' : ''}`}
            onClick={() => {
              this.handleClick();
            }}
            onKeyPress={() => {
              this.handleClick();
            }}
            role="button"
            tabIndex={0}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <StyledFrame>
              <PreviewWrap>
                <Preview
                  frames={List([frame])}
                  columns={columns}
                  rows={rows}
                  cellSize={2}
                  activeFrameIndex={0}
                />
              </PreviewWrap>
              <DrawingText>Drawing {dataId + 1}</DrawingText>
              <ButtonsGrouped>
                <ButtonClose
                  onClick={event => {
                    this.deleteFrame(event);
                  }}
                >
                  x
                </ButtonClose>
              </ButtonsGrouped>
            </StyledFrame>
          </div>
        )}
      </Draggable>
    );
  }
}
const PreviewWrap = styled.div`
  display: flex;
  flex: 1;
`;
const DrawingText = styled.div`
  font-weight: 400;
  font-size: 20px;
  display: flex;
  flex: 2;
`;

const ButtonsGrouped = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

const ButtonClose = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #b8b9bc;
  background-color: #36393f;
  text-align: center;
  justify-content: center;
  display: flex;
  align-items: center;
`;

const StyledFrame = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  height: auto;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;
