
import React, { useEffect, useState } from 'react';
import TreeBrowser from '../components/TreeBrowser';
import { Button } from '@/components/ui/button';
import { importTreeData, importCourseDetails } from '@/utils/importData';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [importingTree, setImportingTree] = useState(false);
  const [importingDetails, setImportingDetails] = useState(false);

  const handleImportTreeData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportingTree(true);
    try {
      const content = await file.text();
      const data = JSON.parse(content);
      
      const success = await importTreeData(data);
      
      if (success) {
        toast({
          title: "Success",
          description: "Course tree data imported successfully",
        });
        // Reload the page to show the new data
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Failed to import course tree data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error importing tree data:', error);
      toast({
        title: "Error",
        description: "Invalid JSON file format",
        variant: "destructive",
      });
    } finally {
      setImportingTree(false);
      // Clear the file input
      event.target.value = '';
    }
  };

  const handleImportCourseDetails = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportingDetails(true);
    try {
      const content = await file.text();
      const data = JSON.parse(content);
      
      const success = await importCourseDetails(data);
      
      if (success) {
        toast({
          title: "Success",
          description: "Course details imported successfully",
        });
        // Reload the page to show the new data
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Failed to import course details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error importing course details:', error);
      toast({
        title: "Error",
        description: "Invalid JSON file format",
        variant: "destructive",
      });
    } finally {
      setImportingDetails(false);
      // Clear the file input
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Data import buttons (admin feature) */}
      <div className="fixed top-4 right-4 z-20 flex gap-2">
        <div>
          <input
            type="file"
            id="tree-import"
            className="hidden"
            accept=".json"
            onChange={handleImportTreeData}
            disabled={importingTree}
          />
          <label htmlFor="tree-import">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              disabled={importingTree}
              asChild
            >
              <span>{importingTree ? 'Importing...' : 'Import Tree Data'}</span>
            </Button>
          </label>
        </div>
        
        <div>
          <input
            type="file"
            id="details-import"
            className="hidden"
            accept=".json"
            onChange={handleImportCourseDetails}
            disabled={importingDetails}
          />
          <label htmlFor="details-import">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              disabled={importingDetails}
              asChild
            >
              <span>{importingDetails ? 'Importing...' : 'Import Course Details'}</span>
            </Button>
          </label>
        </div>
      </div>

      <TreeBrowser />
    </div>
  );
};

export default Index;
