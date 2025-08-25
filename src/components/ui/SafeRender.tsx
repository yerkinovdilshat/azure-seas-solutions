import React from 'react';

interface SafeRenderProps {
  data: any;
  fallback?: string;
  className?: string;
}

/**
 * SafeRender component prevents "[object Object]" rendering by checking if data is an object
 * and providing appropriate fallbacks or rendering the correct field
 */
export const SafeRender: React.FC<SafeRenderProps> = ({ 
  data, 
  fallback = '', 
  className 
}) => {
  // Handle null, undefined, or empty values
  if (!data || data === '') {
    return <span className={className}>{fallback}</span>;
  }

  // If it's a string or number, render directly
  if (typeof data === 'string' || typeof data === 'number') {
    return <span className={className}>{data}</span>;
  }

  // If it's an object, warn in development and return fallback
  if (typeof data === 'object') {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[SafeRender] Object passed to text node:', data);
    }
    
    // Try to extract common text fields
    if (data.text) return <span className={className}>{data.text}</span>;
    if (data.title) return <span className={className}>{data.title}</span>;
    if (data.name) return <span className={className}>{data.name}</span>;
    if (data.description) return <span className={className}>{data.description}</span>;
    
    // Try to stringify if it's a simple object
    try {
      const stringified = JSON.stringify(data);
      if (stringified.length < 100) {
        return <span className={className}>{stringified}</span>;
      }
    } catch (e) {
      // JSON.stringify failed, use fallback
    }
    
    return <span className={className}>{fallback || 'Content unavailable'}</span>;
  }

  // For any other type, convert to string
  return <span className={className}>{String(data)}</span>;
};

/**
 * Hook to safely render objects in text nodes
 */
export const useSafeRender = () => {
  return (data: any, fallback?: string): string => {
    if (!data || data === '') return fallback || '';
    if (typeof data === 'string' || typeof data === 'number') return String(data);
    
    if (typeof data === 'object') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[useSafeRender] Object passed to text node:', data);
      }
      
      if (data.text) return data.text;
      if (data.title) return data.title;
      if (data.name) return data.name;
      if (data.description) return data.description;
      
      return fallback || 'Content unavailable';
    }
    
    return String(data);
  };
};