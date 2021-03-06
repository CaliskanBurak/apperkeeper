import React, { useState } from 'react';
import initialData from '../data/initialData';

// Create new context
const DrgDrpContext = React.createContext();

// Using initialData as the initial state
const DragDropProvider = ({ children }) => {
  let [state, setState] = useState(initialData);

  // Updates the state of the columns defined in initialData using the id key for each column
  // Changes the isEditing property of the column back to false
  const handleEditing = (columnId) => {
    const column = state.columns[columnId];
    column.isEditing = true;

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [column.id]: {
          ...column,
        },
      },
    };

    setState(newState);
  };

  // Changes the isEditing property of the column back to false and updates the state of the columns
  const endEditing = (columnId) => {
    const column = state.columns[columnId];
    column.isEditing = false;

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [column.id]: {
          ...column,
        },
      },
    };

    setState(newState);
  };

  // Add data to database
  // Create app in database
  // Retrieve id and data from database to generate new card

  // Handling adding new apps to columns
  const addData = (
    columnId,
    newCompany,
    newPosition,
    newContact,
    newNotes,
    newDate,
    e
  ) => {
    const column = state.columns[columnId];
    // Adding new apps
    const apps = state.apps;
    const appsLength = Object.keys(apps).length;
    const newAppId = `app-${appsLength + 1}`;
    const appContent = {
      id: newAppId,
      company: newCompany,
      position: newPosition,
      contact: newContact,
      notes: newNotes,
      status: 'Interested',
      date: newDate,
    };

    apps[newAppId] = appContent;
    // Adding the new newAppId to the column
    const newAppsOrder = [...column.appsOrder];
    newAppsOrder.push(newAppId);

    const newColumn = {
      ...column,
      appsOrder: newAppsOrder,
    };

    // Update the state in initialData
    const newState = {
      ...state,
      apps,
      columns: {
        ...state.columns,
        [column.id]: {
          ...newColumn,
        },
      },
    };

    setState(newState);
  };

  // Handling the dragEnd method on DragDropContext
  const onDragEnd = (result) => {
    const { draggableId, destination, source } = result;

    // Avoid dropping on an invalid drop area
    if (!destination) {
      return;
    }

    const start = state.columns[source.droppableId];
    const end = state.columns[destination.droppableId];

    // Reordering apps in the same column
    if (start === end) {
      const column = state.columns[source.droppableId];
      const newAppsOrder = [...column.appsOrder];

      newAppsOrder.splice(source.index, 1);
      newAppsOrder.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...column,
        appsOrder: newAppsOrder,
      };

      const newColumns = {
        ...state.columns,
        [column.id]: {
          ...newColumn,
        },
      };

      const newState = {
        ...state,
        columns: newColumns,
      };
      setState(newState);
      return;
    }

    const startColumn = state.columns[source.droppableId];
    const endColumn = state.columns[destination.droppableId];

    const newStartAppsOrder = [...startColumn.appsOrder];
    const newEndAppsOrder = [...endColumn.appsOrder];

    newStartAppsOrder.splice(source.index, 1);
    newEndAppsOrder.splice(destination.index, 0, draggableId);

    const newStartColumn = {
      ...startColumn,
      appsOrder: newStartAppsOrder,
    };

    const newEndColumn = {
      ...endColumn,
      appsOrder: newEndAppsOrder,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [startColumn.id]: {
          ...newStartColumn,
        },
        [endColumn.id]: {
          ...newEndColumn,
        },
      },
    };
    setState(newState);
  };

  return (
    <DrgDrpContext.Provider
      value={{
        state,
        onDragEnd,
        addData,
        handleEditing,
        endEditing,
      }}
    >
      {children}
    </DrgDrpContext.Provider>
  );
};

export { DragDropProvider };

export default DrgDrpContext;
