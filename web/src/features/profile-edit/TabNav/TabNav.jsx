import { Children } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { useScreen } from '@/core/hooks';
import { TabLink, TabNavPanel, TabRoute } from '../TabNav';
import { findElementByType } from './utils';

export function TabNav({ children, className }) {
  let isMediumScreen = useScreen('md');

  let tabNavPanel = findElementByType(TabNavPanel, children);
  let firstTabLink = findElementByType(TabLink, children);

  return (
    <div
      className={cn(
        'min-h-fit border-graphics-30 bg-white md:grid md:grid-cols-[15rem_1fr] md:rounded-2xl md:border md:border-solid',
        className,
      )}
    >
      {isMediumScreen ? (
        tabNavPanel
      ) : (
        <Routes>
          <Route index element={tabNavPanel} />
        </Routes>
      )}

      <div className="flex h-screen flex-col justify-between md:h-fit">
        <Routes>
          {isMediumScreen && (
            <Route index element={<Navigate to={firstTabLink.props.to} replace />} />
          )}
          {Children.map(children, (child) => {
            if (child?.type !== TabRoute) return null;
            return <Route path={child.props.path} element={child} />;
          })}
        </Routes>
      </div>
    </div>
  );
}

TabNav.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
