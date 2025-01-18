import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft24Filled as ChevronLeft } from '@fluentui/react-icons';

export function TabHeader({ children }) {
  let navigate = useNavigate();

  return (
    <h2 className="fixed top-0 z-[100] flex h-16 min-h-[3rem] w-full items-center justify-between border-0 border-b border-solid border-graphics-70 bg-white md:sr-only  md:hidden md:border-none">
      <button
        className="ml-4 cursor-pointer border-0 bg-transparent text-p-100 md:ml-0 md:w-12"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft />
      </button>
      <p className="text-center font-bold md:font-normal">{children}</p>
      <div className="w-12" />
    </h2>
  );
}

TabHeader.propTypes = {
  children: PropTypes.node.isRequired,
};
