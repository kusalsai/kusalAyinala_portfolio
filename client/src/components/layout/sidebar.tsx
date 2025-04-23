import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  FileTextIcon,
  HomeIcon,
  LayoutDashboardIcon,
  UsersIcon,
  Database,
  Computer,
  Search,
  SettingsIcon,
  Users2Icon,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [location] = useLocation();

  const navItems = [
    {
      label: "Main",
      items: [
        {
          icon: <LayoutDashboardIcon className="h-4 w-4" />,
          label: "Dashboard",
          href: "/",
        },
        {
          icon: <CalendarIcon className="h-4 w-4" />,
          label: "Calendar",
          href: "/calendar",
        },
        {
          icon: <UsersIcon className="h-4 w-4" />,
          label: "Clients",
          href: "/clients",
        },
        {
          icon: <FileTextIcon className="h-4 w-4" />,
          label: "Reports",
          href: "/reports",
        },
      ],
    },
    {
      label: "Integrations",
      items: [
        {
          icon: <Database className="h-4 w-4" />,
          label: "Salesforce",
          href: "/integrations/salesforce",
        },
        {
          icon: <Computer className="h-4 w-4" />,
          label: "MS Dynamics",
          href: "/integrations/ms-dynamics",
        },
        {
          icon: <Search className="h-4 w-4" />,
          label: "Google Calendar",
          href: "/integrations/google-calendar",
        },
      ],
    },
    {
      label: "Settings",
      items: [
        {
          icon: <SettingsIcon className="h-4 w-4" />,
          label: "Preferences",
          href: "/settings/preferences",
        },
        {
          icon: <Users2Icon className="h-4 w-4" />,
          label: "Team Access",
          href: "/settings/team-access",
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "bg-primary text-white h-full transition-all duration-300 ease-in-out overflow-y-auto z-40",
        isOpen ? "w-64 md:block" : "w-0 hidden"
      )}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="text-accent h-5 w-5" />
          <h1 className="text-xl font-bold">ExecMeet</h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">Executive Meeting Management</p>
      </div>

      <nav className="p-4">
        {navItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <p className="text-xs uppercase text-gray-400 font-medium tracking-wider mb-2">
              {section.label}
            </p>
            <ul className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <Link href={item.href}>
                    <a
                      className={cn(
                        "flex items-center space-x-3 p-2 rounded-lg transition-colors",
                        location === item.href
                          ? "bg-gray-800 bg-opacity-40"
                          : "hover:bg-gray-800 hover:bg-opacity-40"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
