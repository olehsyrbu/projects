import { forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import { useFieldArray, useForm } from 'react-hook-form';
import { array, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import { Dismiss24Filled as Dismiss, AddCircle24Filled as AddCircle } from '@fluentui/react-icons';
import { TextField } from '@/modules/form';
import { createInvitations } from '@/core/api/InvitationQueries';
import cx from './AddResourcesForm.module.css';
import { InvitationTypes } from '@/core/definitions';
import { noop } from '@/core/utils';
import { useMatchMedia } from '@/core/hooks';

let schema = object().shape({
  resources: array().of(
    object().shape({
      firstName: string().required('This field is required'),
      lastName: string().required('This field is required'),
      email: string()
        .required('This field is required')
        .email('Please enter an email address')
        .test('emailUnique', 'This email is not unique', (email, context) => {
          let { resources } = context.from[1].value;
          return resources.every(
            (resource) => resource === context.parent || resource.email !== email,
          );
        }),
    }),
  ),
});

export let AddResourcesForm = forwardRef((props, ref) => {
  const {
    organizationId,
    onSuccess,
    invitationType,
    batchCreateInvitations,
    failedMessage,
    successMessage,
    shouldSendInvitations,
    entityLabel,
    submitActionLabel,
  } = props;
  let [successfulSubmit, setSuccessfulSubmit] = useState(false);
  let [failedSubmit, setFailedSubmit] = useState(false);
  let isMobile = useMatchMedia('(max-width: 767px)');

  let { control, formState, handleSubmit, trigger, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      resources: [{ firstName: '', lastName: '', email: '' }],
    },
  });
  let { isSubmitting } = formState;
  let { fields, append, remove } = useFieldArray({ name: 'resources', control });

  async function submitResources({ resources }) {
    let invitations = resources.map((resource) => ({
      recipient_name: `${resource.firstName} ${resource.lastName}`,
      email: resource.email,
      type: invitationType,
      message_type: 'EMAIL',
      organization_id: organizationId,
      do_send_invitation: shouldSendInvitations,
    }));

    let results = await batchCreateInvitations(invitations);

    if (results.failed.length === 0) {
      onSuccess(results.success);
      return;
    }

    results.failed.forEach((failed) => {
      let index = resources.findIndex((resource) => resource.email === failed.email);

      setError(`resources.${index}.email`, {
        type: failed.reason,
        message: 'Resource with this email already exists',
      });
    });

    let successfulIndexes = results.success.map((invitation) => {
      return resources.findIndex((resource) => resource.email === invitation.email);
    });

    remove(successfulIndexes);

    setSuccessfulSubmit(results.success.length > 0);
    setFailedSubmit(results.failed.length > 0);
  }

  async function handleSubmitClick() {
    let valid = await trigger();
    if (valid) {
      handleSubmit(submitResources)();
    }
  }

  useImperativeHandle(ref, () => ({
    submit() {
      handleSubmitClick();
    },
  }));

  return (
    <div className={cn(cx.formContainer, { [cx.disabled]: isSubmitting })}>
      {successfulSubmit && <div className={cx.successMessage}>{successMessage}</div>}

      {failedSubmit && <div className={cx.errorMessage}>{failedMessage}</div>}

      <form autoComplete="off" onSubmit={handleSubmit(submitResources)}>
        {fields.map((field, index) => (
          <fieldset key={field.id} className={cx.fieldGroup}>
            <TextField
              id={`resources.${index}.firstName`}
              label="First name"
              name={`resources.${index}.firstName`}
              defaultValue={field.firstName}
              control={control}
            />
            <TextField
              label="Last name"
              id={`resources.${index}.lastName`}
              name={`resources.${index}.lastName`}
              defaultValue={field.lastName}
              control={control}
            />
            <TextField
              label="Email"
              id={`resources.${index}.email`}
              name={`resources.${index}.email`}
              defaultValue={field.email}
              control={control}
              type="email"
            />
            <button
              type="button"
              className="mir-button text"
              disabled={fields.length === 1}
              onClick={() => remove(index)}
            >
              <Dismiss />
              <span>Remove</span>
            </button>
          </fieldset>
        ))}
        <button
          type="button"
          className="mir-button text"
          onClick={() => append({ firstName: '', lastName: '', email: '' })}
        >
          <AddCircle />
          <span>Add {entityLabel}</span>
        </button>
      </form>
      {!isMobile && (
        <button className="mir-button primary" disabled={isSubmitting} onClick={handleSubmitClick}>
          {submitActionLabel}
        </button>
      )}
    </div>
  );
});

AddResourcesForm.propTypes = {
  invitationType: PropTypes.oneOf(Object.values(InvitationTypes)),
  organizationId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  batchCreateInvitations: PropTypes.func,
  failedMessage: PropTypes.string,
  successMessage: PropTypes.string,
  shouldSendInvitations: PropTypes.bool,
  entityLabel: PropTypes.string,
  submitActionLabel: PropTypes.string,
};

AddResourcesForm.defaultProps = {
  onSuccess: noop,
  invitationType: InvitationTypes.Provider,
  batchCreateInvitations: createInvitations,
  failedMessage: 'These resources are already registered',
  successMessage: 'New resources have been added',
  shouldSendInvitations: false,
  entityLabel: 'resource',
  submitActionLabel: 'Add resource',
};
