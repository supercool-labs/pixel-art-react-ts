import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModalReact from 'react-modal';
import styled from '@emotion/styled';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from 'body-scroll-lock';
import { EmbossedButton as Button } from '@supercool/ui-components';
import { MintResult } from '../types';
import * as common from './mint-modals/common';
import * as actionCreators from '../store/actions/actionCreators';
import RadioSelector from './RadioSelector';
import Preview from './Preview';
import LoadDrawing from './LoadDrawing';
import CopyCSS from './CopyCSS';
import DownloadDrawing from './DownloadDrawing';
import KeyBindingsLegend from './KeyBindingsLegend';
import { MintModal, MintSuccessModal } from './mint-modals';
import { colors } from '../utils/color';

export const modalTypes = {
  COPY_CSS: 'copycss',
  LOAD: 'load',
  KEYBINDINGS: 'keybindings',
  DOWNLOAD: 'download',
  PREVIEW: 'preview',
  MINT: 'mint',
  MINT_SUCCESS: 'mintsuccess'
};

const MODAL_PADDING = 20;

type ModalProps = {
  frames: any;
  activeFrameIndex: number;
  activeFrame: any;
  paletteGridData: any;
  columns: number;
  rows: number;
  cellSize: number;
  duration: number;
  pixlyName: string;
  appUrlScheme: string;
  appHost: string;
  actions: Record<string, (...args: any[]) => any>;
  close: () => void;
  className?: string;
  isOpen: boolean;
  type: keyof typeof modalTypes;
};

type ModalState = {
  previewType: string;
  loadType: string;
  mintResult: MintResult | null;
};

class Modal extends React.Component<ModalProps, ModalState> {
  static generateRadioOptions(props: any) {
    let options;

    if (props.type !== modalTypes.LOAD) {
      options = [
        {
          value: 'single',
          description: 'single',
          labelFor: 'single',
          id: 3
        }
      ];

      if (props.frames.size > 1) {
        const spritesheetSupport =
          props.type === modalTypes.DOWNLOAD || props.type === 'twitter';
        const animationOptionLabel = spritesheetSupport ? 'GIF' : 'animation';

        const animationOption = {
          value: 'animation',
          description: animationOptionLabel,
          labelFor: animationOptionLabel,
          id: 4
        };
        options.push(animationOption);

        if (spritesheetSupport) {
          options.push({
            value: 'spritesheet',
            description: 'spritesheet',
            labelFor: 'spritesheet',
            id: 5
          });
        }
      }
    } else {
      options = [
        {
          value: 'storage',
          description: 'Stored',
          labelFor: 'stored',
          id: 0
        },
        {
          value: 'loadImgFile',
          description: 'Load From Image',
          labelFor: 'load-img-file',
          id: 1
        },
        {
          value: 'import',
          description: 'Import',
          labelFor: 'import',
          id: 2
        },
        {
          value: 'export',
          description: 'Export',
          labelFor: 'export',
          id: 3
        },
        {
          value: 'extractData',
          description: 'Useful Data',
          labelFor: 'useful-data',
          id: 4
        }
      ];
    }

    return options;
  }

  private modalBodyRef: React.RefObject<any>;
  private modalContainerRef: React.RefObject<any>;
  private showModal: () => void;
  private closeModal: () => void;
  private scrollTop: () => void;

  constructor(props: ModalProps) {
    super(props);
    this.state = {
      previewType: 'single',
      loadType: 'storage',
      mintResult: null
    };
    this.modalBodyRef = React.createRef();
    this.modalContainerRef = React.createRef();
    this.showModal = () => disableBodyScroll(this.modalContainerRef.current);
    this.closeModal = () => {
      enableBodyScroll(this.modalContainerRef.current);
      props.close();
    };
    this.changeRadioType = this.changeRadioType.bind(this);
    this.scrollTop = () => this.modalBodyRef.current.scrollTo(0, 0);
    ModalReact.setAppElement('body');
  }

  componentWillUnmount() {
    clearAllBodyScrollLocks();
  }

  getModalContent(props: any) {
    const { previewType, loadType } = this.state;
    const options = Modal.generateRadioOptions(props);
    let content;
    let previewCellSize;
    if (props.type === modalTypes.PREVIEW) {
      previewCellSize = props.cellSize;
    } else if (props.type === modalTypes.MINT_SUCCESS) {
      previewCellSize = 2;
    } else {
      previewCellSize = 5;
    }
    const previewBlock = (
      <>
        {previewType !== 'spritesheet' ? (
          <div className="modal__preview--wrapper">
            <Preview
              key="0"
              frames={props.frames}
              columns={props.columns}
              rows={props.rows}
              cellSize={previewCellSize}
              duration={props.duration}
              activeFrameIndex={props.activeFrameIndex}
              animate={previewType === 'animation'}
            />
          </div>
        ) : null}
      </>
    );
    const isLoadModal = props.type === modalTypes.LOAD;
    const radioType = isLoadModal ? 'load' : modalTypes.PREVIEW;
    let radioOptions: JSX.Element | null = (
      <div className={`modal__${radioType}`}>
        <RadioSelector
          legend={null}
          name={`${radioType}-type`}
          selected={isLoadModal ? loadType : previewType}
          change={this.changeRadioType}
          options={options}
        />
      </div>
    );

    const shareUrl = `${props.appUrlScheme}://${props.appHost}/pixlies/${
      this.state.mintResult === null ? 'all' : this.state.mintResult.tokenId
    }`;

    switch (props.type) {
      case modalTypes.LOAD:
        content = (
          <LoadDrawing
            loadType={loadType}
            close={this.closeModal}
            open={props.open}
            frames={props.frames}
            columns={props.columns}
            rows={props.rows}
            cellSize={props.cellSize}
            paletteGridData={props.paletteGridData}
            actions={{
              setDrawing: props.actions.setDrawing,
              sendNotification: props.actions.sendNotification
            }}
          />
        );
        break;
      case modalTypes.COPY_CSS:
        content = (
          <>
            {previewBlock}
            <CopyCSS
              frames={props.frames}
              columns={props.columns}
              cellSize={props.cellSize}
              activeFrameIndex={props.activeFrameIndex}
              animationCode={previewType !== 'single'}
              duration={props.duration}
            />
          </>
        );
        break;
      case modalTypes.DOWNLOAD:
        content = (
          <>
            {previewBlock}
            <DownloadDrawing
              frames={props.frames}
              activeFrame={props.activeFrame}
              columns={props.columns}
              rows={props.rows}
              cellSize={props.cellSize}
              duration={props.duration}
              downloadType={previewType}
              actions={{ sendNotification: props.actions.sendNotification }}
            />
          </>
        );
        break;
      case modalTypes.KEYBINDINGS:
        content = (
          <>
            <KeyBindingsLegend />
          </>
        );
        radioOptions = null;
        break;
      case modalTypes.MINT:
        content = (
          <MintModal
            previewBlock={previewBlock}
            onMintSuccess={(mintResult: MintResult) => {
              this.setMintResult(mintResult);
              props.onMintSuccess();
            }}
          />
        );
        radioOptions = null;
        break;
      case modalTypes.MINT_SUCCESS:
        content = (
          <MintSuccessModal
            mintResultNode={
              <common.ModalContainer>
                <common.Preview
                  pixlyName={props.pixlyName}
                  previewBlock={previewBlock}
                />
                {this.renderMintResultNode()}
              </common.ModalContainer>
            }
            mainProps={{
              type: 'TwitterShareMain',
              props:
                this.state.mintResult === null
                  ? {
                      buttonText: 'Share your Pixly!',
                      shareText: `I just minted my on-chain pixel art with the Pixly editor by @supercoolxyz\n\nCheck it out: ${shareUrl}\n\n`,
                      ariaLabel: 'Share your Pixly!',
                      hashTags: ['supercool', 'ethereum', 'NFT']
                    }
                  : this.state.mintResult.shareProps
            }}
          />
        );
        radioOptions = null;
        break;
      default:
        content = <>{previewBlock}</>;
        break;
    }

    return (
      <div className={props.className}>
        <Header>
          <HeaderTitle>{this.getModalTitle()}</HeaderTitle>
          <CloseButton
            ariaLabel="close modal"
            type="button"
            onClick={this.closeModal}
          >
            x
          </CloseButton>
        </Header>
        {radioOptions}
        <div className="modal__body" ref={this.modalBodyRef}>
          {content}
        </div>
      </div>
    );
  }

  getModalTitle() {
    const { type } = this.props;

    switch (type) {
      case modalTypes.LOAD:
        return 'Load Drawing';
      case modalTypes.COPY_CSS:
        return 'Copy Drawing as CSS';
      case modalTypes.KEYBINDINGS:
        return 'Keyboard Shortcuts';
      case modalTypes.DOWNLOAD:
        return 'Download Drawing';
      case modalTypes.PREVIEW:
        return 'Preview';
      case modalTypes.MINT:
        return 'Complete Checkout';
      case modalTypes.MINT_SUCCESS:
        return 'Mint Successful';
      default:
        return '';
    }
  }

  getInset() {
    const { type } = this.props;
    if (type === modalTypes.MINT || type === modalTypes.MINT_SUCCESS) {
      return '15% 20%';
    }
    return '40px';
  }

  setMintResult(mintResult: MintResult) {
    const newState = { ...this.state };
    newState.mintResult = mintResult;
    this.setState(newState);
  }

  changeRadioType(value: any, type: any) {
    const newState: any = {};
    this.scrollTop();
    switch (type) {
      case 'load-type':
        newState.loadType = value;
        break;
      default:
        newState.previewType = value;
    }
    this.setState(newState);
  }

  renderMintResultNode(): React.ReactNode {
    if (!this.state.mintResult) {
      return null;
    }
    const { mintResult } = this.state;
    return mintResult.node;
  }

  render() {
    const { isOpen, type } = this.props;
    const styles = {
      content: {
        overflow: 'hidden',
        display: 'flex',
        padding: MODAL_PADDING,
        inset: this.getInset(),
        borderRadius: 12,
        maxWidth: 800,
        margin: 'auto'
      }
    };

    return (
      <ModalReact
        isOpen={isOpen}
        onRequestClose={this.closeModal}
        onAfterOpen={this.showModal}
        ref={this.modalContainerRef}
        style={styles}
        contentLabel={`Dialog ${type || ''}`}
      >
        {this.getModalContent(this.props)}
      </ModalReact>
    );
  }
}

const StyledModal = styled(Modal)`
  font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue',
    Helvetica, Arial, 'Lucida Grande', sans-serif;

  display: flex;
  flex: 1;
  flex-direction: column;

  .preview {
    margin: 0 auto;
  }
  .modal__body {
    overflow: auto;
    overflow-x: hidden;
  }
  .modal__preview,
  .modal__load {
    .modal__preview--wrapper {
      border: solid 1px black;
      margin: 1em auto;
      display: table;
    }
  }

  .modal__load,
  .modal__preview,
  .modal__body {
    fieldset {
      padding: 1em 0;

      label {
        margin: 1em 0.5em;
        display: inline-block;
      }
    }
  }
`;

const mapStateToProps = (state: any): any => {
  const frames = state.present.get('frames');
  const activeFrameIndex = frames.get('activeIndex');
  return {
    frames: frames.get('list'),
    activeFrameIndex,
    activeFrame: frames.getIn(['list', activeFrameIndex]),
    paletteGridData: state.present.getIn(['palette', 'grid']),
    columns: frames.get('columns'),
    rows: frames.get('rows'),
    cellSize: state.present.get('cellSize'),
    duration: state.present.get('duration'),
    pixlyName: frames.getIn(['list', activeFrameIndex, 'name']),
    appUrlScheme: state.present.get('options').get('appUrlScheme'),
    appHost: state.present.get('options').get('appHost')
  };
};

const mapDispatchToProps = (dispatch: any): any => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

const ModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledModal);
export default ModalContainer;

const Header = styled.div`
  box-sizing: border-box;
  width: calc(100% + ${2 * MODAL_PADDING}px);
  position: relative;
  left: -20px;
  padding-left: ${MODAL_PADDING}px;
  padding-right: ${MODAL_PADDING}px;
  padding-bottom: 1em;
  margin-bottom: 1em;
  border-bottom: solid 1px ${colors.lightestGray};

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
`;

const HeaderTitle = styled.span`
  font-weight: 700;
  font-size: 1.4em;
`;

const CloseButton = styled(Button)`
  padding: 0.4em 0.7em 0.3em 0.8em;
  margin: 0;
  position: absolute;
  top: -6px;
  right: ${MODAL_PADDING}px;
`;
