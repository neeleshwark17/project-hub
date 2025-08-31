import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateProject } from '@/hooks/use-graphql';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProjectStatus } from '@/types';

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Project name must be less than 100 characters"),
  description: z.string().optional(),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'archived']),
  dueDate: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface CreateProjectModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateProjectModal({ trigger, onSuccess }: CreateProjectModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { organization, user, isAuthenticated } = useAuth();
  const { createProject, loading } = useCreateProject();

  // Debug logging
  console.log('CreateProjectModal - Auth Context:', {
    organization,
    user,
    isAuthenticated,
    hasOrgSlug: !!organization?.slug
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "planning",
      dueDate: "",
    },
  });

  const handleSubmit = async (data: ProjectFormData) => {
    if (!isAuthenticated) {
      console.error("User not authenticated");
      return;
    }

    if (!organization?.slug) {
      console.error("No organization context available");
      return;
    }

    try {
      await createProject({
        variables: {
          name: data.name,
          description: data.description || undefined,
          status: data.status,
          dueDate: data.dueDate || undefined,
          organizationSlug: organization.slug,
        },
      });
      
      // Reset form and close modal
      form.reset();
      setIsOpen(false);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating project:", error);
      // Error handling is done in the hook
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="gradient" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter project name" 
                      {...field} 
                      disabled={loading || !organization?.slug || !isAuthenticated}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter project description (optional)" 
                      {...field} 
                      disabled={loading || !organization?.slug || !isAuthenticated}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading || !organization?.slug || !isAuthenticated}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        disabled={loading || !organization?.slug || !isAuthenticated}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!isAuthenticated ? (
              <div className="text-sm text-destructive">
                Error: You must be logged in to create projects.
              </div>
            ) : !organization ? (
              <div className="text-sm text-destructive">
                Error: No organization context available. Please refresh the page.
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Creating project for organization: <span className="font-medium">{organization.name}</span>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !organization?.slug || !isAuthenticated}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
