import { useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { array, boolean, object } from 'yup';
import { useStates } from '@/core/api/StatesQueries';
import { ChipCheckbox, ReferenceDataSelect, Warning } from '@/modules/form';

export function RemoteFieldSet({ name, control, providerMode }) {
  let { field } = useController({ name, control });

  let { voice, chat, video } = field.value;
  let optionSelected = !providerMode && (voice || chat || video);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="mb-4">
          {providerMode
            ? 'If applicable, please select at least one remote type'
            : 'If applicable, please select at least one and add the states in which you offer virtual services.'}
        </p>
        <div className="flex space-x-4">
          <ChipCheckbox
            label="Voice"
            name={`${name}.voice`}
            onChange={(event) => field.onChange({ ...field.value, voice: event.target.checked })}
            control={control}
          />
          <ChipCheckbox
            label="Chat"
            name={`${name}.chat`}
            onChange={(event) => field.onChange({ ...field.value, chat: event.target.checked })}
            control={control}
          />
          <ChipCheckbox
            label="Video"
            name={`${name}.video`}
            onChange={(event) => field.onChange({ ...field.value, video: event.target.checked })}
            control={control}
          />
        </div>
        <Warning message={`${name}.message`} className="mt-4 px-4 py-2" control={control} />
      </div>
      {optionSelected && (
        <div className="space-y-3">
          <p className="font-bold">In what states are you licensed to provide virtual services?</p>
          <StatesSelect
            label="States"
            name={`${name}.states`}
            className="max-w-md"
            control={control}
          />
        </div>
      )}
    </div>
  );
}

RemoteFieldSet.defaultProps = {
  providerMode: false,
};

RemoteFieldSet.providerSchema = object()
  .shape({
    voice: boolean(),
    chat: boolean(),
    video: boolean(),
  })
  .test('remote', 'Please select at least one remote type', function (value) {
    const { voice, chat, video } = value;
    return voice || chat || video;
  });

RemoteFieldSet.schema = RemoteFieldSet.providerSchema.shape({
  states: array().when(['voice', 'chat', 'video'], {
    is: (voice, chat, video) => !voice || chat || video,
    then: (s) => s.min(1, 'Select at least one state').required('Select at least one state'),
  }),
});

RemoteFieldSet.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  providerMode: PropTypes.bool,
};

function StatesSelect(props) {
  let states = useStates();
  return <ReferenceDataSelect {...props} options={states} isSearchable={false} isMulti />;
}
