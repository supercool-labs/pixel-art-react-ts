import React from 'react';

import { CustomPicker } from 'react-color';
import {
  EditableInput,
  Hue,
  Saturation
} from 'react-color/lib/components/common';
import * as color from 'react-color/lib/helpers/color';

const PixlyPointerCircleSmall = () => (
  <div
    style={{
      width: '15px',
      height: '15px',
      borderRadius: '50%',
      borderWidth: '4px',
      boxShadow: 'inset 0 0 0 4px #fff',
      transform: 'translate(-3px, -3px)'
    }}
  />
);

const MyPicker = ({ hex, hsl, hsv, rgb, onChange }) => {
  const styles = {
    head: {
      height: '57px',
      width: '100%',
      paddingTop: '16px',
      paddingBottom: '16px',
      paddingLeft: '16px',
      fontSize: '20px',
      boxSizing: 'border-box',
      fontFamily: 'Roboto-Regular,HelveticaNeue,Arial,sans-serif'
    },
    saturation: {
      width: '300px',
      height: '200px',
      padding: '0px',
      position: 'relative',
      marginBottom: '20px'
    },
    alpha: {
      radius: '2px'
    },
    hue: {
      height: '10px',
      position: 'relative',
      marginBottom: '20px'
    },
    Hue: {
      radius: '4px'
    },
    input: {
      border: '0px',
      color: 'white',
      background: 'none',
      maxWidth: '70px'
    },
    altInput: {
      border: '0px',
      color: 'white',
      background: 'none',
      maxWidth: '40px',
      textAlign: 'center'
    },
    container: {
      padding: '10px',
      background: '#000000'
    },
    indicator: {
      display: 'flex',
      flex: 1,
      maxWidth: '50px',
      color: 'white',
      alignItems: 'center',
      fontWeight: 700
    },
    grouped: {
      marginTop: '20px',
      display: 'flex'
    },
    swatch: {
      width: '30px',
      height: '30px',
      borderRadius: '4px',
      background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      position: 'relative',
      overflow: 'hidden',
      marginRight: '10px'
    },
    swatchOverlay: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1E1E1E',
      height: '30px',
      borderRadius: '4px',
      marginRight: '20px'
    },
    swatchOverlayAlt: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '30px',
      borderRadius: '4px',
      marginRight: '20px'
    },
    colorWrap: {
      backgroundColor: '#1E1E1E',
      height: '30px',
      marginRight: '10px',
      display: 'flex',
      alignItems: 'center'
    }
  };

  const handleChange = (data, e) => {
    // Extracted from react-color package
    if (data['#']) {
      if (color.isValidHex(data['#'])) {
        onChange(
          {
            hex: data['#'],
            source: 'hex'
          },
          e
        );
      }
    } else if (data.r || data.g || data.b) {
      onChange(
        {
          r: data.r || rgb.r,
          g: data.g || rgb.g,
          b: data.b || rgb.b,
          source: 'rgb'
        },
        e
      );
    } else if (data.h || data.s || data.v) {
      onChange(
        {
          h: data.h || hsv.h,
          s: data.s || hsv.s,
          v: data.v || hsv.v,
          source: 'hsv'
        },
        e
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.saturation}>
        <Saturation hsl={hsl} hsv={hsv} onChange={onChange} />
      </div>
      <div style={styles.hue}>
        <Hue
          hsl={hsl}
          onChange={onChange}
          style={styles.Hue}
          pointer={PixlyPointerCircleSmall}
        />
      </div>
      <div style={styles.grouped}>
        <div style={styles.indicator}>Hex</div>
        <div style={styles.swatchOverlay}>
          <div style={styles.swatch} />
          <EditableInput
            label="#"
            style={{ input: styles.input }}
            value={hex}
            onChange={handleChange}
          />
        </div>
      </div>
      <div style={styles.grouped}>
        <div style={styles.indicator}>RGB</div>
        <div style={styles.swatchOverlayAlt}>
          <div style={styles.colorWrap}>
            <EditableInput
              style={{ input: styles.altInput }}
              label="r"
              value={rgb.r}
              onChange={handleChange}
            />
          </div>
          <div style={styles.colorWrap}>
            <EditableInput
              style={{ input: styles.altInput }}
              label="g"
              value={rgb.g}
              onChange={handleChange}
            />
          </div>
          <div style={styles.colorWrap}>
            <EditableInput
              style={{ input: styles.altInput }}
              label="b"
              value={rgb.b}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default new CustomPicker(MyPicker); // @ts-expect-error Handle this
