import React, { useState } from "react";
import TicketDetailsModal from "./components/TicketDetailsModal"; 
import "./App.css";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Move tickets into state so we can update
  const [tickets, setTickets] = useState([
    { id: 1, title: "Research Task 1", description: "Complete task 1 details", status: "todo" },
    { id: 2, title: "Research Task 2", description: "Complete task 2 details", status: "inprogress" }
  ]);

  const handleOpenTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  // Function to update a ticket (passed to modal)
  const handleUpdateTicket = (updatedTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
    setSelectedTicket(updatedTicket);
  };

  return (
    <div className="app">
      <div className="app-layout">
        <header>
          <h1>Ticket Board</h1>
        </header>
        
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="ticket"
              onClick={() => handleOpenTicketDetails(ticket)} 
              tabIndex={0}
              onKeyDown={(e) => {
                if(e.key === "Enter" || e.key === " ") {
                  handleOpenTicketDetails(ticket);
                }
              }}
              role="button"
              aria-pressed="false"
            >
              <p>{ticket.title}</p>
            </div>
          ))}
        </div>

        {modalOpen && selectedTicket && (
          <TicketDetailsModal 
            ticket={selectedTicket} 
            closeModal={() => setModalOpen(false)} 
            onTicketUpdate={handleUpdateTicket}
          />
        )}
      </div>
    </div>
  );
}
