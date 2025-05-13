import React, { useEffect, useState } from "react";
import TicketModal from "./TicketModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Board() {
  const defaultColumns = {
    todo: { title: "Backlog", items: [] },
    inprogress: { title: "Exploring 🧪", items: [] },
    done: { title: "Active Research 📗", items: [] },
  };

  const [columns, setColumns] = useState(defaultColumns);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTicket, setEditTicket] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("columns");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const sanitizedColumns = {};

        Object.entries(defaultColumns).forEach(([key, defaultValue]) => {
          const savedColumn = parsed[key];
          sanitizedColumns[key] = {
            title: defaultValue.title,
            items: Array.isArray(savedColumn?.items)
              ? savedColumn.items.filter(item => item && item.id && item.title)
              : [],
          };
        });

        setColumns(sanitizedColumns);
      } catch (error) {
        console.error("Error loading saved board:", error);
        setColumns(defaultColumns);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  const handleDrop = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Deep copy the columns to avoid direct mutation
    const updatedColumns = JSON.parse(JSON.stringify(columns));

    // Get the moved ticket and update the columns
    const [movedTicket] = updatedColumns[source.droppableId].items.splice(source.index, 1);
    updatedColumns[destination.droppableId].items.splice(destination.index, 0, movedTicket);

    // Set the updated columns state
    setColumns(updatedColumns);
  };

  const handleDelete = (ticketId) => {
    const updatedColumns = JSON.parse(JSON.stringify(columns));

    // Remove the ticket from all columns
    for (const key in updatedColumns) {
      updatedColumns[key].items = updatedColumns[key].items.filter(
        (ticket) => ticket.id !== ticketId
      );
    }

    setColumns(updatedColumns);
  };

  const handleTicketCreate = (newTicket) => {
    const updatedColumns = JSON.parse(JSON.stringify(columns));
    updatedColumns[newTicket.status].items.push(newTicket);
    setColumns(updatedColumns);
  };

  const handleTicketUpdate = (updatedTicket) => {
    const updatedColumns = JSON.parse(JSON.stringify(columns));

    // Remove the ticket from all columns
    Object.keys(updatedColumns).forEach((key) => {
      updatedColumns[key].items = updatedColumns[key].items.filter(
        (item) => item.id !== updatedTicket.id
      );
    });

    // Add the updated ticket to the correct column
    updatedColumns[updatedTicket.status].items.push(updatedTicket);
    setColumns(updatedColumns);
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDrop}>
        <div className="board">
          {Object.entries(columns).map(([key, column]) => (
            <Droppable droppableId={key} key={key}>
              {(provided, snapshot) => (
                <div
                  className={`column ${snapshot.isDraggingOver ? "drag-over" : ""}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2>{column.title}</h2>
                  {column.items.map((ticket, index) => (
                    <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          className={`ticket ${snapshot.isDragging ? "dragging" : ""}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p>{ticket.title}</p>
                          {key === "todo" && (
                            <div className="ticket-actions">
                              <FaEdit
                                className="icon edit-icon"
                                onClick={() => {
                                  setEditTicket({ ...ticket, status: key });
                                  setModalOpen(true);
                                }}
                              />
                              <FaTrash
                                className="icon delete-icon"
                                onClick={() => handleDelete(ticket.id)}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {modalOpen && (
        <TicketModal
          closeModal={() => setModalOpen(false)}
          ticketToEdit={editTicket}
          onTicketCreate={handleTicketCreate}
          onTicketUpdate={handleTicketUpdate}
        />
      )}
    </div>
  );
}
