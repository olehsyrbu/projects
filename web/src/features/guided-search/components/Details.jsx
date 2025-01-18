import PropTypes from 'prop-types';
import cn from 'classnames';
import {
  ChevronRight24Filled as ChevronRight,
  ChevronDown24Filled as ChevronDown,
} from '@fluentui/react-icons';

export function Details({ children, className, open }) {
  function handleToggle(event) {
    if (!event.target.open) {
      return;
    }

    let elements = document.querySelectorAll('[data-disclosure]');

    for (let element of elements) {
      if (element !== event.target) {
        element.open = false;
      }
    }
  }

  return (
    <details
      open={open}
      className={cn(
        'group border-0 border-t border-solid border-graphics-30 last-of-type:border-b open:pb-6 open:pl-10 open:pr-4',
        className,
      )}
      data-disclosure
      onToggle={handleToggle}
    >
      {children}
    </details>
  );
}

Details.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export function Summary({ className, children }) {
  return (
    <summary className="list-none py-6 pl-10 pr-4 focus:outline-none group-open:px-0 group-open:pb-2.5 details-marker:hidden">
      <div className="flex items-center">
        <span className="-ml-10 mr-4 mt-0.5 text-p-100">
          <ChevronRight className="group-open:hidden" />
          <ChevronDown className="!hidden group-open:!block" />
        </span>
        <div className={cn('text-xl font-bold leading-normal text-heading', className)}>
          {children}
        </div>
      </div>
    </summary>
  );
}

Summary.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
