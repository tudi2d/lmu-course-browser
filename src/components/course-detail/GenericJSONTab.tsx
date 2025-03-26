
import React from "react";

interface GenericJSONTabProps {
  title: string;
  data: any;
}

export const GenericJSONTab: React.FC<GenericJSONTabProps> = ({ title, data }) => {
  // Don't render if no data or empty array
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  const renderValue = (value: any) => {
    if (value === null || value === undefined) {
      return null;
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    if (typeof value === 'object' && Object.keys(value).length > 0) {
      return (
        <div className="space-y-1 pl-3 border-l-2 border-gray-200">
          {Object.entries(value).map(([key, propValue]) => {
            if (propValue === null || propValue === undefined) return null;
            return (
              <div key={key} className="text-sm">
                <span className="font-medium text-gray-700">{key}: </span>
                {typeof propValue === 'object' ? (
                  renderValue(propValue)
                ) : (
                  <span className="text-gray-600">{String(propValue)}</span>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    
    return String(value);
  };

  return (
    <div className="prose prose-sm max-w-none">
      <h2 className="text-lg font-medium mb-3">{title}</h2>
      <div className="space-y-4">
        {Array.isArray(data) ? (
          data.map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded text-sm border">
              {renderValue(item)}
            </div>
          ))
        ) : (
          <div className="bg-gray-50 p-4 rounded text-sm border">
            {renderValue(data)}
          </div>
        )}
      </div>
    </div>
  );
};
