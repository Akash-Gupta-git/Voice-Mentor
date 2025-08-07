import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { FaPlus, FaTimes, FaCommentDots, FaUserCircle, FaCog, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../css/App.css"; // Ensure this path is correct if not already there

const USER_EMAIL = "akashgupta01082002@gmail.com";






const Sidebar = ({ isOpen, toggleSidebar, onNewChat, conversations, onSelectChat, activeChatId }) => {

    const {logout } = useAuth();
    const USER_EMAIL = "akashgupta01082002@gmail.com";
    const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); 
       toast.success("Logout successful!");
      navigate('/'); 
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.");
    }
  };

    return (
        <div className={`sidebar ${isOpen ? 'active' : ''}`}>
            {/* Close button for mobile sidebar, only appears when sidebar is open */}
            {isOpen && (
                <Button variant="link" className="sidebar-close-btn d-lg-none" onClick={toggleSidebar} aria-label="Close Sidebar">
                    <FaTimes size={24} color="#333" />
                </Button>
            )}

            <div className="sidebar-header">
                <Button className="new-chat-btn" onClick={onNewChat} title="Start New Chat">
                    <FaPlus size={18} className="sidebar-icon" /> <span className="sidebar-text">New Chat</span>
                </Button>
            </div>
            <div className="sidebar-chats">
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        className={`sidebar-chat-item ${conv.id === activeChatId ? 'active' : ''}`}
                        onClick={() => onSelectChat(conv.id)}
                    >
                        <FaCommentDots size={16} className="sidebar-icon" />
                        <span className="sidebar-text">{conv.title}</span>
                    </div>
                ))}
            </div>
            <div className="sidebar-footer">
                {/* Settings and Help Dropdown */}
                <Dropdown drop="up" className="w-100">
                    <Dropdown.Toggle variant="light" id="dropdown-settings-help" className="w-100 d-flex align-items-center">
                        <FaCog className="sidebar-icon" />
                        <span className="sidebar-text">Settings & Help</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/privacy-policy">Privacy Policy</Dropdown.Item>
                        <Dropdown.Item href="#/activity">Activity</Dropdown.Item>
                        <Dropdown.Item href="#/terms-of-service">Terms of Service</Dropdown.Item>
                        <Dropdown.Item href="#/help">Help & Support</Dropdown.Item>
                        {/* <Dropdown.Divider />
                        <Dropdown.Item href="/login" onClick={handleLogout}>Logout</Dropdown.Item> */}
                    </Dropdown.Menu>
                </Dropdown>
                <span onClick={handleLogout}  className="logoutBtn w-100 ">
                    <FaSignOutAlt className="sidebar-icon" />
                        <span className="sidebar-text">Logout</span>
                </span>

               
            </div>
        </div>
    );
};

export default Sidebar;