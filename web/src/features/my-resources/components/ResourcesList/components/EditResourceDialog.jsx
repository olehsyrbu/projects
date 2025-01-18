import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateInvitation } from '@/core/api/InvitationAPI';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';
import { TextField } from '@/modules/form';

let schema = object().shape({
  name: string().required('This field is required'),
  email: string().required('This field is required').email('Please enter an email address'),
});

export function EditResourceDialog({ resource, onSubmit, onDismiss }) {
  let { control, formState, handleSubmit, trigger, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: resource.recipient_name,
      email: resource.email,
    },
  });

  let { isSubmitting } = formState;

  async function submitResourceEdit({ name, email }) {
    try {
      await updateInvitation(resource.id, { recipient_name: name, email }, false);
      onSubmit();
    } catch (error) {
      setError('email', {
        type: 'SERVER_VALIDATION_ERROR',
        message: 'Resource with this email already exists',
      });
    }
  }

  async function triggerForm() {
    let valid = await trigger();
    if (valid) {
      await handleSubmit(submitResourceEdit)();
    }
  }

  return (
    <Dialog isOpen onDismiss={onDismiss} width="30rem">
      <DialogTitle>Edit resource data</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submitResourceEdit)}>
          <TextField label="Full Name" name="name" control={control} disabled={isSubmitting} />
          <div style={{ height: '1rem' }} />
          <TextField label="Email" name="email" control={control} disabled={isSubmitting} />
        </form>
      </DialogContent>
      <DialogActions>
        <button className="mir-button primary" disabled={isSubmitting} onClick={triggerForm}>
          Save
        </button>
        <button className="mir-button" disabled={isSubmitting} onClick={onDismiss}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}
