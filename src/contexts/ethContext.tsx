import React, { useContext, createContext } from 'react';
import { MintFn } from '../types';

type MaybeContext = null | { mintFn: MintFn };
type Context = { mintFn: MintFn };

const EthContext = createContext<MaybeContext>(null);

/**
 * Add an ethContext React context and some scaffolding code such that the
 * `PixelArt` component exposes some injection sites for functions that
 * interact with the Ethereum chain. The `EthContextProvider` takes a
 * function with the following signature:
 *
 * ```
 * interface RGBA {
 *     // r, g, and b are integers between [0, 255]
 *     r: number,
 *     g: number,
 *     b: number,
 *
 *     // a is a float in [0, 1]
 *     a: number
 * }
 *
 * // grid is a 2D grid, so each inner array must be the same length
 * // name is the name of the item being minted
 * (grid: Array<Array<RGBA>>, name: string): Promise<React.ReactNode>
 * ```
 *
 * If it succeeds, the call should return a React.ReactNode which can be
 * rendered how the UI chooses. If it fails, an exception will be raised.
 */
function EthContextProvider({
  mintFn,
  children
}: {
  mintFn: MintFn;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <EthContext.Provider value={{ mintFn }}>{children}</EthContext.Provider>
  );
}

function useEthContext(): Context {
  const context = useContext(EthContext);
  if (context === null) {
    throw new Error('context is not initialized. Use EthContextProvider');
  }
  return context;
}

export { EthContextProvider, useEthContext };
