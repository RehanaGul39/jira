import React, { useState, useEffect } from 'react';

export default function TicketModal({
  closeModal,
  ticketToEdit,
  onTicketCreate,
  onTicketUpdate,
  defaultStatus = "todo"
}) {
  const [ticket, setTicket] = useState({
    title: '',
    description: '',
    status: defaultStatus,
  });

  useEffect(() => {
    if (ticketToEdit) {
      setTicket(ticketToEdit);
    } else {
      setTicket({
        title: '',
        description: '',
        status: defaultStatus,
      });
    }
  }, [ticketToEdit, defaultStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicket((prevTicket) => ({
      ...prevTicket,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ticket.title.trim() || !ticket.description.trim()) return;

    if (ticketToEdit) {
      onTicketUpdate(ticket);
    } else {
      const newTicket = {
        ...ticket,
        id: crypto.randomUUID(),
      };
      onTicketCreate(newTicket);
    }

    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={closeModal}>X</button>
        <h2>{ticketToEdit ? 'Edit Ticket' : 'Create New Ticket'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            className="modal-input"
            type="text"
            name="title"
            value={ticket.title}
            onChange={handleInputChange}
            required
            placeholder="Enter title..."
          />

          <label>Description</label>
          <textarea
            className="modal-textarea"
            name="description"
            value={ticket.description}
            onChange={handleInputChange}
            required
            placeholder="Add a detailed description..."
          />

          <label>Status</label>
          <select
            className="modal-select"
            name="status"
            value={ticket.status}
            onChange={handleInputChange}
          >
            <option value="todo">To-Do</option>
           
          </select>

          <div className="modal-actions">
            <button type="submit" className="modal-btn">
              {ticketToEdit ? 'Update Ticket' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
