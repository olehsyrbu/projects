import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@/core/components/Dialog';
import InputText from '@/deprecated/components/FormElements/InputText/InputText';
import './DeleteAccountDialog.css';
import { useAuthContext } from '@/modules/auth';

export function DeleteAccountDialog({ isOpen, onDismiss }) {
  let navigate = useNavigate();
  let form = useForm();
  let { user, deleteUser } = useAuthContext();
  let [serverError, setServerError] = useState(null);
  let error = form.formState.errors.keyword;
  const hasError = Boolean(serverError || error);

  function validateKeyWord(value) {
    return value !== 'DELETE' ? 'Please enter the text exactly as displayed to confirm.' : null;
  }

  async function triggerFormValidation() {
    if (await form.trigger()) {
      deleteAccount();
    }
  }

  async function deleteAccount() {
    const response = await deleteUser(user.id);
    if (!response?.err) {
      navigate('/');
    } else {
      setServerError('Can`t delete account. Contact our Support');
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      aria-label="Delete account"
      className={cn('DeleteAccountDialog', { submitting: form.formState.isSubmitting })}
    >
      <DialogTitle>Delete Account</DialogTitle>

      <DialogContent>
        <form className="space-y-6" onSubmit={form.handleSubmit(deleteAccount)}>
          <p className="text-xl font-bold">We'll miss you!</p>

          <p>By deleting your account, you will lose access to all of your resources.</p>

          <InputText
            label="Type DELETE to confirm"
            autoComplete="off"
            onPaste={(event) => event.preventDefault()}
            onDrop={(event) => event.preventDefault()}
            {...form.register('keyword', {
              validate: {
                keyword: validateKeyWord,
              },
            })}
            invalid={hasError}
            errorMessage={serverError || error?.message}
          />

          <p>You will receive an email confirmation.</p>
        </form>
      </DialogContent>

      <DialogActions>
        <button className="mir-button primary" onClick={onDismiss}>
          Back to edit account
        </button>
        <button className="mir-button" onClick={triggerFormValidation}>
          Permanently delete
        </button>
      </DialogActions>
    </Dialog>
  );
}
