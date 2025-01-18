import { NavLink } from 'react-router-dom';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { ChevronRight20Filled as ChevronRight } from '@fluentui/react-icons';

export function TabLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-row items-center border-0 border-b border-solid border-graphics-70 px-4 py-2 font-normal text-heading hover:text-heading md:border-0',
          { 'bg-p-10 font-bold': isActive },
        )
      }
    >
      {children}
      <ChevronRight className="ml-auto flex w-8 justify-end text-p-100 md:!hidden" />
    </NavLink>
  );
}

TabLink.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};
