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
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} 
      >
        <button className="close-btn" onClick={closeModal} aria-label="Close modal">X</button>
        <h2>{ticketToEdit ? 'Edit Ticket' : 'Create New Ticket'}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            className="modal-input"
            type="text"
            id="title"
            name="title"
            value={ticket.title}
            onChange={handleInputChange}
            required
            placeholder="Enter title..."
          />

          <label htmlFor="description">Description</label>
          <textarea
            className="modal-textarea"
            id="description"
            name="description"
            value={ticket.description}
            onChange={handleInputChange}
            required
            placeholder="Add a detailed description..."
          />

          <label htmlFor="status">Status</label>
          <select
            className="modal-select"
            id="status"
            name="status"
            value={ticket.status}
            onChange={handleInputChange}
          >
            <option value="todo">To-Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Completed</option>
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
