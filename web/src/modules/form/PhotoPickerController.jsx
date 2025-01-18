import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import PhotoUpload from '@/deprecated/components/PhotoUpload/PhotoUpload';

// TODO: MIR-3467 - replace deprecated upload with new one
export function PhotoPickerController({ control, name, viewByCenter }) {
  let { field, fieldState } = useController({ control, name, defaultValue: null });

  return (
    <PhotoUpload
      title={<legend className="mb-3 font-bold">Profile photo</legend>}
      croppedImageStyles={{
        marginBottom: 0,
        marginTop: 0,
        ...(viewByCenter && {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '180px',
        }),
      }}
      photoFileLocator={field.value}
      uploadHandler={async (blob) => field.onChange(URL.createObjectURL(blob))}
      invalid={fieldState.invalid}
      errorMessage={fieldState.error?.message}
      textCrop="Crop your profile photo"
    />
  );
}

PhotoPickerController.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  viewByCenter: PropTypes.bool,
};
