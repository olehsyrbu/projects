import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import cn from 'classnames';
import {
  DismissCircle20Filled as DismissCircle,
  DocumentAdd24Regular as DocumentAdd,
} from '@fluentui/react-icons';

export function PdfPicker({ file, onChange, onReject }) {
  const [pdfFile, setPdf] = useState(file);
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: 'application/pdf',
    maxFiles: 1,
    maxSize: 8_000_000,
    multiple: false,
    noClick: true,
    onDropAccepted: ([file]) => {
      setPdf(file);
      onChange(file);
    },
    onDropRejected: () => onReject(),
  });

  const className = cn(
    'max-w-lg flex flex-col md:flex-row gap-4 p-7 justify-center items-center min-h-40 bg-graphics-10 rounded-2xl',
    {
      '!flex-col': pdfFile,
    },
  );

  return (
    <div className={className} {...getRootProps()}>
      <input {...getInputProps()} data-testid="pdf-picker-input" />

      {pdfFile?.name ? (
        <>
          <div className="flex min-w-0 max-w-full items-center space-x-1">
            <span className="flex flex-col items-center md:flex-row">
              <b>Selected file:</b>
              <span className="w-60 truncate">{pdfFile.name}</span>
            </span>
            <button
              type="button"
              className="m-0 flex-none cursor-pointer border-none bg-transparent p-0 leading-[0]"
              onClick={() => {
                setPdf(null);
                onChange(null);
              }}
            >
              <DismissCircle className="text-p-100" />
            </button>
          </div>
          <p>
            Wrong file?{' '}
            <button type="button" className="mir-button link" onClick={open}>
              Upload again
            </button>
          </p>
        </>
      ) : (
        <>
          <DocumentAdd className="text-graphics-50" />
          <p className="leading-relaxed text-hint">Drag and drop a file here or</p>
          <button type="button" className="mir-button compact" onClick={open}>
            Browse Your Files
          </button>
        </>
      )}
    </div>
  );
}

PdfPicker.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
  }),
  onChange: PropTypes.func,
  onReject: PropTypes.func,
};
PdfPicker.defaultProps = {
  file: null,
  onChange: () => {},
  onReject: () => {},
};
