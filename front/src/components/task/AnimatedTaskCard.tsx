import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { Task, TaskStatus } from '@/types';

interface AnimatedTaskCardProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onStatusChange?: (task: Task, status: TaskStatus) => void;
  index?: number;
}

export function AnimatedTaskCard({ 
  task, 
  onView, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  index = 0 
}: AnimatedTaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{
        y: -2,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      layout
    >
      <TaskCard
        task={task}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </motion.div>
  );
}
