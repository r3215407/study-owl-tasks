import React from 'react';

interface TaskItemProps {
  task: {
    id: string;
    name: string;
    completed: boolean;
  };
  onToggleComplete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
      <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
        {task.name}
      </span>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        className="form-checkbox h-5 w-5 text-blue-600"
      />
    </div>
  );
};

export default TaskItem;
