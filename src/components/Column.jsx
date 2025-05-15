import React from "react";
import Ticket from "./Ticket";
import { useDroppable } from "@dnd-kit/core";

const Column = ({ columnKey, column, onEdit }) => {
  const { setNodeRef } = useDroppable({
    id: columnKey,
  });

  return (
    <div className={`column ${columnKey}`} ref={setNodeRef}>
      <h4>{column.title}</h4>
      <div className="column-tickets">
        {column.items.map((ticket, index) => (
          <Ticket
            key={ticket.id}
            ticket={ticket}
            index={index}
            onEdit={() => onEdit(ticket)}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
