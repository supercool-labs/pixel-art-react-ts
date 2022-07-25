import Grid from './grid';

describe('Grid test', () => {
  it('convert rgba str to object', () => {
    expect(Grid.strToRGBA('rgba(255, 10, 30, 0.41)')).toStrictEqual({
      r: 255,
      g: 10,
      b: 30,
      a: 0.41
    });
    expect(Grid.strToRGBA('rgba(255,10,30,0.41)')).toStrictEqual({
      r: 255,
      g: 10,
      b: 30,
      a: 0.41
    });

    expect(Grid.strToRGBA('rgba(255, 10, 30, 1)')).toStrictEqual({
      r: 255,
      g: 10,
      b: 30,
      a: 1
    });
    expect(Grid.strToRGBA('rgba(255,10,30,1)')).toStrictEqual({
      r: 255,
      g: 10,
      b: 30,
      a: 1
    });
  });
});
