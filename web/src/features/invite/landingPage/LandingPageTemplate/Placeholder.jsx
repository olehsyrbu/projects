import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function Placeholder({ children }) {
  let ref = useRef();

  useEffect(() => {
    function refresh() {
      let nextElement = ref.current.nextElementSibling;
      let rect = nextElement.getBoundingClientRect();
      ref.current.style.height = `${rect.height}px`;
    }

    refresh();
    window.addEventListener('resize', refresh);
    return () => window.removeEventListener('resize', refresh);
  }, []);

  return (
    <>
      <div ref={ref} />
      {children}
    </>
  );
}

Placeholder.propTypes = {
  children: PropTypes.node,
};
