import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import AllCards from './AllCards';
import AddApp from './AddApp';

const StatusColumn = React.memo(({ apps, column, isEditing }) => {
  return (
    <div className="column is-marginless">
      <div className="card card-radius ">
        <div className="card-content">
          <p className="title is-5 has-text-white">{column.title}</p>
          <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                className="list is-hoverable"
                {...provided.droppableProps}
                ref={provided.innerRef}
                // isDraggingOver={snapshot.isDraggingOver}
              >
                <AllCards apps={apps} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <AddApp columnId={column.id} isEditing={isEditing} />
      </div>
    </div>
  );
});

export default StatusColumn;
