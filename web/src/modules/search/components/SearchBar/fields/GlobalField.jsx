import { useId } from 'react';
import { useController } from 'react-hook-form';
import { useProgramSearchFlag } from '@/modules/search/hooks';

export function GlobalField() {
  let id = useId();
  let hasProgramsEnabled = useProgramSearchFlag();

  let { field } = useController({ name: 'query' });

  return (
    <div className="field input-text">
      <label htmlFor={id} className="field-label !static block !text-regular">
        Name
      </label>
      <input
        {...field}
        id={id}
        className="field-input"
        placeholder={`Search by therapist ${hasProgramsEnabled ? 'or program name' : ''}`}
      />
    </div>
  );
}
