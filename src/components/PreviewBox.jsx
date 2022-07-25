import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import Preview from './Preview';

const PreviewBox = props => {
  const [animate, setAnimate] = useState(false);
  const [isNormalSize, setNormalSize] = useState(true);
  const frames = useSelector(state => state.present.get('frames'));
  const duration = useSelector(state => state.present.get('duration'));
  const showFrameControls = useSelector(state =>
    state.present.get('options').get('showFrameControls')
  );
  const frameList = frames.get('list');
  const activeFrameIndex = frames.get('activeIndex');
  const columns = frames.get('columns');
  const rows = frames.get('rows');
  const { helpOn, callback } = props;
  const animMessage = `${animate ? 'Pause' : 'Play'} the animation`;
  const zoomMessage = `Zoom ${isNormalSize ? '0.5' : '1.5'}`;
  const animTooltip = helpOn ? animMessage : null;
  const zoomTooltip = helpOn ? zoomMessage : null;
  const smPixelSize = 3;
  const bgPixelSize = 6;

  return (
    <div className="preview-box">
      {showFrameControls ? (
        <FrameControls
          animTooltip={animTooltip}
          animate={animate}
          setAnimate={setAnimate}
          zoomTooltip={zoomTooltip}
          isNormalSize={isNormalSize}
          setNormalSize={setNormalSize}
          callback={callback}
          helpOn={helpOn}
        />
      ) : null}
      <PreviewBoxContainer>
        <Preview
          frames={frameList}
          columns={columns}
          rows={rows}
          cellSize={isNormalSize ? bgPixelSize : smPixelSize}
          duration={duration}
          activeFrameIndex={activeFrameIndex}
          animate={animate}
          animationName="wip-animation"
        />
      </PreviewBoxContainer>
    </div>
  );
};

const PreviewBoxContainer = styled.div`
  // padding: 0.8em 0 0.8em 0;
  margin: 0.8em 0;
  border: solid 1px white;

  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`;

function FrameControls({
  animTooltip,
  animate,
  setAnimate,
  zoomTooltip,
  isNormalSize,
  setNormalSize,
  callback,
  helpOn
}) {
  return (
    <div className="buttons">
      <div data-tooltip={animTooltip}>
        <button
          type="button"
          className={animate ? 'pause' : 'play'}
          onClick={() => setAnimate(!animate)}
          aria-label="Animation control"
        />
      </div>
      <div data-tooltip={zoomTooltip}>
        <button
          type="button"
          className={isNormalSize ? 'screen-normal' : 'screen-full'}
          aria-label="Zoom button"
          onClick={() => {
            setNormalSize(!isNormalSize);
          }}
        />
      </div>
      <div data-tooltip={helpOn ? 'Show a preview of your project' : null}>
        <button
          type="button"
          className="frames"
          aria-label="Active modal"
          onClick={callback}
        />
      </div>
    </div>
  );
}

export default PreviewBox;
