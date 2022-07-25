import React from 'react';
import ReactDOM from 'react-dom';
import { BigNumber } from 'ethers';
import PixelArt from './lib-index';
import beerTemplate from '../../frontend/assets/templates/sample-beer.json';

ReactDOM.render(
  <PixelArt
    mintFn={grid => {
      console.log('Trying to mint.');
      console.log(grid);

      return new Promise(resolve => {
        resolve({
          node: 'Fake success node',
          tokenId: 0,
          shareProps: {
            buttonText: 'Share your Pixly',
            shareText: 'I am sharing my Pixly',
            ariaLabel: 'Share your Pixly',
            hashTags: []
          }
        });
      });
    }}
    ethAccountAddress={null}
    frameConfig={{ columns: 24, rows: 30 }}
    showFrameControls={false}
    showDimensionsUI={false}
    appUrlScheme="http"
    appHost="localhost:3000"
    ethContracts={null}
    templates={[beerTemplate].map(template => ({
      ...template,
      tokenId: BigNumber.from(template.tokenId)
    }))}
  />,
  document.getElementById('app')
);
