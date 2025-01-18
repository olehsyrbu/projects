import { generateRelevantOrgUrl } from './generateRelevantOrgUrl';

it('adds next subdomain to host', () => {
  const currentUrl = `https://example.com`;
  const nextSubdomain = 'demorg1';

  const actual = generateRelevantOrgUrl({
    currentUrl,
    nextSubdomain,
  });

  expect(actual).toBe(`https://${nextSubdomain}.example.com/`);
});

it('replaces prev and insert next subdomain to host', () => {
  const nextSubdomain = 'demorg1';
  const prevSubdomain = 'prevOrg1';
  const currentUrl = `https://${prevSubdomain}.example.com`;

  const actual = generateRelevantOrgUrl({
    currentUrl,
    nextSubdomain,
    prevSubdomain,
  });

  expect(actual).toBe(`https://${nextSubdomain}.example.com/`);
});

it('provides pathname if passed', () => {
  const nextSubdomain = 'demorg1';
  const prevSubdomain = 'prevOrg1';
  const currentUrl = `https://${prevSubdomain}.example.com`;
  const pathname = 'some-path/here';

  const actual = generateRelevantOrgUrl({
    currentUrl,
    nextSubdomain,
    prevSubdomain,
    pathname,
  });

  expect(actual).toBe(`https://${nextSubdomain}.example.com/${pathname}`);
});

it('adds query params if token provided', () => {
  const nextSubdomain = 'demorg1';
  const prevSubdomain = 'prevOrg1';
  const currentUrl = `https://${prevSubdomain}.example.com`;
  const pathname = 'some-path/here';
  const token = 'blabalba';

  const actual = generateRelevantOrgUrl({
    currentUrl,
    nextSubdomain,
    prevSubdomain,
    pathname,
    token,
    shouldSkipRedirect: true,
  });

  expect(actual).toBe(
    `https://${nextSubdomain}.example.com/${pathname}?auth_token=${token}&skip_redirect=true`,
  );
});

it('clean subdomain if root org required', () => {
  const nextSubdomain = '';
  const prevSubdomain = 'prevOrg1';
  const currentUrl = `https://${prevSubdomain}.example.com`;

  const actual = generateRelevantOrgUrl({
    currentUrl,
    nextSubdomain,
    prevSubdomain,
  });

  expect(actual).toBe(`https://example.com/`);
});
