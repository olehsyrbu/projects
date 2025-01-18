import { useController } from 'react-hook-form';
import { ImagePicker } from './ImagePicker';

import PropTypes from 'prop-types';
import { useState } from 'react';
import { Edit16Filled as Edit } from '@fluentui/react-icons';
import { array, object } from 'yup';
import { useScreen } from '@/core/hooks';

export function PhotoPickerFieldSet({ className, name, control, title }) {
  let { field, fieldState } = useController({ control, name });
  let [rearrangeMode, setRearrangeMode] = useState(false);
  let isMediumScreen = useScreen('md');

  return (
    <article className={className}>
      <div className="flex flex-row items-center justify-between">
        {title && <h4 className="mb-2 mt-0 text-base font-bold md:mb-4">{title}</h4>}
        {field.value.length > 0 && !isMediumScreen && (
          <button
            className="mir-button text !mb-4 !h-4 !p-0"
            onClick={() => setRearrangeMode(!rearrangeMode)}
            type="button"
          >
            <Edit />
            <span>{rearrangeMode ? 'Save changes' : 'Edit gallery'}</span>
          </button>
        )}
      </div>

      <ImagePicker images={field.value} onChange={field.onChange} rearrangeMode={rearrangeMode} />

      <p className="mt-8 max-w-xl text-sm text-hint">
        Ideally, uploaded images should have horizontal layout. Uploaded images must be less than
        8MB and in the PNG, JPG, or GIF format.
      </p>
      {fieldState.error?.message && (
        <p className="text-xs font-light text-error-1">{fieldState.error?.message}</p>
      )}
    </article>
  );
}

PhotoPickerFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
  title: PropTypes.string,
  className: PropTypes.string,
};

PhotoPickerFieldSet.defaultProps = {
  control: null,
};

PhotoPickerFieldSet.schema = object({
  photos: array().min(1, 'Please select at least one photo'),
});
