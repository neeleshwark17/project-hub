import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Settings, 
  ChevronLeft,
  Plus,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CreateProjectModal } from '@/components/project/CreateProjectModal';

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div 
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                {/* <span className="text-white font-bold text-sm">PM</span> */}
                <img src="/favicon.png" alt="ProjectHub" className="w-8 h-8" />
              </div>
              <span className="font-semibold text-sidebar-foreground">ProjectHub</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft className={cn("transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
            <Input 
              placeholder="Search..." 
              className="pl-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isCurrent = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={isCurrent ? "accent" : "ghost"}
              className={cn(
                "w-full justify-start h-10 text-sidebar-foreground hover:bg-sidebar-accent",
                collapsed && "justify-center px-2",
                isCurrent && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              )}
              onClick={() => navigate(item.href)}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Button>
          );
        })}
      </nav>

      {/* New Project Button */}
      <div className="p-4 border-t border-sidebar-border">
        <CreateProjectModal
          trigger={
            <Button 
              variant="gradient" 
              className={cn(
                "w-full",
                collapsed && "px-2"
              )}
            >
              <Plus className="h-4 w-4" />
              {!collapsed && <span className="ml-2">New Project</span>}
            </Button>
          }
        />
      </div>
    </div>
  );
}