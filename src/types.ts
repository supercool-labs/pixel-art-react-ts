import { BigNumber } from 'ethers';
import { mintsuccess } from '@supercool/ui-components';
import { RGBAGrid } from './utils/grid';

// If minting suceeds, the call should return a React.ReactNode that will be
// rendered in the pixel-art-react UI. If minting fails, an exception should
// be thrown.
export type MintFn = (
  setMintState: SetMintState,
  grid: RGBAGrid,
  name: string,
  // SCMP is the Supercool Mint Pass
  mintWithCurrency: 'MATIC' | 'SCMP',
  templateTokenId?: BigNumber
) => Promise<MintResult>;

export type MintResult = {
  node: React.ReactNode;
  tokenId: number;
  shareProps: mintsuccess.ShareProps;
};

export type SetMintStateArgs =
  | SetPreMintStateArgs
  | SetMintFailureStateArgs
  | SetMintPendingStateArgs;

export type SetMintState = React.Dispatch<
  React.SetStateAction<SetMintStateArgs>
>;

export type MintStates = 'PRE_MINT' | 'MINT_FAILURE' | 'MINT_PENDING';

export interface SetPreMintStateArgs {
  mintState: 'PRE_MINT';
  mintArgs: { [k: string]: never };
}

export interface SetMintFailureStateArgs {
  mintState: 'MINT_FAILURE';
  mintArgs: { [k: string]: never };
}

export interface SetMintPendingStateArgs {
  mintState: 'MINT_PENDING';
  mintArgs: { [k: string]: never };
}
