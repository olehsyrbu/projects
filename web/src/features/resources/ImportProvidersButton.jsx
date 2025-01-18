import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { importProviders } from '@/core/api/ProviderAPI';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, Radio } from '@/core/components';
import { useMatchMedia } from '@/core/hooks';
import {
  DismissCircle20Filled as DismissCircle,
  DocumentAdd24Regular as DocumentAdd,
  Warning16Regular as Warning,
} from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import { Select } from '@/core/components/Select';
import { LoadingDialog } from './LoadingDialog';

export function ImportProvidersButton({ path, onSuccessClose }) {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importResults, setImportResults] = useState(null);

  function handleImportProviders(response) {
    setIsImportDialogOpen(false);
    setImportResults(response);
  }

  function handleCloseResults() {
    setImportResults(null);
    onSuccessClose();
  }

  return (
    <>
      <button className="mir-button w-full md:w-fit" onClick={() => setIsImportDialogOpen(true)}>
        Import providers
      </button>
      {isImportDialogOpen && (
        <DialogShowPopupImportFile
          onClose={() => setIsImportDialogOpen(false)}
          onSubmit={handleImportProviders}
        />
      )}
      {importResults && (
        <DialogOfImportResults path={path} onClose={handleCloseResults} {...importResults} />
      )}
    </>
  );
}

ImportProvidersButton.propTypes = {
  onSuccessClose: PropTypes.func,
  path: PropTypes.string,
};

ImportProvidersButton.defaultProps = {
  onSuccessClose: () => {},
  path: '/resources/report',
};

function DialogShowPopupImportFile({ onClose, onSubmit }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [formatFile, setFormatFile] = useState();
  const [isImportingProviders, setIsImportingProviders] = useState(false);

  async function handleImportProvidersFile() {
    try {
      if (file) {
        setIsImportingProviders(true);
        const results = await importProviders({
          file,
          adapter: formatFile?.value === 'AETNA' ? formatFile.value : undefined,
        });
        setIsImportingProviders(false);
        onSubmit(results);
      }
    } catch (e) {
      setError(e);
    }
  }

  function handleFormatFileChange(value) {
    setFormatFile(value);
  }
  function handleAccept(file) {
    setFile(file);
    setError(false);
  }

  function handleRemoveFile() {
    setFile(null);
    setError(false);
  }

  if (isImportingProviders) {
    return <LoadingDialog text="We are importing providers" />;
  }

  return (
    <Dialog isOpen={true} onDismiss={onClose} width={550}>
      <DialogTitle>Import providers</DialogTitle>
      <DialogContent>
        <div className="space-y-3">
          <p className="font-bold ">Choose the right file format for your data:</p>
          <FormatFileSelect onChange={handleFormatFileChange} value={formatFile} />
          <FileImport
            onAccept={handleAccept}
            onRemoveFile={handleRemoveFile}
            onReject={() => setError(true)}
            file={file}
          />
          {error && (
            <Alert
              iconClassesName="!items-start"
              className="bg-warning-3 px-4 py-2"
              text="Something went wrong, please check the file size and file format and try again."
              icon={<Warning />}
            />
          )}
          <p className="text-sm text-hint">
            Uploaded file must be less than 10MB and in the selected format above.
          </p>
          <p className="!mt-8 font-bold">Data handling options:</p>
          <div className="flex flex-col md:space-y-4">
            <Radio name="tab" value="override">
              Overwrite existing data
            </Radio>
            <Radio name="tab" value="skip" defaultChecked>
              Skip existing fields
            </Radio>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button
          type="submit"
          className="mir-button primary"
          disabled={!file}
          onClick={handleImportProvidersFile}
        >
          Import profiles
        </button>
        <button className="mir-button" onClick={onClose}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}

DialogShowPopupImportFile.propTypes = {
  error: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

function FormatFileSelect({ onChange, value }) {
  const options = [
    { value: 'JSONL', label: 'MiResourse format' },
    { value: 'AETNA', label: 'Aetna format' },
  ];
  return (
    <Select label="File format" options={options} onChange={onChange} value={value || options[0]} />
  );
}
FormatFileSelect.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.object,
};

function FileImport({ file, onAccept, onReject, onRemoveFile }) {
  const isMobile = useMatchMedia('(max-width: 767px)');
  const dropzone = useDropzone({
    maxSize: 10_000_000,
    accept: ['.jsonl', '.csv'],
    maxFiles: 1,
    multiple: false,
    noClick: true,
    onDropAccepted: ([file]) => onAccept(file),
    onDropRejected: (e) => onReject(e),
  });

  return (
    <div className={`!mt-6 grid rounded-lg bg-p-10 py-6 `} {...dropzone.getRootProps()}>
      <input {...dropzone.getInputProps()} />
      {file ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="flex space-x-4 whitespace-pre-wrap">
            <b>Selected file: </b>
            {file.name}
            <button className="mir-button link" onClick={onRemoveFile}>
              <DismissCircle />
            </button>
          </p>
          <p className="flex whitespace-pre-wrap">
            Wrong file?{' '}
            <button className="mir-button link" onClick={dropzone.open}>
              Reupload it.
            </button>
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center md:space-x-4">
          {!isMobile && <DocumentAdd className="text-p-75" />}
          {!isMobile && <p>Drag and drop or</p>}
          <button className="mir-button compact" onClick={dropzone.open}>
            Browse Your Files
          </button>
        </div>
      )}
    </div>
  );
}

FileImport.propTypes = {
  file: PropTypes.func,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  onRemoveFile: PropTypes.func,
};

function DialogOfImportResults({ onClose, succeeded, failed, errors, path }) {
  return (
    <Dialog isOpen={true} onDismiss={onClose} width={550}>
      <DialogTitle>Profiles have been imported!</DialogTitle>
      <DialogContent>
        <p>Generated {succeeded} profiles.</p>
        <p>Failed to generate {failed} profiles.</p>
        <Link
          className="font-bold"
          state={{
            importReport: true,
            succeeded,
            failed,
            errors,
          }}
          to={path}
        >
          See detailed report page
        </Link>
      </DialogContent>
      <DialogActions>
        <button type="submit" className="mir-button primary" onClick={onClose}>
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
}

DialogOfImportResults.propTypes = {
  succeeded: PropTypes.number,
  failed: PropTypes.number,
  onClose: PropTypes.func,
  errors: PropTypes.array,
  path: PropTypes.string,
};
