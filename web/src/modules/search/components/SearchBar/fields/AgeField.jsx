import { useFormContext } from 'react-hook-form';

export function AgeField() {
  let { register } = useFormContext();
  return (
    <div className="field" style={{ flexBasis: 214 }}>
      <p className="field-label">Your Age</p>
      <input className="field-input" {...register('age')} required placeholder="0-65+" />
    </div>
  );
}
