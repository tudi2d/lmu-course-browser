import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchFavorites } from "@/services/courseService";
import { useEffect } from "react";

interface CalendarModalProps {
  showButton?: boolean;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ showButton = true }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const userFavorites = await fetchFavorites();
        setFavorites(userFavorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    loadFavorites();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {showButton && (
          <Button variant="outline" size="sm" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Your Course Calendar</DialogTitle>
          <DialogDescription>
            View your favorite courses in a calendar format
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <TabsContent value="day" className="pt-4">
            <div className="h-[400px] border rounded-md p-4 flex items-center justify-center">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Daily View</h3>
                {favorites.length > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Your daily schedule will appear here
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add some favorite courses to see them in your calendar
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="week" className="pt-4">
            <div className="h-[400px] border rounded-md p-4 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Weekly View</h3>
                {favorites.length > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Your weekly schedule will appear here
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add some favorite courses to see them in your calendar
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="month" className="pt-4">
            <div className="h-[400px] border rounded-md p-4 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Monthly View</h3>
                {favorites.length > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Your monthly schedule will appear here
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Add some favorite courses to see them in your calendar
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal;
