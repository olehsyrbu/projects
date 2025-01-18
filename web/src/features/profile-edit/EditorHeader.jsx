import PropTypes from 'prop-types';
import { ChevronLeft24Filled as ChevronLeft } from '@fluentui/react-icons';
import { useScreen } from '@/core/hooks';

export function EditorHeader({ text, onBack }) {
  let isMediumScreen = useScreen('md');
  return (
    <div className="my-6 flex h-12 items-center justify-between max-md:hidden">
      <button
        className="flex w-fit cursor-pointer items-center border-0 bg-transparent"
        onClick={onBack}
      >
        <ChevronLeft className="text-p-100" />
        <p className="ml-2 text-2xl font-bold leading-8 tracking-[0.1px] text-regular">{text}</p>
      </button>

      {/*Provide a placeholder for actions portal*/}
      {isMediumScreen ? <div id="edit-actions" className="ml-auto" /> : null}
    </div>
  );
}

EditorHeader.propTypes = {
  text: PropTypes.string,
  onBack: PropTypes.func,
};
