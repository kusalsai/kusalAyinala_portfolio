import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";
import { Bell, Menu, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const isMobile = useMobile();
  const { toast } = useToast();
  const [location] = useLocation();
  
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/calendar":
        return "Calendar";
      case "/clients":
        return "Clients";
      case "/reports":
        return "Reports";
      default:
        return "Dashboard";
    }
  };

  const handleNotificationClick = () => {
    toast({
      title: "You have 3 new notifications",
      description: "Check your upcoming meetings and follow-ups.",
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden mr-2"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          <div>
            <h2 className="text-lg font-semibold">{getPageTitle()}</h2>
            <p className="text-sm text-gray-500">Welcome back, Sarah</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden md:inline-block">Sarah Johnson</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
