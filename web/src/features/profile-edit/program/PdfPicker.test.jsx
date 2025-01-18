import { PdfPicker } from './PdfPicker';
import { fireEvent, render, screen } from '@testing-library/react';

it('render PdfPicker should render FilePicker', () => {
  render(<PdfPicker />);
  expect(screen.getByText('Drag and drop a file here or')).toBeInTheDocument();
});

it('render PdfPicker with PDF file', () => {
  render(<PdfPicker file={{ name: '123.pdf' }} />);

  expect(screen.getByText('Selected file:')).toBeInTheDocument();
  expect(screen.getByText('123.pdf')).toBeInTheDocument();
});

it('render PdfPicker add new pdf file', async () => {
  render(<PdfPicker />);

  let fileInput = screen.getByTestId('pdf-picker-input');
  window.URL.createObjectURL = vi.fn().mockImplementation(() => 'url');
  const file = new File(['file'], 'xyz.pdf', {
    type: 'application/pdf',
  });
  Object.defineProperty(fileInput, 'files', {
    value: [file],
  });
  fireEvent.drop(fileInput);
  expect(await screen.findByText('xyz.pdf')).toBeInTheDocument();
});
