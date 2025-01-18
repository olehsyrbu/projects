import { useEffect, useRef } from 'react';
import cn from 'classnames';
import PropType from 'prop-types';

export function ChipTooltip({
  position = 'left',
  children,
  handleOutClick,
  handleReset,
  handleClearFilter,
}) {
  const tooltipRef = useRef(null);

  function clickEvent(e) {
    handleOutClick(tooltipRef.current?.contains(e.target));
  }

  useEffect(() => {
    document.addEventListener('click', clickEvent);
    return () => {
      document.removeEventListener('click', clickEvent);
      handleReset();
    };
  }, []);

  return (
    <div ref={tooltipRef} className={cn(`tooltip ${position}`)}>
      <div className="content">{children}</div>
      <div className="action">
        <button className="clearButton" onClick={handleClearFilter} type="button">
          Clear
        </button>
        <button className="applyButton" type="submit">
          Apply
        </button>
      </div>
    </div>
  );
}

ChipTooltip.propTypes = {
  children: PropType.node,
  position: PropType.string,
  handleOutClick: PropType.func,
  handleReset: PropType.func,
  handleClearFilter: PropType.func,
};
