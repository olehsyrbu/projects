import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';
import InputText from '@/deprecated/components/FormElements/InputText/InputText';
import { updateInvitation } from '@/core/api/InvitationAPI';
import cx from './Dailog.module.css';

let schema = object().shape({
  invitationEmail: string()
    .required('This field is required')
    .email('Please enter an email address'),
});

export function ChangeEditEmailDialog({ isOpen, invitationEmail, id, onSubmit, onDismiss }) {
  let {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      invitationEmail,
    },
  });

  async function handleSubmitEmail({ invitationEmail }) {
    try {
      await updateInvitation(id, { email: invitationEmail }, false);
      onSubmit();
    } catch (e) {
      setError('invitationEmail', {
        type: 'SERVER_VALIDATION_ERROR',
        message: 'Provider with this email already exists',
      });
    }
  }

  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss} width={550}>
      <DialogTitle>Edit email</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleSubmitEmail)}>
          <div className={cx.content}>
            <p className="mb-3">
              If you need to change provider’s email, put it in the field below and resend your
              invitation afterwards.
            </p>
            <div className="onboarding-field">
              <InputText
                label="Providers email"
                invalid={errors.invitationEmail?.message}
                errorMessage={errors.invitationEmail?.message}
                {...register('invitationEmail')}
              />
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <button
          type="submit"
          className="mir-button primary"
          onClick={handleSubmit(handleSubmitEmail)}
        >
          Save
        </button>
        <button className="mir-button" onClick={onDismiss}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}

ChangeEditEmailDialog.propTypes = {
  isOpen: PropTypes.bool,
  id: PropTypes.string,
  invitationEmail: PropTypes.string,
  onDismiss: PropTypes.func,
  onSubmit: PropTypes.func,
};
