
import React from "react";

interface GenericJSONTabProps {
  title: string;
  data: any;
}

export const GenericJSONTab: React.FC<GenericJSONTabProps> = ({ title, data }) => {
  return (
    <div className="prose prose-sm max-w-none">
      <h2 className="text-lg font-medium mb-3">{title}</h2>
      <div className="space-y-2">
        {Array.isArray(data) ? (
          data.map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded text-sm">
              {typeof item === 'string' ? item : JSON.stringify(item)}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Information is not available in a readable format.
          </p>
        )}
      </div>
    </div>
  );
};
