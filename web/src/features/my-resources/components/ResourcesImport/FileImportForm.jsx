import { useDropzone } from 'react-dropzone';
import cn from 'classnames';
import config from '@/core/config';
import {
  ShareIos48Filled as ShareIos,
  DismissCircle20Filled as DismissCircle,
} from '@fluentui/react-icons';
import cx from './FileImportForm.module.css';
import PropTypes from 'prop-types';

let apiUrl = new URL(config.api.baseUrl);
let templateUrl = `${apiUrl.origin}/sample/invitation`;

export function FileImportForm({ isMobile, disabled, onChange, onSubmit, file }) {
  let dropzone = useDropzone({
    accept: '.xlsx',
    maxFiles: 1,
    multiple: false,
    noClick: true,
    disabled,
    onDrop: ([file]) => onChange(file),
  });

  const handleClearFile = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className={cn(cx.dropzone, { [cx.noFile]: !file })} {...dropzone.getRootProps()}>
      <input {...dropzone.getInputProps()} />
      {file ? (
        <>
          <p>
            <b>Selected file: </b>
            {file.name}
            <button className="mir-button link" onClick={handleClearFile}>
              <DismissCircle />
            </button>
          </p>
          {!isMobile && (
            <button className="mir-button primary" onClick={onSubmit}>
              Import resources
            </button>
          )}
          <p>
            Wrong file?{' '}
            <button className="mir-button link" onClick={dropzone.open}>
              Reupload it.
            </button>
          </p>
        </>
      ) : (
        <>
          {!isMobile && <ShareIos className={cx.shareIcon} />}
          {!isMobile && <p>Drag your XLSX file here or</p>}

          <button className="mir-button compact" onClick={dropzone.open}>
            Browse your files
          </button>
          <p>
            Don’t have an XLSX?{' '}
            <a href={templateUrl} download>
              Download our template.
            </a>
          </p>
        </>
      )}
    </div>
  );
}

FileImportForm.propTypes = {
  isMobile: PropTypes.bool,
  disabled: PropTypes.bool,
  file: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};
