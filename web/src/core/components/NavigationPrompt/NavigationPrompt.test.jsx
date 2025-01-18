import { NavigationPrompt } from './NavigationPrompt';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockResolve = vi.fn();
const mockUseBlockerResults = {
  blocked: true,
  resolve: mockResolve,
};

vi.mock('@/core/router', () => ({
  useBlocker: () => [mockUseBlockerResults.blocked, mockUseBlockerResults.resolve],
}));

afterEach(() => mockResolve.mockClear());

describe.skip('check prompt dialog', () => {
  it('check render NavigationPromptMock with default props', () => {
    render(<NavigationPrompt when={true} />);
    expect(screen.getByTestId('dialog-content')).toHaveTextContent('');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('');
    let buttons = screen.getAllByRole('button');

    expect(buttons[1]).toHaveTextContent('Stay on the page');
    expect(buttons[2]).toHaveTextContent('Leave the page');
  });

  it('check render NavigationPromptMock with custom props', () => {
    render(
      <NavigationPrompt
        when={true}
        message="message text custom"
        title="title prompt"
        options={['ok', 'cancel']}
      />,
    );
    expect(screen.getByTestId('dialog-content')).toHaveTextContent('message text custom');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('title prompt');
    let buttons = screen.getAllByRole('button');

    expect(buttons[1]).toHaveTextContent('ok');
    expect(buttons[2]).toHaveTextContent('cancel');
  });

  it('check NavigationPrompt onDismiss handler call with false', () => {
    render(<NavigationPrompt when={true} message="text message" />);
    fireEvent.click(screen.getByLabelText(/Close dialog/i));
    expect(mockUseBlockerResults.resolve).toHaveBeenCalledTimes(1);
    expect(mockUseBlockerResults.resolve).toHaveBeenCalledWith(false);
  });

  it('check NavigationPrompt Leave the page handler call', () => {
    render(<NavigationPrompt when={true} message="text message" />);

    fireEvent.click(screen.getByRole('button', { name: 'Leave the page' }));
    expect(mockUseBlockerResults.resolve).toHaveBeenCalledTimes(1);
    expect(mockUseBlockerResults.resolve).toHaveBeenCalledWith(true);
  });

  it('check NavigationPrompt leave Stay on the page call with false', () => {
    render(<NavigationPrompt when={true} message="text message" />);
    fireEvent.click(screen.getByRole('button', { name: 'Stay on the page' }));
    expect(mockUseBlockerResults.resolve).toHaveBeenCalledTimes(1);
    expect(mockUseBlockerResults.resolve).toHaveBeenCalledWith(false);
  });

  it('show prompt on change url', async () => {
    render(<NavigationPrompt when={true} message="text message" />);

    // await act(async () => {
    //   history.push('/one');
    // });

    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toHaveTextContent('text message');
    });
  });
});
