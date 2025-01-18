import { ProviderServiceLocation } from './ProviderServiceLocation';
import { screen, render } from '@testing-library/react';

function setupServiceLocation(remote, inPerson) {
  render(
    <ProviderServiceLocation
      provider={{
        remote: { available: remote },
        inPerson: { available: inPerson },
      }}
    />,
  );
}

it('renders Remote or in-person', () => {
  setupServiceLocation(true, true);
  expect(screen.getByText('Remote or in-person')).toBeInTheDocument();
});

it('renders Remote only', () => {
  setupServiceLocation(true, false);
  expect(screen.getByText('Remote only')).toBeInTheDocument();
});

it('renders In-person only', () => {
  setupServiceLocation(false, true);
  expect(screen.getByText('In-person only')).toBeInTheDocument();
});
