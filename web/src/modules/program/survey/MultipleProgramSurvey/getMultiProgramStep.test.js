import { getMultiProgramStep } from './getMultiProgramStep';

describe('getMultiProgramStep', () => {
  it('returns initial step', () => {
    expect(getMultiProgramStep()).toBe(1);
  });

  it('returns locations step', () => {
    expect(getMultiProgramStep({ program: { name: 'xxx' } })).toBe(2);
  });

  it('returns program type step', () => {
    expect(
      getMultiProgramStep(
        {
          program: {
            remote: { available: true },
          },
        },
        false,
      ),
    ).toBe(3);
    expect(
      getMultiProgramStep(
        {
          program: {
            inPerson: { available: true },
            locations: [
              {
                types: [],
              },
            ],
          },
        },
        true,
      ),
    ).toBe(4);
  });

  it('returns photo step for In-person location', () => {
    expect(
      getMultiProgramStep(
        {
          program: {
            inPerson: { available: true },
            locations: [
              {
                types: [{ id: 'x' }],
                photos: [],
              },
            ],
          },
        },
        true,
      ),
    ).toBe(5);
  });

  it('returns the contact step', () => {
    expect(
      getMultiProgramStep(
        {
          types: [{ id: 'x' }],
          program: {
            remote: { available: true },
          },
        },
        false,
      ),
    ).toBe(4);
    expect(
      getMultiProgramStep(
        {
          program: {
            inPerson: { available: true },
            locations: [
              {
                types: [{ id: 'x' }],
                photos: [{ id: 'x' }],
              },
            ],
          },
        },
        true,
      ),
    ).toBe(6);
  });

  it('returns the payment step', () => {
    expect(
      getMultiProgramStep(
        {
          types: [{ id: 'x' }],
          program: {
            remote: { available: true },
            email: '1@xxx.com',
            mobile: 'xxx',
            preferredContacts: ['MOBILE'],
            paymentOptions: [],
          },
        },
        false,
      ),
    ).toBe(5);
    expect(
      getMultiProgramStep(
        {
          program: {
            inPerson: { available: true },
            locations: [
              {
                types: [{ id: 'x' }],
                photos: [{ id: 'x' }],
              },
            ],
            email: '1@xxx.com',
            mobile: 'xxx',
            preferredContacts: ['MOBILE'],
            paymentOptions: [],
          },
        },
        true,
      ),
    ).toBe(7);
  });

  it('returns the license step', () => {
    expect(
      getMultiProgramStep(
        {
          types: [{ id: 'x' }],
          program: {
            remote: { available: true },
            email: '1@xxx.com',
            mobile: 'xxx',
            preferredContacts: ['MOBILE'],
            paymentOptions: [{ id: 'xxx' }],
          },
        },
        false,
      ),
    ).toBe(6);
    expect(
      getMultiProgramStep(
        {
          program: {
            inPerson: { available: true },
            locations: [
              {
                types: [{ id: 'x' }],
                photos: [{ id: 'x' }],
              },
            ],
            email: '1@xxx.com',
            mobile: 'xxx',
            preferredContacts: ['MOBILE'],
            paymentOptions: [{ id: 'xxx' }],
          },
        },
        true,
      ),
    ).toBe(8);
  });

  it('returns final step', () => {
    expect(
      getMultiProgramStep(
        {
          types: [{ id: 'x' }],
          program: {
            remote: { available: true },
            email: '1@xxx.com',
            mobile: 'xxx',
            preferredContacts: ['MOBILE'],
            paymentOptions: [{ id: 'xxx' }],
            accreditations: [{ id: 'xxx' }],
          },
        },
        false,
      ),
    ).toBe(7);
    expect(
      getMultiProgramStep(
        {
          program: {
            inPerson: { available: true },
            locations: [
              {
                types: [{ id: 'x' }],
                photos: [{ id: 'x' }],
              },
            ],
            email: '1@xxx.com',
            mobile: 'xxx',
            preferredContacts: ['MOBILE'],
            paymentOptions: [{ id: 'xxx' }],
            accreditations: [{ id: 'xxx' }],
          },
        },
        true,
      ),
    ).toBe(9);
  });
});
