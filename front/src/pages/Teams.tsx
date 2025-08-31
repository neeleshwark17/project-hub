import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  UserPlus,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AnimatedList, AnimatedItem } from '@/components/ui/animated-container';

// Mock team data
const mockTeamMembers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@acme.com',
    role: 'Project Manager',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random',
    status: 'active',
    joinDate: '2023-01-15',
    projects: 5,
    tasks: 12,
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@acme.com',
    role: 'Senior Developer',
    avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=random',
    status: 'active',
    joinDate: '2022-08-20',
    projects: 3,
    tasks: 8,
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@acme.com',
    role: 'UI/UX Designer',
    avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random',
    status: 'active',
    joinDate: '2023-03-10',
    projects: 4,
    tasks: 15,
  },
  {
    id: '4',
    name: 'Michael Chen',
    email: 'michael.chen@acme.com',
    role: 'Backend Developer',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random',
    status: 'active',
    joinDate: '2022-11-05',
    projects: 6,
    tasks: 20,
  },
  {
    id: '5',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@acme.com',
    role: 'QA Engineer',
    avatar: 'https://ui-avatars.com/api/?name=Lisa+Rodriguez&background=random',
    status: 'active',
    joinDate: '2023-02-28',
    projects: 2,
    tasks: 6,
  },
];

export default function Teams() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { organization } = useAuth();

  // Filter team members based on search and role
  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roles = ['Project Manager', 'Senior Developer', 'UI/UX Designer', 'Backend Developer', 'QA Engineer'];

  return (
    <div className="flex flex-col h-screen bg-gradient-surface">
      <Header 
        title="Team"
        subtitle={`${filteredMembers.length} team members in ${organization?.name || 'your organization'}`}
      />
      
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockTeamMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                Active team members
              </p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">12</div>
              <p className="text-xs text-muted-foreground">
                Across all teams
              </p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">61</div>
              <p className="text-xs text-muted-foreground">
                Assigned to team
              </p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">94%</div>
              <p className="text-xs text-muted-foreground">
                Task completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <Button variant="gradient">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>

        {/* Team Members Grid */}
        {filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || roleFilter !== 'all' 
                  ? 'No team members found' 
                  : 'No team members yet'
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || roleFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by inviting your first team member'
                }
              </p>
              {!searchQuery && roleFilter === 'all' && (
                <Button variant="gradient">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite First Member
                </Button>
              )}
            </div>
          </div>
        ) : (
          <AnimatedList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <AnimatedItem key={member.id}>
                <Card className="card-enhanced">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="mr-2 h-4 w-4" />
                        {member.email}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        Joined {new Date(member.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-primary">{member.projects}</div>
                        <div className="text-xs text-muted-foreground">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-accent">{member.tasks}</div>
                        <div className="text-xs text-muted-foreground">Tasks</div>
                      </div>
                      <div className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedItem>
            ))}
          </AnimatedList>
        )}
      </main>
    </div>
  );
}
