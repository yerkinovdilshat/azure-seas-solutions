import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CatalogBadgeProps {
  isCtKz: boolean;
  className?: string;
}

const CatalogBadge: React.FC<CatalogBadgeProps> = ({ isCtKz, className = '' }) => {
  if (!isCtKz) return null;

  return (
    <Badge 
      variant="secondary" 
      className={`bg-primary/10 text-primary border-primary/20 ${className} inline-flex items-center gap-1.5`}
    >
      <img 
        src="/ctkz.svg" 
        alt="CT-KZ" 
        className="w-4 h-4"
        onError={(e) => {
          // Fallback to text if image fails to load
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling!.textContent = 'CT-KZ';
        }}
      />
      <span>CT-KZ</span>
    </Badge>
  );
};

export default CatalogBadge;