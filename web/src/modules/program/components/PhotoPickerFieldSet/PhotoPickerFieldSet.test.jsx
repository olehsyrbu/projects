import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';

import { PhotoPickerFieldSet } from './PhotoPickerFieldSet';
import { useForm } from 'react-hook-form';
import userEvent from '@testing-library/user-event';

function PhotoPickerFieldSetForm({ onSubmit, images = [] }) {
  const form = useForm({ defaultValues: { images } });

  function submitForm({ images }) {
    return onSubmit(images);
  }

  return (
    <Suspense fallback="Loading...">
      <form onSubmit={form.handleSubmit(submitForm)}>
        <PhotoPickerFieldSet name="images" control={form.control} title="Gallery photos" />
        <button className="mir-button primary" type="submit">
          Submit
        </button>
      </form>
    </Suspense>
  );
}

beforeEach(() => {
  let counter = 0;
  window.URL.createObjectURL = vi.fn(() => `blob://${counter++}`);
});

afterEach(() => {
  window.URL.createObjectURL.mockRestore();
});

describe('PhotoPickerFieldSetForm check', () => {
  it('check render PhotoPickerFieldSetForm component without images', async () => {
    render(<PhotoPickerFieldSetForm />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Gallery photos')).toBeInTheDocument();
    expect(
      screen.getByText(/Ideally, uploaded images should have horizontal layout./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Drag up to 6 photos here or/i)).toBeInTheDocument();
  });

  it('check submit PhotoPickerFieldSetForm with images', async () => {
    const submitSpy = vi.fn();

    render(<PhotoPickerFieldSetForm images={['src-1', 'src-2', 'src-3']} onSubmit={submitSpy} />);

    let fileInput = screen.getByTestId('picker-input');
    let file1 = new Blob([], { type: 'image/jpeg' });
    let file2 = new Blob([], { type: 'image/jpeg' });

    await userEvent.upload(fileInput, [file1, file2]);

    expect(submitSpy).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith(['src-1', 'src-2', 'src-3', 'blob://0', 'blob://1']);
    });
  });
});
