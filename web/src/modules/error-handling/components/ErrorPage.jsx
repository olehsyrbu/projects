import PropTypes from 'prop-types';
import Logo from '@/modules/app-shell/Logo';
import './ErrorPage.css';

export function ErrorPage({ children }) {
  return (
    <section className="ErrorPage">
      <header>
        <a href="/">
          <Logo />
        </a>
      </header>
      <div className="ErrorPage__container">{children}</div>
    </section>
  );
}

ErrorPage.propTypes = {
  children: PropTypes.node.isRequired,
};
