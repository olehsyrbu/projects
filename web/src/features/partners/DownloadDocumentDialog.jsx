import { Suspense } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@/core/components';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, ReferenceDataSelect } from '@/modules/form';
import { useStates } from '@/core/api/StatesQueries';
import PropTypes from 'prop-types';
import config from '@/core/config';
import { logger } from '@/core/logger';
import mixpanel from '@/core/mixpanel';

let schema = object().shape({
  firstName: string().required('Please fill in your First Name'),
  lastName: string().required('Please fill in your Last Name'),
  organization: string().required('Please fill in your Organization'),
  email: string().required('Please fill in your Email').email('Please enter an email address'),
  state: object().nullable().required('Please fill in your State'),
});

export function DownloadDocumentDialog({ href, name, onCloseDialog }) {
  let { control, handleSubmit, reset, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      organization: '',
      document,
    },
  });

  function handleCloseDialog() {
    onCloseDialog();
    reset();
    mixpanel.track(`${name} Popup close`);
  }

  async function submit({ firstName, lastName, organization, email, state }) {
    try {
      let url = new URL('/contact/download-resources/email', config.api.baseUrl);
      const data = {
        email,
        first_name: firstName,
        last_name: lastName,
        organization,
        state: state?.name,
        document: name,
      };

      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      let a = document.createElement('a');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
      mixpanel.track(`${name} Download file`);
    } catch (error) {
      logger.error(error);
    }
    onCloseDialog();
    reset();
  }

  return (
    <Dialog isOpen onDismiss={handleCloseDialog} width="33rem">
      <DialogTitle>Download resource</DialogTitle>
      <DialogContent>
        <p className="pb-6">
          Please leave your contact information to download the {name}. All fields are required.
        </p>
        <form
          className={Object.keys(formState.errors).length > 0 ? 'space-y-3' : 'space-y-[1.25rem]'}
          onSubmit={handleSubmit(submit)}
        >
          <TextField label="First Name" name="firstName" control={control} />
          <TextField label="Last Name" name="lastName" control={control} />
          <Suspense fallback={<ReferenceDataSelect label="State" name="state" control={control} />}>
            <StatesSelect label="State" name="state" control={control} />
          </Suspense>
          <TextField label="Organization" name="organization" control={control} />
          <TextField label="Email" type="email" name="email" control={control} />
        </form>
      </DialogContent>
      <DialogActions>
        <button onClick={handleSubmit(submit)} className="mir-button primary">
          Download
        </button>
        <button className="mir-button" onClick={handleCloseDialog}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}

function StatesSelect(props) {
  const states = useStates();
  return <ReferenceDataSelect {...props} options={states} />;
}

DownloadDocumentDialog.propTypes = {
  href: PropTypes.string,
  name: PropTypes.string,
  onCloseDialog: PropTypes.func,
};
