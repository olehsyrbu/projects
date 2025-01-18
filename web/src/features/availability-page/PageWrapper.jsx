import PropTypes from 'prop-types';
import Logo from '@/modules/app-shell/Logo';

export function PageWrapper({ children }) {
  return (
    <div className="min-h-screen overflow-hidden bg-surface">
      <header className="flex h-20 items-center px-10">
        <Logo />
      </header>
      <div className="mx-auto my-0 px-9 py-16">{children}</div>
    </div>
  );
}

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
