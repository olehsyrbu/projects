import { TabLink, TabNav, TabNavPanel, TabRoute } from '../TabNav';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { defineMatchMediaGlobally } from '@/tools/app-test-utils/matchMediaMock';

function Test() {
  return (
    <MemoryRouter>
      <TabNav>
        <TabNavPanel heading="Tabs">
          <TabLink to="tab1">Tab 1 link</TabLink>
          <TabLink to="tab2">Tab 2 link</TabLink>
        </TabNavPanel>

        <TabRoute path="tab1" heading="Tab 1">
          Tab 1 content
        </TabRoute>

        <TabRoute path="tab2" heading="Tab 2">
          Tab 2 content
        </TabRoute>

        <TabRoute path="tab3" heading="Tab 3">
          Tab 3 content
        </TabRoute>
      </TabNav>
    </MemoryRouter>
  );
}

describe('check TabNav desktop', () => {
  it('render at the first tab content', async () => {
    defineMatchMediaGlobally(true);
    render(<Test />);

    expect(screen.getByText(/Tabs/i)).toBeInTheDocument();
    expect(screen.getByText(/Tab 1 link/i)).toBeInTheDocument();
    expect(screen.getByText(/Tab 2 link/i)).toBeInTheDocument();

    expect(screen.getByText(/Tab 1 content/i)).toBeInTheDocument();
  });

  it('redirects to /tab2 and renders proper content', async () => {
    defineMatchMediaGlobally(true);

    render(<Test />);

    let nextButton = screen.getByRole('link', { name: /Tab 2 link/i });
    await userEvent.click(nextButton);

    expect(screen.getByText(/Tab 2 content/i)).toBeInTheDocument();
    expect(screen.queryByText(/Tab 1 content/i)).not.toBeInTheDocument();
  });
});

describe('check TabNav mobile', () => {
  it('location pathname equal /', async () => {
    defineMatchMediaGlobally(false);
    render(<Test />);

    expect(screen.getByText(/Tabs/i)).toBeInTheDocument();
    expect(screen.getByText(/Tab 1 link/i)).toBeInTheDocument();
    expect(screen.getByText(/Tab 2 link/i)).toBeInTheDocument();

    expect(screen.queryByText(/Tab 1 content/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tab 2 content/i)).not.toBeInTheDocument();
  });

  it('redirects to /tab2 and renders proper content', async () => {
    defineMatchMediaGlobally(false);

    render(<Test />);

    let nextButton = screen.getByRole('link', { name: /Tab 2 link/i });
    await userEvent.click(nextButton);

    expect(screen.getByText(/Tab 2 content/i)).toBeInTheDocument();
    expect(screen.queryByText(/Tab 1 content/i)).not.toBeInTheDocument();
  });
});
