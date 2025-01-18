import PropType from 'prop-types';

import { ChipCounter } from '@/core/components/Chips/ChipCounter';
import { ChipTooltip } from './ChipTooltip';
import './ChipBoxWithTooltipFilter.css';

export function ChipBoxWithTooltipFilter({
  label,
  count,
  selected,
  children,
  handleChipClick,
  handleClearFilter,
  handleOutClick,
  reset,
  id,
}) {
  return (
    <div className="chipBoxWithTooltip">
      <ChipCounter
        label={label}
        count={count}
        selected={selected}
        onClick={handleChipClick}
        id={id}
      />
      {selected && (
        <ChipTooltip
          selected={selected}
          children={children}
          handleOutClick={handleOutClick}
          handleReset={reset}
          handleClearFilter={handleClearFilter}
        />
      )}
    </div>
  );
}

ChipBoxWithTooltipFilter.propTypes = {
  label: PropType.string,
  count: PropType.number,
  selected: PropType.bool,
  children: PropType.node,
  handleChipClick: PropType.func,
  handleClearFilter: PropType.func,
  handleOutClick: PropType.func,
  reset: PropType.func,
  id: PropType.string,
};
