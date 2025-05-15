import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function SortableTicket({ ticket, columnKey, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      className={`ticket ${isDragging ? "dragging" : ""}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <p>{ticket.title}</p>
      {columnKey === "todo" && (
        <div className="ticket-actions">
          <FaEdit className="icon edit-icon" onClick={onEdit} />
          <FaTrash className="icon delete-icon" onClick={onDelete} />
        </div>
      )}
    </div>
  );
}
