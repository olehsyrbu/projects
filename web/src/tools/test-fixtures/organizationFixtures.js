export const organizationFixtures = {
  demoOrganization() {
    return {
      id: 'some-demo-org-id',
      name: 'Demo',
      tag_line: 'demo',
      description: 'demo demo',
      attributes: [
        {
          name: 'color-primary',
          value: '#005eb8',
        },
        {
          name: 'color-text-heading',
          value: '#002855',
        },
        {
          name: 'color-surface',
          value: '#ffffff',
        },
        {
          name: 'logo-url',
          value: 'https://example.com/logo.svg',
        },
      ],
      website: 'http://www.example.com/',
      subdomain: 'demo',
    };
  },

  orgWithoutAttributes() {
    return {
      id: 'some-foo-org-id',
      name: 'Foo',
      tag_line: 'foo',
      description: 'foo foo',
      attributes: [],
      website: 'http://www.foo.com/',
      subdomain: 'foo',
    };
  },

  rootOrg() {
    return {
      mainLogoUrl: 'http://www.example.com',
      orgName: '',
      colors: [],
      subdomain: '',
    };
  },
};
