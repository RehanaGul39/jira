import React from "react";
import Ticket from "./Ticket";
import { Droppable } from "react-beautiful-dnd";

const Column = ({ columnKey, column, onEdit }) => {
  return (
    <div className={`column ${columnKey}`}>
      <h4>{column.title}</h4>
      <Droppable droppableId={columnKey} type="task">
        {(provided) => (
          <div
            className="column-tickets"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {column.items.map((ticket, index) => (
              <Ticket
                key={ticket.id}
                ticket={ticket}
                index={index}
                onEdit={() => onEdit(ticket)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
