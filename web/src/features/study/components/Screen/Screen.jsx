import { isEmpty } from 'lodash-es';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import mixpanel from '@/core/mixpanel';
import { noop } from '@/core/utils';
import { TextField } from '@/modules/form';
import { CheckboxesChooser } from './CheckboxesChooser';
import { RadiosChooser } from './RadiosChooser';
import { ScreenQuestion } from './ScreenQuestion';
import { ScreenInfo } from './ScreenInfo';
import { ScreenControls } from './ScreenControls';
import { SliderChooser } from './SliderChooser';
import { useAppletContext } from '@/modules/mindlogger/hooks';

export function Screen({ onResponse, screen, response, onSave }) {
  const name = screen.variableName;
  let defaultValues = {
    [name]: response ?? '',
  };
  const { handleSubmit, control, formState, reset } = useForm({
    defaultValues,
    mode: 'onChange',
  });
  const { applet, activity } = useAppletContext();

  const inputs = screen.valueConstraints.itemList || [];
  const multipleChoice = screen.valueConstraints.multipleChoice;
  const inputType = multipleChoice ? 'checkbox' : screen.inputType;
  const hasSingleInput = isEmpty(inputs);
  const hasInputs = inputType !== 'markdownMessage';
  const type = screen.valueConstraints.valueType.includes('integer') ? 'number' : 'text';

  function submitForm(data) {
    let value = data[name];
    reset();
    onResponse(value, name);
    mixpanel.track('Study Screen Next', {
      name,
      publicId: applet.publicId,
      activityId: activity.id,
    });
  }

  function saveForm(data) {
    let value = data[name];
    reset();
    onSave(value, name);
  }

  return (
    <article className="survey-step md:min-w-[46.5rem]">
      <ScreenInfo />
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="md:min-h-[10.5rem]">
          <ScreenQuestion question={screen.question.en} />
          <div className="my-7">
            {hasInputs && hasSingleInput && (
              <TextField
                name={name}
                control={control}
                label="Your answer"
                className="w-fit"
                rules={{ required: true }}
                type={type}
              />
            )}
            {multipleChoice && <CheckboxesChooser name={name} control={control} options={inputs} />}
            {inputType === 'radio' && (
              <RadiosChooser name={name} control={control} options={inputs} />
            )}
            {inputType === 'slider' && (
              <SliderChooser
                name={name}
                control={control}
                options={inputs}
                fromLabel={screen.valueConstraints?.minValue}
                toLabel={screen.valueConstraints?.maxValue}
              />
            )}
          </div>
        </div>
        <ScreenControls disabled={!formState.isValid} handleSave={handleSubmit(saveForm)} />
      </form>
    </article>
  );
}

Screen.propTypes = {
  screen: PropTypes.object.isRequired,
  response: PropTypes.any,
  onResponse: PropTypes.func,
  onSave: PropTypes.func,
};

Screen.defaultProps = {
  onResponse: noop,
  onSave: noop,
};
