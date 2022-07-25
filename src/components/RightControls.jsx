import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { EmbossedButton as Button } from '@supercool/ui-components';
import {
  setFrameName,
  saveGrid,
  loadGrid
} from '../store/actions/actionCreators';
import PreviewBox from './PreviewBox';
import CellSizeContainer from './CellSize';
import DimensionsContainer from './Dimensions';
import DurationContainer from './Duration';
import ResetContainer from './Reset';
import UndoRedoContainer from './UndoRedo';
import { colors } from '../utils/color';
import { getFrameHash } from '../store/reducers/devReducer';

function RightControls({
  className,
  helpOn,
  previewClickFn,
  downloadClickFn,
  mintClickFn,
  setPixlyName,
  pixlyName,
  dispatchSaveGrid,
  dispatchLoadGrid,
  activeFrameIndex,
  templateTokenId
}) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);
  const [loadMsg, setLoadMsg] = useState(null);

  return (
    <div className={`app__right-side ${className}`}>
      <RightControlsInnerContainer>
        <StyledRightControlsMain
          {...{
            helpOn,
            previewClickFn,
            downloadClickFn,
            setPixlyName,
            pixlyName
          }}
        />
        <OuterButtonContainer data-tooltip={helpOn ? 'Mint art' : null}>
          <DoubleButtonRowContainer>
            <SaveButton
              type="button"
              ariaLabel="Save"
              onClick={() => {
                setErrorMsg(null);
                setLoadMsg(null);
                setSaveMsg('Successfully saved grid!');
                dispatchSaveGrid();
              }}
            >
              SAVE
            </SaveButton>
            <LoadButton
              type="button"
              ariaLabel="Load"
              disabled={
                localStorage.getItem(getFrameHash(activeFrameIndex)) === null
              }
              onClick={() => {
                setErrorMsg(null);
                setLoadMsg('Successfully loaded grid!');
                setSaveMsg(null);
                dispatchLoadGrid();
              }}
            >
              LOAD
            </LoadButton>
          </DoubleButtonRowContainer>
          <MintButton
            mint
            type="button"
            ariaLabel="Mint Pixly"
            onClick={() => {
              setSaveMsg(null);
              setLoadMsg(null);
              if (pixlyName) {
                setErrorMsg(null);
                mintClickFn();
              } else {
                setErrorMsg('Pixly name required.');
              }
            }}
          >
            MINT PIXLY! ({templateTokenId === undefined ? '3' : '3.5'} MATIC)
          </MintButton>
          <MessageContainer>
            {templateTokenId === undefined ? (
              <></>
            ) : (
              <Message>minting from template</Message>
            )}
            <Message>(or free with a Mint Pass)</Message>
            {saveMsg ? <SaveMessage>{saveMsg}</SaveMessage> : null}
            {loadMsg ? <LoadMessage>{loadMsg}</LoadMessage> : null}
            {errorMsg ? <ErrorMessage>{errorMsg}</ErrorMessage> : null}
          </MessageContainer>
        </OuterButtonContainer>
      </RightControlsInnerContainer>
    </div>
  );
}

const Message = styled.div`
  font-size: 1.2em;
  margin-top: 0.5em;
  color: white;
  text-align: center;
`;

const ErrorMessage = styled(Message)`
  color: red;
`;

const SaveMessage = styled(Message)`
  color: white;
`;

const LoadMessage = styled(Message)`
  color: white;
`;

const MessageContainer = styled.div`
  flex: 1;
  max-height: 35px;
`;

const mapStateToProps = state => {
  const frames = state.present.get('frames');
  const activeFrameIndex = frames.get('activeIndex');
  return {
    pixlyName: frames.getIn(['list', activeFrameIndex, 'name'], ''),
    activeFrameIndex,
    templateTokenId: frames.getIn(['list', activeFrameIndex, 'templateTokenId'])
  };
};

const mapDispatchToProps = dispatch => ({
  setPixlyName: newName => {
    dispatch(setFrameName(newName));
  },
  dispatchSaveGrid: () => {
    dispatch(saveGrid());
  },
  dispatchLoadGrid: () => {
    dispatch(loadGrid());
  }
});

const ConnectedRightControls = connect(
  mapStateToProps,
  mapDispatchToProps
)(RightControls);

const StyledRightControls = styled(ConnectedRightControls)`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const ActionButton = styled(Button)`
  padding: 0.5em;
  margin-bottom: 0.6em;
`;

const MintButton = styled(ActionButton)`
  width: 100%;
  background-color: ${colors.purple};
  &:hover,
  &.selected {
    background-color: ${colors.darkPurple} !important;
  }
`;

const SaveButton = styled(ActionButton)`
  width: 48%;
  background-color: ${colors.teal};
  &:hover,
  &.selected {
    background-color: ${colors.tealDark} !important;
  }
`;

const LoadButton = styled(ActionButton)`
  width: 48%;
  background-color: ${colors.lightBlue};
  &:hover,
  &.selected {
    background-color: ${colors.darkBlue} !important;
  }
`;

const RightControlsInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const OuterButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-height: 150px;
  justify-content: space-evenly;
`;

const DoubleButtonRowContainer = styled.div`
  display: flex;
  flex: 1;
  max-height: 35px;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0.5em;
`;

function RightControlsMain({
  className,
  helpOn,
  previewClickFn,
  // TODO(dbmikus) [#16] commented out until fixed below
  // downloadClickFn,
  pixlyName,
  setPixlyName
}) {
  return (
    <div className={`app__mobile--container ${className}`}>
      <div className="app__mobile--group">
        <PreviewBox helpOn={helpOn} callback={previewClickFn} />
        {/* Removed the coordinates because they just confused people */}
        {/* <CellsInfo /> */}
        <div
          data-tooltip={helpOn ? 'Number of columns and rows' : null}
          className="max-width-container-centered"
        >
          <DimensionsContainer />
        </div>
      </div>
      <div className="app__mobile--group">
        <div data-tooltip={helpOn ? 'Size of one tile in px' : null}>
          <CellSizeContainer />
        </div>
        <div data-tooltip={helpOn ? 'Animation duration in seconds' : null}>
          <DurationContainer />
        </div>
        <div data-tooltip={helpOn ? 'Undo (CTRL+Z) Redo (CTRL+Y)' : null}>
          <UndoRedoContainer />
        </div>
        <div
          data-tooltip={helpOn ? 'Reset the selected frame' : null}
          className="max-width-container-centered"
        >
          <ResetContainer />
        </div>
        {/* TODO(dbmikus) [#16] Fix how the download modal is rendered before re-enabling */}
        {/* <div
          data-tooltip={
            helpOn ? 'Download your creation in different formats' : null
          }
          >
          <Button
            type="button"
            ariaLabel="Download"
            className="app__download-button"
            onClick={downloadClickFn}
          />
        </div> */}
        <div
          css={css`
            margin-top: 1em;
          `}
        >
          <input
            css={css`
              padding: 0.25em;
            `}
            type="text"
            placeholder="Name of Pixly"
            value={pixlyName}
            onChange={event => setPixlyName(event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

const StyledRightControlsMain = styled(RightControlsMain)`
  max-width: 20em;
  padding: 2em;
  background-color: ${colors.darkBg0};
  border-radius: 10px;
  margin-bottom: 1em;

  display: flex;
  flex-direction: column;
  align-items: center;

  @media only screen and (max-width: 1050px) {
    max-width: 25em;
    flex-direction: row;
    padding-top: 1.5em;
    padding-bottom: 1.5em;
  }

  @media only screen and (max-width: 415px) {
    flex-direction: column;
  }

  & > .app__mobile--group:first-of-type {
    margin-right: 0.5em;
  }
  & > .app__mobile--group {
    margin-left: 0.5em;
    margin-right: 0;
  }
`;

export default StyledRightControls;
