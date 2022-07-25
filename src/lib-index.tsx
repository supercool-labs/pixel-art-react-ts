import React, { useState, useEffect } from 'react';
import {
  PixlyNFTv7 as PixlyNFT,
  MintPassFactory,
  TraitBagsV1 as TraitBags
} from '../typechain';
import './css/imports.css'; // Import PostCSS files
import configureStore from './store/configureStore';
import { EthContextProvider } from './contexts/ethContext';
import Root from './components/Root';
import * as actionTypes from './store/actions/actionTypes';
import * as actionCreators from './store/actions/actionCreators';
import { MintFn } from './types';

export type { TemplateData } from './store/actions/actionTypes';
export type { RGBA, RGBAGrid } from './utils/grid';
export type { MintFn, SetMintState, MintResult } from './types';

export interface EthContracts {
  pixlyNFT: PixlyNFT;
  mintPassFactory: MintPassFactory | null;
  traitBags: TraitBags | null;
}

export interface PixelArtProps {
  frameConfig?: {
    rows: number;
    columns: number;
  };
  mintFn: MintFn;
  showFrameControls: boolean;
  showDimensionsUI: boolean;
  appUrlScheme: string;
  appHost: string;
  ethAccountAddress: string | null;
  ethContracts: EthContracts | null;
  templates: actionTypes.TemplateData[];
}

export default function PixelArt({
  showFrameControls,
  showDimensionsUI,
  appUrlScheme,
  appHost,
  ethAccountAddress,
  ethContracts,
  mintFn,
  frameConfig,
  templates
}: PixelArtProps): JSX.Element {
  const [showEditor, setShowEditor] = useState(false);
  useEffect(() => {
    setShowEditor(true);
  }, []);

  if (!showEditor) {
    return <div>Loading...</div>;
  }
  return (
    <PixelArtApp
      mintFn={mintFn}
      ethAccountAddress={ethAccountAddress}
      ethContracts={ethContracts}
      showFrameControls={
        showFrameControls === undefined ? true : showFrameControls
      }
      showDimensionsUI={
        showDimensionsUI === undefined ? true : showDimensionsUI
      }
      appUrlScheme={appUrlScheme}
      appHost={appHost}
      frameConfig={frameConfig}
      templates={templates}
    />
  );
}

// In case this code is pre-rendered by a server, it's simpler for us to have a
// component that only gets rendered in the browser. Then we don't need to
// worry about if all of the code is Node.js compatible because it can be gated
// behind `useEffect`.
function PixelArtApp({
  showFrameControls,
  showDimensionsUI,
  appUrlScheme,
  appHost,
  ethAccountAddress,
  ethContracts,
  mintFn,
  frameConfig,
  templates
}: PixelArtProps) {
  const devMode = process.env.NODE_ENV === 'development';
  const store = configureStore({ devMode });
  useEffect(() => {
    if (frameConfig) {
      const frameInitAction = actionCreators.newProject({
        columns: frameConfig.columns,
        rows: frameConfig.rows,
        showFrameControls,
        showDimensionsUI,
        appUrlScheme,
        appHost,
        templates
      });
      store.dispatch(frameInitAction);
    }
    const setEthAction = actionCreators.setEth(ethAccountAddress, ethContracts);
    store.dispatch(setEthAction);
  }, [
    frameConfig,
    showFrameControls,
    showDimensionsUI,
    appUrlScheme,
    appHost,
    store,
    ethAccountAddress,
    ethContracts,
    templates
  ]);

  return (
    <EthContextProvider mintFn={mintFn}>
      <Root store={store} />
    </EthContextProvider>
  );
}
