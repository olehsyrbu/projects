import {
  getHintBalloonVerticalPosClass,
  getHintBalloonHorizontalPosStyle,
} from './markerPositions';

it('getHintBalloonVerticalPosClass should return hint--bottom', async () => {
  const result = getHintBalloonVerticalPosClass(100);
  expect(result).toBe('hint--bottom');
});

it('getHintBalloonVerticalPosClass should return hint--top', async () => {
  const result = getHintBalloonVerticalPosClass(300);
  expect(result).toBe('hint--top');
});

it('getHintBalloonHorizontalPosStyle set style for top right position', async () => {
  const result = getHintBalloonHorizontalPosStyle(66.5695877740227, 58, 0.25862068965517243, 717);
  const expectResult = { left: '-29.5px', marginLeft: '0px', width: '390px' };
  expect(result).toEqual(expectResult);
});

it('getHintBalloonHorizontalPosStyle set style for top left position', async () => {
  const result = getHintBalloonHorizontalPosStyle(38.8288461606895, 58, 0.25862068965517243, 717);
  const expectResult = { left: '-13.8288461606895px', marginLeft: '0px', width: '390px' };
  expect(result).toEqual(expectResult);
});
