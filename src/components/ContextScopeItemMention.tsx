import React from 'react';
import { Clock } from 'lucide-react';

interface ContextScopeItemMentionProps {
  item: string;
}

const ContextScopeItemMention: React.FC<ContextScopeItemMentionProps> = ({ item }) => {
  return (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded-md text-blue-800">
      <Clock className="w-4 h-4 mr-1" />
      <p>This is a placeholder for @contextScopeItemMention for: {item}</p>
      <p>Please define its specific functionality.</p>
    </div>
  );
};

export default ContextScopeItemMention;
