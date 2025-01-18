import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash-es';
import isEmail from 'validator/es/lib/isEmail';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';
import { Select } from '@/core/components/Select';
import { Option } from './Options';
import { getUsersEmail, updateShareAccess, removeShareAccess } from '@/core/api/ProviderQueries';
import { RemoveAccessDialog } from './RemoveAccessDialog';
import { toast } from '@/core/components/Toast';

export function SharedDialog({ onSubmit, onClose, open, sharedWith }) {
  const [selectEmail, setSelectEmail] = useState(null);
  const [options, setOptions] = useState([]);
  const [sharedList, setSharedList] = useState(sharedWith);
  const [error, setError] = useState(null);
  const [removeDialogState, setRemoveDialogState] = useState({
    isOpenRemoveDialog: false,
    id: null,
    type: null,
  });

  useEffect(() => {
    setSelectEmail(null);
    setError(null);
  }, [open]);

  useEffect(() => {
    setSharedList(sharedWith);
  }, [sharedWith]);

  const handleChange = (value) => {
    if (value?.value) {
      setSelectEmail(value);
      error && setError(null);
    }
  };

  const loadOptions = async (value, callback) => {
    setSelectEmail({ value, label: value });
    error && setError(null);
    try {
      const usersEmail = await getUsersEmail(value);
      const options =
        usersEmail?.usersShareAccessSuggestions.map(({ email, firstName, lastName }) => ({
          value: email,
          label: email,
          name: `${firstName} ${lastName}`,
        })) || [];
      callback ? callback(options) : setOptions(options);
    } catch (e) {}
  };

  const debouncedLoadOptions = debounce(loadOptions, 300);

  const handleSubmit = async () => {
    if (!isEmail(selectEmail.value)) {
      setError('Please try this email format: xxx@yyy.zzz');
    } else {
      try {
        const { id, type, email, name } = await updateShareAccess(selectEmail.value);
        setSharedList([...sharedList, { id, type, email, name }]);

        const message =
          type === 'User'
            ? `You have successfully shared access with ${name}`
            : `We have successfully sent invitation to ${email}`;
        toast.success(message);

        onSubmit();
      } catch (e) {
        const errors = e.message.split('.');
        setError(errors[0]);
      }
    }
  };

  const handleRemove = async (resetEmail) => {
    try {
      const data = await removeShareAccess(
        removeDialogState.id,
        removeDialogState.type,
        resetEmail,
      );
      const newSharedList = sharedList.filter((item) => item.id !== data.id);
      setSharedList(newSharedList);
      setRemoveDialogState({ isOpenRemoveDialog: false, id: null, type: null });
    } catch (e) {}
  };

  return (
    <>
      <Dialog isOpen={open} onDismiss={onClose} width={600}>
        <DialogTitle>Access share</DialogTitle>
        <DialogContent className="!overflow-visible">
          <p className="-mt-4">
            By sharing access you give a person permission to edit your profile. If the person is
            not registered in MiResource, they will be added as an administrator.
          </p>
          {sharedList.length > 0 && (
            <>
              <p className="mt-3 font-bold">Shared with</p>
              <div className="max-h-60 overflow-auto">
                {sharedList.map(({ id, name, email, type }) => (
                  <p key={id} className="flex items-center border-0 border-b  border-solid py-4">
                    <div className="w-full items-center break-all md:flex">
                      <div className="md:w-40">
                        {type === 'Invitation' ? (
                          <div className="w-fit rounded-2xl bg-[#F1F1F1] px-2 py-1 text-sm font-medium text-hint">
                            GPA Invited
                          </div>
                        ) : (
                          <div>{name}</div>
                        )}
                      </div>
                      <div>{email}</div>
                    </div>
                    <button
                      className="mir-button text !ml-2 !h-auto !p-0 !leading-normal md:!min-w-fit"
                      onClick={() =>
                        setRemoveDialogState({ id, type, name, email, isOpenRemoveDialog: true })
                      }
                    >
                      Remove access
                    </button>
                  </p>
                ))}
              </div>
            </>
          )}

          <p className="mt-10 font-bold md:mt-3 ">Enter email and hit Share access button</p>
          <div className="mt-3">
            <Select
              className="mt-3"
              label="Email"
              isSearchable
              onChange={handleChange}
              loadOptions={debouncedLoadOptions}
              isAsync
              value={selectEmail}
              components={{ Option }}
              onInputChanged={debouncedLoadOptions}
              options={options}
              placeholder="Email"
              inputText={selectEmail?.label || selectEmail}
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 999 }) }}
              invalid={!!error}
              errorMessage={error}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <button className="mir-button primary" onClick={handleSubmit} disabled={!selectEmail}>
            Share access
          </button>
          <button className="mir-button" onClick={onClose}>
            Cancel
          </button>
        </DialogActions>
      </Dialog>
      <RemoveAccessDialog
        isOpen={removeDialogState.isOpenRemoveDialog}
        onSubmit={handleRemove}
        onDismiss={() => setRemoveDialogState({ isOpenRemoveDialog: false, id: null, type: null })}
        name={removeDialogState.name}
        email={removeDialogState.email}
      />
    </>
  );
}

SharedDialog.propTypes = {
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  sharedWith: PropTypes.array,
};

SharedDialog.defaultProps = {
  sharedWith: [],
  open: false,
};
