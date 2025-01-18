import { programDraftAdapter } from './programDraftAdapter';

it('converts create payload', () => {
  const createPayload = {
    center: 'center name',
    tagLine: 'some tag line',
  };

  expect(programDraftAdapter.toCreateInput(createPayload)).toEqual({
    center_name: createPayload.center,
    tag_line: createPayload.tagLine,
  });
});
