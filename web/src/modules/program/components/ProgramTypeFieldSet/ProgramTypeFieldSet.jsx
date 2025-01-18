import PropTypes from 'prop-types';
import cn from 'classnames';

import { ProgramCount } from './ProgramCount';
import { useProgramTypes } from '@/core/api/ReferenceDataQueries';
import { object } from 'yup';
import { useController } from 'react-hook-form';

export function ProgramTypeFieldSet({ name, control, className, type }) {
  const types = useProgramTypes(type);
  const rows = Math.ceil(types.length / 2);
  const { field } = useController({ control, name, defaultValue: {} });
  return (
    <div>
      <h3 className="my-4 !text-base font-bold">Program type</h3>
      <div
        className={cn(
          'grid grid-cols-1 gap-x-4 gap-y-6 xl:grid-flow-col xl:grid-cols-[repeat(2,max-content)] xl:gap-x-20',
          className,
        )}
        style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {types.map(({ id, code, name: programName }) => (
          <ProgramCount
            key={id}
            label={programName}
            value={field.value[code] || 0}
            onChange={(value) => {
              field.onChange({ ...field.value, [code]: value });
            }}
          />
        ))}
      </div>
    </div>
  );
}

ProgramTypeFieldSet.schema = object().test(
  'programTypeSelected',
  'Please select at least one program type',
  (types) => Object.values(types).some((v) => v !== 0),
);

ProgramTypeFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
  className: PropTypes.string,
  type: PropTypes.string,
};

ProgramTypeFieldSet.defaultProps = {
  type: 'PROGRAM',
};
