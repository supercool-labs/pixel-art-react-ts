import React from 'react';
import { SVG } from '@supercool/ui-components';
import polygonLogo from '../../assets/polygon-matic-logo.svg';

export default function PolygonLogo({
  alt,
  width = undefined,
  height = undefined
}) {
  return <SVG src={polygonLogo} width={width} height={height} alt={alt} />;
}
