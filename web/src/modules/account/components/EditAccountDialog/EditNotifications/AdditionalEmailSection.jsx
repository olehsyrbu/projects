import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import isEmail from 'validator/es/lib/isEmail';
import PropTypes from 'prop-types';
import { InputField } from '../InputField';
import { Checkmark20Filled as Checkmark } from '@fluentui/react-icons';
import { Alert } from '@/core/components';
import '../EditAccountDialog.css';

export function AdditionalEmailSection({ availableEmails, saveUserChanges }) {
  const [editable, setEditable] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  let form = useForm({
    defaultValues: {
      email: '',
    },
    shouldUnregister: true,
    reValidateMode: 'onSubmit',
  });

  async function submitForm(values) {
    const isEmailExist = availableEmails.find((item) => item.value === values.email);
    setShowSuccess(false);

    if (isEmailExist) {
      form.setError('email', {
        type: 'string',
        message: 'This email has been already added, please choose another one.',
      });
    } else {
      await saveUserChanges(values.email);
      setEditable(false);
      setShowSuccess(true);
    }
  }

  return (
    <>
      <div className="mt-6">
        {editable ? (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(submitForm)}>
              <div className="pb-3 font-bold ">Add new email</div>
              <InputField
                type="email"
                name="email"
                label="Email"
                autoComplete="email"
                rules={{
                  required: true,
                  validate: { emailFormat: isEmail },
                }}
              />
              <div className="form-actions">
                <button type="submit" className="mir-button primary compact">
                  Save
                </button>
                <button className="mir-button compact" onClick={() => setEditable(false)}>
                  Discard
                </button>
              </div>
            </form>
          </FormProvider>
        ) : (
          <>
            <button className="mir-button text !h-0 !p-0" onClick={() => setEditable(true)}>
              Add new email
            </button>
            {showSuccess && (
              <div className="mt-6 text-sm ">
                <Alert
                  className="bg-green-100"
                  text="Your email has been added."
                  iconClassesName="text-emerald-400"
                  icon={<Checkmark />}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

AdditionalEmailSection.propTypes = {
  availableEmails: PropTypes.array,
  saveUserChanges: PropTypes.func,
};
