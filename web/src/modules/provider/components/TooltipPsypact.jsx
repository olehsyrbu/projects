import { useStates } from '@/core/api/StatesQueries';
import { TooltipIcon } from '@/core/components/Tooltip';

export function TooltipPsypact() {
  const states = useStates();
  const psypactStates = states
    .filter(({ psypact }) => psypact)
    .map(({ code }) => code)
    .join(', ');

  return (
    <TooltipIcon
      label={`PSYPACT certification is valid for practice in following states: ${psypactStates}`}
      place="right"
    />
  );
}
