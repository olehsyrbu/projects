import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import CloseIcon from '@/images/Shared/CloseIcon.svg';
import UploadIcon from '@/images/Shared/FileUpload.svg';
import 'react-image-crop/dist/ReactCrop.css';
import './PhotoUpload.css';
import PropTypes from 'prop-types';

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
}

function PhotoUpload({
  photoFileLocator,
  uploadHandler,
  invalid,
  errorMessage,
  buttonOnly,
  textPhoto,
  textCrop,
  initialState,
  title,
  croppedImageStyles,
}) {
  const imgURL = photoFileLocator || '';
  const initialCrop = {
    unit: '%',
    width: 50,
    x: 25,
    aspect: 1,
  };

  const [state, setState] = useState(initialState);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState(initialCrop);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageCropped = useRef(false);
  const cropping = useRef(false);
  const uploadButtonRef = useRef();
  const changePhotoButtonRef = useRef();

  const [uploading, setUploading] = useState(false);

  const onSelectFile = (e) => {
    if (!e.target.files[0]) {
      return;
    }

    imageCropped.current = false;
    handleDisplayCroppedPreview();

    let inputValue = e.target.value;
    let filePath = URL.createObjectURL(e.target.files[0]);

    e.target.value = '';

    setState({
      inputValue,
      filePath,
    });
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const generateDownload = (canvas, crop) => {
    if (!crop || !canvas) {
      return;
    }
    if (canvas.toBlob) {
      canvas.toBlob(
        async (blob) => {
          setUploading(true);

          await uploadHandler(blob);

          imageCropped.current = true;
          handleDisplayCroppedPreview();
          setUploading(false);
        },
        'image/jpeg',
        0.8,
      );
    }
  };

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    setTimeout(() => {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );
    }, 200);
  }, [completedCrop]);

  useEffect(() => {
    if (imageCropped.current) {
      imageCropped.current = false;
      setState({ ...initialState });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState, imageCropped.current]);

  const handleDisplayCroppedPreview = () => {
    cropping.current = !cropping.current;
    let nextState = { ...state };
    nextState.inputValue = '';
    setState(nextState);
    setCrop({ ...initialCrop });
  };

  const handleKeyDown = (e) => {
    let input = e.target;
    let key = e.keyCode;

    if (key === 13) {
      e.preventDefault();
      input.click();
    }
  };

  const desktopUpload = (
    <>
      <div className="image-upload-container">
        {title ? title : <h2 className="font-bold">Profile photo</h2>}
        <input
          type="file"
          id="photoUpload"
          onChange={onSelectFile}
          name="photoUpload"
          accept="image/gif, image/jpeg, image/png"
        />
        <div
          aria-hidden
          tabIndex="0"
          // htmlFor="photoUpload"
          role="button"
          className="image-upload-content"
          onKeyDown={handleKeyDown}
        >
          <img src={UploadIcon} alt="" />
          <h2>{textPhoto}</h2>
          <span>Browse Your Files</span>
          <p>
            Ideally, uploaded images should have a 1:1 width to height ratio. Uploaded images must
            be less than 8MB and in the PNG or JPG format.
          </p>
        </div>
      </div>
      {invalid !== undefined && invalid === true && (
        <span className="error-message" role="alert">
          {errorMessage}
        </span>
      )}
    </>
  );

  const mobileUpload = (
    <div className="image-upload-container-mobile">
      {title ? title : <h2 className="mb-3 font-bold">Profile photo</h2>}
      <input
        type="file"
        id="photoUploadMobile"
        onChange={onSelectFile}
        name="photoUpload"
        ref={uploadButtonRef}
      />
      <button
        className="mir-button mobile-upload-button"
        onClick={() => uploadButtonRef.current.click()}
      >
        Upload Photo
      </button>
      <p className="photo-upload-helper-text">
        Ideally, uploaded images should have a 1:1 width to height ratio. Uploaded images must be
        less than 8MB and in the PNG or JPG format.
      </p>
      {invalid !== undefined && invalid === true && (
        <span className="error-message" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );

  const { filePath } = state;

  return (
    <div id="photoContainer">
      {photoFileLocator === null &&
        imageCropped.current === false &&
        ((buttonOnly !== undefined && buttonOnly === true) || isMobile() === true
          ? mobileUpload
          : desktopUpload)}
      {cropping.current === true && (
        <div>
          <div
            aria-hidden="true"
            role="button"
            id="imageCropperOverlay"
            onClick={() => {
              if (uploading === false) {
                imageCropped.current = false;
                handleDisplayCroppedPreview();
              }
            }}
          />

          <div id="imageCropper">
            <div className="modal-header row justify-between">
              <h2>{textCrop}</h2>
              <button
                className="modal-close-button"
                onClick={() => {
                  if (uploading === false) {
                    imageCropped.current = false;
                    handleDisplayCroppedPreview();
                  }
                }}
              >
                <img src={CloseIcon} alt="" />
              </button>
            </div>
            <div className="modal-body">
              {/* <img src={filePath} id="uploadedPhoto" alt="uploaded photo"/> */}
              <ReactCrop
                style={{ width: '100%' }}
                imageStyle={{ width: '100%' }}
                src={filePath}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                circularCrop={true}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="mir-button primary"
                disabled={uploading === true || !completedCrop?.width || !completedCrop?.height}
                onClick={() => generateDownload(previewCanvasRef.current, completedCrop)}
              >
                {uploading ? 'Uploading...' : 'Set Crop'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        id="croppedImage"
        className={photoFileLocator === null && imageCropped.current === false ? 'hide' : 'mt-4'}
        style={croppedImageStyles}
      >
        {title ? title : <h2 className="mb-3 font-bold">Profile photo</h2>}

        <canvas ref={previewCanvasRef} />
        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
        <img src={imgURL} alt="avatar image" />

        <div>
          <input
            type="file"
            id="changePhoto"
            onChange={onSelectFile}
            name="changePhoto"
            accept="image/gif, image/jpeg, image/png"
            ref={changePhotoButtonRef}
          />
          <button
            className="mir-button change-photo-button"
            onClick={() => changePhotoButtonRef.current.click()}
          >
            Change Photo
          </button>
        </div>
      </div>
    </div>
  );
}

PhotoUpload.propTypes = {
  title: PropTypes.node,
  photoFileLocator: PropTypes.string,
  uploadHandler: PropTypes.func,
  invalid: PropTypes.bool,
  errorMessage: PropTypes.string,
  buttonOnly: PropTypes.bool,
  textPhoto: PropTypes.string,
  textCrop: PropTypes.string,
  initialState: PropTypes.object,
};

PhotoUpload.defaultProps = {
  textPhoto: 'Drag your photo here or',
  textCrop: 'Crop your profile picture',
  initialState: {
    inputValue: '',
    filePath: '',
  },
};

export default PhotoUpload;
