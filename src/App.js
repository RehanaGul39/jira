import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import TicketModal from "./components/TicketModal";
import Sidebar from "./components/Sidebar";
import TicketDetailsModal from "./components/TicketDetailsModal.jsx"; // Import the new modal
import "./App.css";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTicket, setEditTicket] = useState(null);
  const [ticketDetailsModalOpen, setTicketDetailsModalOpen] = useState(false); // Track ticket details modal state
  const [selectedTicket, setSelectedTicket] = useState(null); // Selected ticket to display details

  // Load columns from localStorage or use default columns
  const loadColumns = () => {
    const saved = localStorage.getItem("columns");
    if (saved) {
      return JSON.parse(saved);
    } else {
      // Default columns structure
      return {
        todo: { title: "Backlog", items: [] },
        inprogress: { title: "Exploring 🧪", items: [] },
        done: { title: "Active Research 📗", items: [] },
      };
    }
  };

  const [columns, setColumns] = useState(loadColumns);

  useEffect(() => {
    // Update localStorage when columns change (only if columns were modified)
    const savedColumns = localStorage.getItem("columns");
    if (JSON.stringify(columns) !== savedColumns) {
      localStorage.setItem("columns", JSON.stringify(columns));
    }
  }, [columns]);

  const handleEdit = (ticket, columnKey) => {
    setEditTicket({ ...ticket, status: columnKey });
    setModalOpen(true);
  };

  const handleOpenModal = () => {
    setEditTicket(null); // Ensure the modal is opened for creating a new ticket, not editing
    setModalOpen(true);
  };

  // Add onTicketCreate function to handle ticket creation
  const onTicketCreate = (ticket) => {
    const newTicket = {
      id: Date.now().toString(),
      title: ticket.title,
      description: ticket.description,
      status: ticket.status, // Use the status selected in the modal
    };

    // Update the columns with the new ticket
    const updatedColumns = { ...columns };
    updatedColumns[newTicket.status].items.push(newTicket);

    // Save updated columns in localStorage
    setColumns(updatedColumns);
  };

  // Add onTicketUpdate function to handle ticket updates
  const onTicketUpdate = (updatedTicket) => {
    const updatedColumns = { ...columns };
    const column = updatedColumns[updatedTicket.status];
    const ticketIndex = column.items.findIndex((item) => item.id === updatedTicket.id);

    if (ticketIndex !== -1) {
      column.items[ticketIndex] = updatedTicket;
    }

    setColumns(updatedColumns);
  };

  // Handle opening the details modal when clicking on a ticket
  const handleViewTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setTicketDetailsModalOpen(true);
  };

  const handleCloseTicketDetailsModal = () => {
    setTicketDetailsModalOpen(false);
    setSelectedTicket(null);
  };

  return (
    <div className="app">
      <div className="app-layout">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="main-content">
          <header className="app-header">
            <h1 className="header">✨ Design board ✨</h1>
            <div className="filters">
              <input type="text" placeholder="Search..." className="search" />
              <select className="dropdown">
                <option>Experience</option>
              </select>
              <select className="dropdown">
                <option>Label</option>
              </select>
              <button className="add-ticket-btn" onClick={handleOpenModal}>
                + Add Ticket
              </button>
            </div>
          </header>
          <Board columns={columns} onEdit={handleEdit} onViewDetails={handleViewTicketDetails} />
          
          {/* Edit/Create Ticket Modal */}
          {modalOpen && (
            <TicketModal
              closeModal={() => {
                setModalOpen(false);
                setEditTicket(null);
              }}
              ticketToEdit={editTicket}
              onTicketCreate={onTicketCreate}
              onTicketUpdate={onTicketUpdate}
            />
          )}

          {/* Ticket Details Modal */}
          {ticketDetailsModalOpen && selectedTicket && (
            <TicketDetailsModal
              ticket={selectedTicket}
              closeModal={handleCloseTicketDetailsModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}
