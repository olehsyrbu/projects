import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { DismissCircle24Filled as DismissCircle } from '@fluentui/react-icons';

export function SortableImage({ src, rearrangeMode, onDelete }) {
  let isTouchDevice = 'ontouchstart' in window;
  let { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: src,
    transition: { duration: 200, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' },
  });

  return (
    <div
      ref={setNodeRef}
      className="group relative touch-manipulation border border-solid border-graphics-50 bg-graphics-10 pb-[75%]"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : null,
      }}
    >
      <img className="absolute left-0 top-0 h-full w-full object-cover" src={src} alt="" />
      <div
        className={cn('invisible absolute inset-0', {
          'group-hover:visible': !isTouchDevice,
          '!visible': isDragging || rearrangeMode,
        })}
      >
        <div className="absolute inset-0 flex bg-[rgba(0,0,0,0.5)]" {...attributes} {...listeners}>
          <p className="m-auto select-none text-sm text-white">Drag to rearrange</p>
        </div>
        <button
          className="absolute right-2 top-2 m-0 cursor-pointer border-none bg-transparent p-1 hover:scale-105 active:scale-100"
          onClick={onDelete}
          aria-label="Delete image"
        >
          <DismissCircle className="text-white" />
        </button>
      </div>
    </div>
  );
}

SortableImage.propTypes = {
  src: PropTypes.string.isRequired,
  rearrangeMode: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
};

SortableImage.defaultProps = {
  rearrangeMode: false,
};
