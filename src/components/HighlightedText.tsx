
import React from 'react';

interface HighlightedTextProps {
  text: string;
  highlight: string;
  className?: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, highlight, className = '' }) => {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }
  
  // Escape special regex characters
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span className={className}>
      {parts.map((part, i) => (
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      ))}
    </span>
  );
};

export default HighlightedText;
