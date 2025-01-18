import { ImagePicker } from './ImagePicker';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  let counter = 0;
  window.URL.createObjectURL = vi.fn(() => `blob://${counter++}`);
});

afterEach(() => {
  window.URL.createObjectURL.mockRestore();
});

it('renders provided images', () => {
  render(<ImagePicker images={['src-1', 'src-2', 'src-3']} onChange={() => {}} />);
  let images = screen.getAllByAltText('');
  let fileInput = screen.getByTestId('picker-input');
  expect(images).toHaveLength(3);
  expect(fileInput).toBeInTheDocument();
});

it("doesn't render file picker when image count equals 6", () => {
  render(<ImagePicker images={['1', '2', '3', '4', '5', '6']} onChange={() => {}} />);
  let fileInput = screen.queryByTestId('picker-input');
  expect(fileInput).not.toBeInTheDocument();
});

it('adds new images by file input', async () => {
  let onChangeFn = vi.fn();

  render(<ImagePicker images={['src-1', 'src-2']} onChange={onChangeFn} />);

  let fileInput = screen.getByTestId('picker-input');
  let file1 = new Blob([], { type: 'image/jpeg' });
  let file2 = new Blob([], { type: 'image/jpeg' });

  await userEvent.upload(fileInput, [file1, file2]);

  expect(onChangeFn).toHaveBeenCalledWith(['src-1', 'src-2', 'blob://0', 'blob://1']);
});

it('removes images by button click', async () => {
  let onChangeFn = vi.fn();

  render(<ImagePicker images={['src-1', 'src-2', 'src-3']} onChange={onChangeFn} />);

  let buttons = screen.getAllByRole('button', { name: 'Delete image' });

  await userEvent.click(buttons[1]);

  expect(onChangeFn).toHaveBeenCalledWith(['src-1', 'src-3']);
});
