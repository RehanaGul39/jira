import React, { useEffect, useState } from "react";
import TicketModal from "./TicketModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Board() {
  const defaultColumns = {
    todo: { title: "TO-DO", items: [] },
    inprogress: { title: "In Progress 🧪", items: [] },
    done: { title: "Completed📗", items: [] },
  };

  const [columns, setColumns] = useState(defaultColumns);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTicket, setEditTicket] = useState(null);
  const [createInStatus, setCreateInStatus] = useState("todo");

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

    const updatedColumns = JSON.parse(JSON.stringify(columns));
    const [movedTicket] = updatedColumns[source.droppableId].items.splice(source.index, 1);
    updatedColumns[destination.droppableId].items.splice(destination.index, 0, movedTicket);

    setColumns(updatedColumns);
  };

  const handleDelete = (ticketId) => {
    const updatedColumns = JSON.parse(JSON.stringify(columns));
    for (const key in updatedColumns) {
      updatedColumns[key].items = updatedColumns[key].items.filter(
        (ticket) => ticket.id !== ticketId
      );
    }
    setColumns(updatedColumns);
  };

  const handleTicketCreate = (newTicket) => {
    setColumns(prevColumns => {
      const updatedColumns = JSON.parse(JSON.stringify(prevColumns));
      updatedColumns[newTicket.status].items.push(newTicket);
      return updatedColumns;
    });
  };

  const handleTicketUpdate = (updatedTicket) => {
    const updatedColumns = JSON.parse(JSON.stringify(columns));
    Object.keys(updatedColumns).forEach((key) => {
      updatedColumns[key].items = updatedColumns[key].items.filter(
        (item) => item.id !== updatedTicket.id
      );
    });
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

                  {/* Only show the "+" button in the "todo" column */}
                  {key === "todo" && (
                    <button
                      className="add-ticket-plus"
                      onClick={() => {
                        setEditTicket(null);
                        setCreateInStatus(key);
                        setModalOpen(true);
                      }}
                    >
                      +
                    </button>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {modalOpen && (
        <TicketModal
          closeModal={() => {
            setModalOpen(false);
            setCreateInStatus("todo");
          }}
          ticketToEdit={editTicket}
          onTicketCreate={handleTicketCreate}
          onTicketUpdate={handleTicketUpdate}
          defaultStatus={createInStatus}
        />
      )}
    </div>
  );
}
