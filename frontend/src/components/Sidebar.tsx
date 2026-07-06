import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquareText, BrainCircuit } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Documents', path: '/documents', icon: <FileText size={20} /> },
    { name: 'Ask AI', path: '/chat', icon: <MessageSquareText size={20} /> },
  ];

  return (
    <aside className="hidden w-64 overflow-y-auto bg-gray-900 lg:block border-r border-gray-800 shadow-xl">
      <div className="flex items-center justify-center py-6 px-4">
        <div className="flex items-center space-x-2 text-white">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BrainCircuit size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">AI Assistant</span>
        </div>
      </div>
      <nav className="mt-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
