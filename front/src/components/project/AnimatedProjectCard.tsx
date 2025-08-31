import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { Project } from '@/types';

interface AnimatedProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  index?: number;
}

export function AnimatedProjectCard({ 
  project, 
  onView, 
  onEdit, 
  onDelete, 
  index = 0 
}: AnimatedProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.9 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      layout
    >
      <ProjectCard
        project={project}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </motion.div>
  );
}
