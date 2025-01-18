import { components } from 'react-select';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { object } from 'yup';
import { first, get } from 'lodash-es';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useAuthContext } from '@/modules/auth';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@/core/components';
import { Radio, Select } from '@/modules/form';

const schema = object().shape({
  selectProgram: object()
    .nullable()
    .when('typeOfNewProgram', {
      is: (typeOfNewProgram) => typeOfNewProgram === 'clone',
      then: (schema) => schema.required('This field is required'),
    }),
});

export function CloneProgramDialog({ open, onDismiss, onAddProgram }) {
  const { handleSubmit, watch, control } = useForm({
    defaultValues: { typeOfNewProgram: 'scratch', selectProgram: null },
    resolver: yupResolver(schema),
  });

  const typeOfNewProgram = watch('typeOfNewProgram');
  const selectProgram = watch('selectProgram');

  function submit({ selectProgram }) {
    onAddProgram(typeOfNewProgram === 'clone' ? selectProgram?.program : null);
  }

  return (
    <form>
      <Dialog
        width="34rem"
        isOpen={open}
        onDismiss={onDismiss}
        contentClassName="!overflow-visible"
      >
        <DialogTitle>Add program</DialogTitle>
        <DialogContent className="!overflow-visible">
          <p className="pb-6">Select existing program as a template or start from scratch.</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Radio name="typeOfNewProgram" control={control} value="scratch">
              Start from scratch
            </Radio>
            <Radio name="typeOfNewProgram" control={control} value="clone">
              Copy data from program
            </Radio>
          </div>
          {typeOfNewProgram === 'clone' && (
            <SelectProgram
              name="selectProgram"
              control={control}
              isHideLabel={!!selectProgram?.value}
            />
          )}
        </DialogContent>
        <DialogActions>
          <button type="submit" className="mir-button primary" onClick={handleSubmit(submit)}>
            Add program
          </button>
          <button className="mir-button" onClick={onDismiss}>
            Cancel
          </button>
        </DialogActions>
      </Dialog>
    </form>
  );
}

CloneProgramDialog.propTypes = {
  open: PropTypes.bool,
  onDismiss: PropTypes.func,
  onAddProgram: PropTypes.func,
};

function SelectProgram(props) {
  let { user } = useAuthContext();
  const listPrograms = user.ownership
    .filter((program) => program?.mode === 'PROGRAM')
    .map((program) => ({
      label: get(program, 'programType.name', ''),
      value: program.id,
      program,
      subLabel: (
        <p className="text-xs font-light">
          <Address {...program} />
        </p>
      ),
    }));

  return (
    <div className="mt-4">
      <Select
        label="Copy data from program"
        options={listPrograms}
        components={{ SingleValue }}
        {...props}
      />
    </div>
  );
}

function SingleValue({ children, data, ...props }) {
  return (
    <components.SingleValue {...props}>
      <div className="pb-2">
        <div className="!-mt-1">{children}</div>
        <p className="text-xs font-light">
          <Address {...data.program} />
        </p>
      </div>
    </components.SingleValue>
  );
}

SingleValue.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
};

function Address({ locations }) {
  let location = first(locations);
  if (!location?.address) return null;
  const { address: { address1 = '', address2 = '', city = '', state = {}, zip = '' } = {} } =
    location;

  return `${address1}\n${address2}\n${city}, ${state.name} ${zip}`.trim();
}
