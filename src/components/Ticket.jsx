import React, { useState, useEffect } from "react";
import TicketDetailsModal from "./components/TicketDetailsModal"; // Correct path for TicketDetailsModal
import "./App.css";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

 
  const tickets = [
    { id: 1, title: "Research Task 1", description: "Complete task 1 details", status: "todo" },
    { id: 2, title: "Research Task 2", description: "Complete task 2 details", status: "inprogress" }
  ];

  const handleOpenTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  return (
    <div className="app">
      <div className="app-layout">
        <header>
          <h1>Ticket Board</h1>
        </header>
        
        {/* Example of rendering tickets */}
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="ticket"
              onClick={() => handleOpenTicketDetails(ticket)} // Open modal on ticket click
            >
              <p>{ticket.title}</p>
            </div>
          ))}
        </div>

        {/* TicketDetailsModal */}
        {modalOpen && selectedTicket && (
          <TicketDetailsModal 
            ticket={selectedTicket} 
            closeModal={() => setModalOpen(false)} 
          />
        )}
      </div>
    </div>
  );
}
