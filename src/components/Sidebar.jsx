import React from "react";
import { FaTachometerAlt, FaTasks, FaCogs } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">ProjectHub</div>
      <nav>
        <ul>
          <li className="active"><FaTachometerAlt /> Dashboard</li>
          <li><FaTasks /> Project Management</li>
          <li><FaCogs /> Admin Settings</li>
        </ul>
      </nav>
      <div className="user-section">
        <div className="avatar">RG</div>
        <div>
          <strong>Rehana Gul</strong>
          <p>rehanagul@gmail.com</p>
        </div>
        <div className="actions">
          <button>Edit</button>
          <button>Logout</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;