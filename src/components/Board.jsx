import React, { useEffect, useState } from "react";
import TicketModal from "./TicketModal";
import SortableTicket from "./SortableTicket";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function Board() {
  const defaultColumns = {
    todo: { title: "TO-DO", items: [] },
    inprogress: { title: "In Progress 🧪", items: [] },
    done: { title: "Completed 📗", items: [] },
  };

  const [columns, setColumns] = useState(defaultColumns);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTicket, setEditTicket] = useState(null);
  const [createInStatus, setCreateInStatus] = useState("todo");

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const saved = localStorage.getItem("columns");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const sanitizedColumns = {};
        Object.entries(defaultColumns).forEach(([key, def]) => {
          const savedCol = parsed[key];
          sanitizedColumns[key] = {
            title: def.title,
            items: Array.isArray(savedCol?.items)
              ? savedCol.items.filter((i) => i && i.id && i.title)
              : [],
          };
        });
        setColumns(sanitizedColumns);
      } catch (err) {
        console.error("Error loading saved board:", err);
        setColumns(defaultColumns);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    let sourceColId = null;
    let sourceIndex = null;

   
    for (const colId in columns) {
      const index = columns[colId].items.findIndex((item) => item.id === activeId);
      if (index !== -1) {
        sourceColId = colId;
        sourceIndex = index;
        break;
      }
    }

    if (!sourceColId) return;
    const movedTicket = columns[sourceColId].items[sourceIndex];

    let destColId = null;
    let destIndex = null;

    for (const colId in columns) {
      const index = columns[colId].items.findIndex((item) => item.id === overId);
      if (index !== -1) {
        destColId = colId;
        destIndex = index;
        break;
      }
    }

    if (!destColId && columns[overId]) {
    
      destColId = overId;
      destIndex = columns[destColId].items.length;
    }

    if (!destColId) return;

    const updatedColumns = { ...columns };

  
    updatedColumns[sourceColId].items.splice(sourceIndex, 1);

    // Update status if moved between columns
    if (sourceColId !== destColId) {
      movedTicket.status = destColId;
    }

    // Insert into destination
    updatedColumns[destColId].items.splice(destIndex, 0, movedTicket);

    setColumns(updatedColumns);
  };

  const handleDelete = (ticketId) => {
    const updated = JSON.parse(JSON.stringify(columns));
    for (const key in updated) {
      updated[key].items = updated[key].items.filter((t) => t.id !== ticketId);
    }
    setColumns(updated);
  };

  const handleTicketCreate = (newTicket) => {
    setColumns((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated[newTicket.status].items.push(newTicket);
      return updated;
    });
  };

  const handleTicketUpdate = (updatedTicket) => {
    const updated = JSON.parse(JSON.stringify(columns));
    Object.keys(updated).forEach((key) => {
      updated[key].items = updated[key].items.filter((i) => i.id !== updatedTicket.id);
    });
    updated[updatedTicket.status].items.push(updatedTicket);
    setColumns(updated);
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          {Object.entries(columns).map(([key, column]) => (
            <ColumnDroppable key={key} columnKey={key}>
              <div className="column">
                <h2>{column.title}</h2>

                <SortableContext
                  items={column.items.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="column-tickets">
                    {column.items.map((ticket) => (
                      <SortableTicket
                        key={ticket.id}
                        ticket={ticket}
                        columnKey={key}
                        onEdit={() => {
                          setEditTicket({ ...ticket, status: key });
                          setModalOpen(true);
                        }}
                        onDelete={() => handleDelete(ticket.id)}
                      />
                    ))}
                  </div>
                </SortableContext>

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
            </ColumnDroppable>
          ))}
        </div>
      </DndContext>

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

function ColumnDroppable({ columnKey, children }) {
  const { setNodeRef } = useDroppable({ id: columnKey });
  return (
    <div ref={setNodeRef} className="column-wrapper">
      {children}
    </div>
  );
}
