

import React from "react";

const TicketDetailsModal = ({ ticket, closeModal }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={closeModal}>X</button>
        <h2>{ticket.title}</h2>
        <p><strong>Description:</strong> {ticket.description}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
      </div>
    </div>
  );
};

export default TicketDetailsModal;
