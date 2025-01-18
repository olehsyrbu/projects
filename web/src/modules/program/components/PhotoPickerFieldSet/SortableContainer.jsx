import { DndContext, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { MouseSensor, TouchSensor } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import PropTypes from 'prop-types';

export function SortableContainer({ children, items, onReplace }) {
  let sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function handleDragEnd(event) {
    if (typeof onReplace === 'function') {
      onReplace(event.active.id, event.over.id);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items}>{children}</SortableContext>
    </DndContext>
  );
}

SortableContainer.propTypes = {
  children: PropTypes.node,
  items: PropTypes.array,
  onReplace: PropTypes.func,
};
