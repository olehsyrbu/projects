import { TextArea } from './TextArea';
import { useForm, Controller } from 'react-hook-form';

export default {
  title: 'components/TextArea',
  component: TextArea,
};

export function TextAreaDefault(args) {
  return <TextArea {...args} />;
}
TextAreaDefault.storyName = 'TextArea';
TextAreaDefault.args = {
  placeholder: 'Lorem ipsum',
  maxLength: 150,
  minRows: 3,
  maxRows: 10,
};

export function TextAreaRegister() {
  let { register, handleSubmit, formState } = useForm({
    defaultValues: { text: 'Hello, World!' },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(() => {})}>
      <TextArea
        {...register('text', { required: 'This field is required' })}
        maxLength={100}
        errorMessage={formState.errors.text?.message}
      />
      <button className="mir-button primary">Submit</button>
    </form>
  );
}
TextAreaRegister.storyName = 'TextArea + register';

export function TextAreaController() {
  let { handleSubmit, control } = useForm({
    defaultValues: { text: 'Hello, World!' },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(() => {})}>
      <Controller
        name="text"
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field, fieldState }) => (
          <TextArea {...field} maxLength={100} errorMessage={fieldState.error?.message} />
        )}
      />
      <button className="mir-button primary">Submit</button>
    </form>
  );
}
TextAreaController.storyName = 'TextArea + Controller';
