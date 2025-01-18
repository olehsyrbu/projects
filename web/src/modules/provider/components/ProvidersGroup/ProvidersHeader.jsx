import PropTypes from 'prop-types';
import { useScreen } from '@/core/hooks';
import cn from 'classnames';

export function ProvidersHeader({ children }) {
  const isMediumScreen = useScreen('md');
  const cnHeader = cn({
    'header-mobile': !isMediumScreen,
    'header-desktop': isMediumScreen,
  });
  return (
    <h1 className={`${cnHeader} mb-6 px-4 !text-2xl md:mt-8 md:px-0 md:!text-[2.5rem]`}>
      My resources
      {children}
    </h1>
  );
}

ProvidersHeader.propTypes = {
  children: PropTypes.node,
};
