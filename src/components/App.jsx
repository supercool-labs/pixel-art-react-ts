import React from 'react';
import CookieConsent from 'react-cookie-consent';
import styled from '@emotion/styled';
import { CC0License } from '@supercool/ui-components';
import PixelCanvasContainer from './PixelCanvas';
import ModalContainer, { modalTypes } from './Modal';
import DrawingControls from './DrawingControls';
import RightControls from './RightControls';
import CssDisplayContainer from './CssDisplay';
import FramesHandlerContainer from './FramesHandler';
import SaveDrawingContainer from './SaveDrawing';
import NewProjectContainer from './NewProject';
import SimpleNotificationContainer from './SimpleNotification';
import SimpleSpinnerContainer from './SimpleSpinner';
import initialSetup from '../utils/startup';
import drawHandlersProvider from '../utils/drawHandlersProvider';
import TemplatePicker from './TemplatePicker';
import { colors } from '../utils/color';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalType: null,
      modalOpen: false,
      helpOn: false
    };
    Object.assign(this, drawHandlersProvider(this));
  }

  componentDidMount() {
    const { dispatch } = this.props;
    initialSetup(dispatch, localStorage);
  }

  changeModalType(type) {
    this.setState({
      modalType: type,
      modalOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalOpen: false
    });
  }

  toggleHelp() {
    const { helpOn } = this.state;
    this.setState({ helpOn: !helpOn });
  }

  renderCopyCssButton({ helpOn }) {
    const renderButton = false;
    if (!renderButton) {
      return null;
    }

    return (
      <button
        type="button"
        className="app__copycss-button"
        onClick={() => {
          this.changeModalType(modalTypes.COPY_CSS);
        }}
        data-tooltip={helpOn ? 'Check your CSS generated code' : null}
      >
        css
      </button>
    );
  }

  renderIOControls({ helpOn }) {
    const doRender = false;
    if (!doRender) {
      return null;
    }

    return (
      <div className="app__mobile--group">
        <div data-tooltip={helpOn ? 'New project' : null}>
          <NewProjectContainer />
        </div>
        <div className="app__load-save-container">
          <button
            type="button"
            className="app__load-button"
            onClick={() => {
              this.changeModalType(modalTypes.LOAD);
            }}
            data-tooltip={helpOn ? 'Load projects you stored before' : null}
          >
            LOAD
          </button>
          <div data-tooltip={helpOn ? 'Save your project' : null}>
            <SaveDrawingContainer />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { helpOn, modalType, modalOpen } = this.state;
    const { className } = this.props;
    return (
      <div
        className={`${className} pixel-art-react-container app app__main`}
        onMouseUp={this.onMouseUp}
        onTouchEnd={this.onMouseUp}
        onTouchCancel={this.onMouseUp}
      >
        <SimpleSpinnerContainer />
        <SimpleNotificationContainer
          fadeInTime={1000}
          fadeOutTime={1500}
          duration={1500}
        />
        <StyledAppFramesContainer
          data-tooltip={
            helpOn
              ? `Create an awesome animation sequence.
              You can modify the duration of each frame, changing its own value.
              The number indicates where the frame ends in a range from 0 to 100.
              `
              : null
          }
        >
          <FramesHandlerContainer />
        </StyledAppFramesContainer>
        <StyledCentralContainer>
          <LeftControls
            helpOn={helpOn}
            loadClickFn={() => {
              this.changeModalType(modalTypes.LOAD);
            }}
            isIOControlsRendered={false}
          />
          <PixelCanvasWrapper>
            <DrawingControls helpOn={helpOn} />
            <PixelCanvasContainer
              drawHandlersFactory={this.drawHandlersFactory}
            />
          </PixelCanvasWrapper>
          <RightControls
            helpOn={helpOn}
            downloadClickFn={() => {
              this.changeModalType(modalTypes.DOWNLOAD);
            }}
            previewClickFn={() => {
              this.changeModalType(modalTypes.PREVIEW);
            }}
            mintClickFn={() => {
              this.changeModalType(modalTypes.MINT);
            }}
          />
        </StyledCentralContainer>
        <div className="css-container">
          <CssDisplayContainer />
        </div>
        <CookieConsent
          location="bottom"
          buttonText="Got it!"
          cookieName="pixelartcssCookiesAccepted"
          style={{
            background: '#313131',
            fontSize: '13px',
            textAlign: 'center'
          }}
          buttonStyle={{
            background: '#bbbbbb',
            color: '#4e503b',
            fontSize: '13px'
          }}
          contentStyle={{
            flex: '1 0 200px',
            margin: '15px'
          }}
          expires={150}
        >
          <span>
            By continuing to use this website you are giving consent to cookies
            being used. We use cookies to ensure you get the best experience on
            this site.
          </span>
          <CC0License />
        </CookieConsent>
        <ModalContainer
          type={modalType}
          isOpen={modalOpen}
          onMintSuccess={() => {
            this.changeModalType(modalTypes.MINT_SUCCESS);
          }}
          close={() => {
            this.closeModal();
          }}
          open={() => {
            this.changeModalType(modalType);
          }}
        />
      </div>
    );
  }
}

const StyledApp = styled(App)`
  background-color: ${colors.darkBg1};
`;
export default StyledApp;

const StyledAppFramesContainer = styled.div`
  margin-bottom: 1em;

  &[data-tooltip]:after {
    width: 80%;
    margin-left: -40%;
  }

  @media only screen and (min-width: 730px) {
    /*
    Fix small vertical scrollbar glitch for some resolutions
    inside frames-handler
    Detected in Chrome
    */
    &:-webkit-scrollbar,
    & div::-webkit-scrollbar {
      width: 1em !important;
    }
  }

  @media only screen and (max-width: 740px) {
    margin-bottom: 0;
  }
`;

const StyledCentralContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  & > * {
    flex-grow: 1;
    margin-bottom: 2em;
  }

  @media only screen and (max-width: 740px) {
    flex-direction: column;
    padding-top: 0;
  }
`;

function LeftControls({ helpOn, loadClickFn, isIOControlsRendered }) {
  return (
    <StyledLeftControls>
      <div className="app__mobile--container">
        {isIOControlsRendered ? (
          <IOControls helpOn={helpOn} loadClickFn={loadClickFn} />
        ) : null}
      </div>
      <div className="app__mobile--group">
        <TemplatePicker />
      </div>
    </StyledLeftControls>
  );
}

const StyledLeftControls = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;

  @media only screen and (max-width: 740px) {
    flex-direction: column;
    align-items: center;
  }
  min-width: 300px;
`;

function IOControls({ helpOn, loadClickFn }) {
  return (
    <div className="app__mobile--group">
      <div data-tooltip={helpOn ? 'New project' : null}>
        <NewProjectContainer />
      </div>
      <div className="app__load-save-container">
        <button
          type="button"
          className="app__load-button"
          onClick={loadClickFn}
          data-tooltip={helpOn ? 'Load projects you stored before' : null}
        >
          LOAD
        </button>
        <div data-tooltip={helpOn ? 'Save your project' : null}>
          <SaveDrawingContainer />
        </div>
      </div>
    </div>
  );
}

const PixelCanvasWrapper = styled.div`
  // TODO(dbmikus) [#10] This is a hack to prevent the grid from horizontally
  // overflowing on mobile. However, it slightly compresses the pixels so they
  // are not square.
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 1em;
  margin-right: 1em;

  @media only screen and (max-width: 1050px) {
    min-width: 50%;
  }
`;
