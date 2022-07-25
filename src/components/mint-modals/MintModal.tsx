import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import shortid from 'shortid';
import { BigNumber } from 'ethers';
import { EmbossedButton as Button, CC0License } from '@supercool/ui-components';
import { MintPassFactory } from '../../../typechain';
import { useEthContext } from '../../contexts/ethContext';
import * as actionCreators from '../../store/actions/actionCreators';
import PolygonLogo from '../svg/PolygonLogo';
import Grid from '../../utils/grid';
import { colors } from '../../utils/color';
import { UNTITLED_DISPLAY_NAME, ModalContainer, Preview } from './common';

const mintStates = {
  PRE_MINT: 'PRE_MINT',
  MINT_FAILURE: 'MINT_FAILURE',
  MINT_PENDING: 'MINT_PENDING'
};

function MintModal(props: any): JSX.Element {
  // there is also `mintArgs` if you want to use it. Removed because lint
  // complains about unused variables.
  const [{ mintState }, setMintState] = useState({
    mintState: mintStates.PRE_MINT,
    mintArgs: {}
  });

  const { pixlyName, previewBlock, onMintSuccess, ethAccountAddress } = props;

  const postMintFn = (mintResult: any) => {
    Promise.resolve(mintResult)
      .then(onMintSuccess)
      .catch(() => {
        setMintState({ mintState: mintStates.MINT_FAILURE, mintArgs: {} });
      });
  };

  let mintStateContent;
  const mintDrawingContent = (
    <MintDrawing
      {...props}
      postMintFn={postMintFn}
      setMintState={setMintState}
    />
  );
  switch (mintState) {
    case mintStates.PRE_MINT:
      mintStateContent = (
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end'
            }}
          >
            <PolygonLogo alt="Polygon logo" />
            <span
              style={{
                marginLeft: '1em',
                fontSize: '1.4em'
              }}
            >
              Minting on Polygon
            </span>
          </div>
          {mintDrawingContent}
          {ethAccountAddress === null && (
            <div>Please connect your wallet to mint.</div>
          )}
        </>
      );
      break;
    case mintStates.MINT_FAILURE:
      mintStateContent = (
        <>
          {mintDrawingContent}
          <div>Failed to mint. Please try again.</div>
        </>
      );
      break;
    case mintStates.MINT_PENDING:
      mintStateContent = (
        <>
          Mint pending. Please wait for the prompt to confirm the transaction
          with your wallet.
        </>
      );
      break;
    default:
      console.error(`Unexpected mint state "${mintState}".`);
      throw new Error(`Unexpected mint state "${mintState}".`);
  }

  return (
    <ModalContainer>
      <Preview pixlyName={pixlyName} previewBlock={previewBlock} />
      {mintStateContent}
    </ModalContainer>
  );
}

const mapStateToProps = (state: any) => {
  const frames = state.present.get('frames');
  const activeFrameIndex = frames.get('activeIndex');
  return {
    activeFrame: frames.getIn(['list', activeFrameIndex]),
    pixlyName: frames.getIn(['list', activeFrameIndex, 'name']),
    frames: frames.get('list'),
    columns: frames.get('columns'),
    rows: frames.get('rows'),
    cellSize: state.present.get('cellSize'),
    paletteGridData: state.present.getIn(['palette', 'grid']),
    ethAccountAddress: state.present.get('ethAccountAddress'),
    ethContracts: state.present.get('ethContracts'),
    templateTokenId: frames.getIn(['list', activeFrameIndex, 'templateTokenId'])
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

const MintModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MintModal);
export default MintModalContainer;

type MintDrawingProps = {
  ethAccountAddress: string;
  ethContracts: any;
  templateTokenId: BigNumber;
  activeFrame: any;
  frames: any;
  paletteGridData: any;
  cellSize: number;
  columns: number;
  rows: number;
  pixlyName: string;
  setMintState: any;
  actions: Record<any, (...args: any[]) => void>;
  postMintFn: (result: Promise<React.ReactNode>) => void;
};

const MintDrawing = (props: MintDrawingProps): JSX.Element => {
  const { mintFn } = useEthContext();
  const [isMintPassAvailable, setisMintPassAvailable] = useState(false);
  const [mintPassBalance, setMintPassBalance] = useState<null | BigNumber>(
    null
  );

  const { ethAccountAddress, ethContracts, templateTokenId } = props;
  const mintPassFactory = ethContracts ? ethContracts.mintPassFactory : null;

  useEffect(() => {
    const asyncFn = async () => {
      const balance = await getUsersMintPasses(
        ethAccountAddress,
        mintPassFactory
      );
      setMintPassBalance(balance);
      setisMintPassAvailable(getIsMintPassAvailable(balance));
    };
    asyncFn();
  }, [ethAccountAddress, mintPassFactory]);

  const mint = (mintWithCurrency: any) => {
    const drawingToMint = {
      activeFrame: props.activeFrame,
      frames: props.frames,
      paletteGridData: props.paletteGridData,
      cellSize: props.cellSize,
      columns: props.columns,
      rows: props.rows,
      animate: props.frames.size > 1,
      id: shortid.generate(),
      name: props.pixlyName
    };
    const grid = new Grid(
      drawingToMint.activeFrame.get('grid'),
      drawingToMint.columns
    );
    // Wrap in a promise, just in case the mintFn doesn't use one.
    const mintResult = Promise.resolve(
      mintFn(
        props.setMintState,
        grid.toGridArray(),
        drawingToMint.name,
        mintWithCurrency,
        props.templateTokenId
      )
    )
      .then(function (result) {
        if (result) {
          props.actions.sendNotification(
            `Pixly "${drawingToMint.name || UNTITLED_DISPLAY_NAME}" minted`
          );
        } else {
          throw new Error('mint result falsey');
        }
        return result;
      })
      .catch(function (err) {
        props.actions.sendNotification('Error minting');
        console.error('Error minting:', err);
        throw err;
      });
    props.postMintFn(mintResult);
  };

  return (
    <MintDrawingContainer>
      <CC0LicenseSpaced />
      <MintButton
        type="button"
        ariaLabel={`Mint Pixly with 3${
          templateTokenId === undefined ? '' : ' + 0.5'
        } MATIC`}
        onClick={() => mint('MATIC')}
        disabled={props.ethAccountAddress === null}
      >
        Mint with {templateTokenId === undefined ? '3' : ' + 3.5'} MATIC
      </MintButton>
      <MintButton
        type="button"
        ariaLabel={`Mint Pixly with Mint Pass${
          templateTokenId === undefined ? '' : ' (+ 0.5 MATIC)'
        }`}
        onClick={() => mint('SCMP')}
        disabled={!isMintPassAvailable}
      >
        Mint with Mint Pass
        {templateTokenId === undefined ? '' : ' (+ 0.5 MATIC)'}
      </MintButton>
      {templateTokenId === undefined ? (
        <></>
      ) : (
        <BlurbSpan>
          You are minting from template ID {templateTokenId.toString()}
        </BlurbSpan>
      )}
      <BlurbSpan>
        You have {mintPassBalance ? mintPassBalance.toString() : '0'} mint
        passes
      </BlurbSpan>
    </MintDrawingContainer>
  );
};

const MintDrawingContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

function getIsMintPassAvailable(userBalance: null | BigNumber): boolean {
  if (userBalance === null) {
    return false;
  }
  return userBalance.gt(0);
}

async function getUsersMintPasses(
  ethAccountAddress: string | null,
  mintPassFactory: null | MintPassFactory
) {
  if (ethAccountAddress === null || mintPassFactory === null) {
    return null;
  }
  // 0 is the default Mint Pass token ID
  const userBalance = await mintPassFactory.balanceOf(ethAccountAddress, 0);
  return userBalance;
}

const blurbBaseCSS = css`
  margin-bottom: 0.5em;
  text-align: center;
`;

const BlurbSpan = styled.span`
  ${blurbBaseCSS}
`;

const CC0LicenseSpaced = styled(CC0License)`
  ${blurbBaseCSS}
`;

const MintButton = styled(Button)`
  background-color: ${colors.purple};

  padding: 0.5em 2em;
  margin-bottom: 0.6em;

  &:hover,
  &.selected {
    background-color: ${colors.darkPurple} !important;
  }
`;
