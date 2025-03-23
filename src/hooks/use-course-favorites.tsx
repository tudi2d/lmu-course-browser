import { useState, useEffect, useCallback } from "react";
import { 
  fetchFavorites, 
  syncFavoritesOnLogin,
  addFavorite as addFavoriteService,
  removeFavorite as removeFavoriteService
} from "@/services/favorites/favoriteService";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useCourseFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Auth session check:", session ? "User logged in" : "No user");
      const newUser = session?.user || null;
      setUser(newUser);
      
      if (newUser && !user) {
        syncFavoritesOnLogin(newUser.id)
          .then(() => {
            return fetchFavorites();
          })
          .then(updatedFavorites => {
            console.log("After login sync, updated favorites:", updatedFavorites);
            setFavorites(updatedFavorites);
          })
          .catch(error => {
            console.error("Error syncing favorites:", error);
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        const newUser = session?.user || null;
        if (event === 'SIGNED_IN' && newUser && !user) {
          syncFavoritesOnLogin(newUser.id)
            .then(() => {
              return fetchFavorites();
            })
            .then(updatedFavorites => {
              console.log("After sign-in, updated favorites:", updatedFavorites);
              setFavorites(updatedFavorites);
            })
            .catch(error => {
              console.error("Error syncing favorites:", error);
            });
        } else if (event === 'SIGNED_OUT') {
          fetchFavorites().then(localFavorites => {
            console.log("After sign-out, local favorites:", localFavorites);
            setFavorites(localFavorites);
          });
        }
        setUser(newUser);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        const userFavorites = await fetchFavorites();
        console.log("Loaded favorites:", userFavorites);
        setFavorites(userFavorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
        toast({
          title: "Error loading favorites",
          description: "Could not load your favorite courses.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const addFavoriteWithStateUpdate = useCallback(async (courseId: string, courseName: string) => {
    const success = await addFavoriteService(courseId, courseName);
    if (success) {
      setFavorites(prev => {
        if (!prev.includes(courseId)) {
          return [...prev, courseId];
        }
        return prev;
      });
      toast({
        title: "Added to favorites",
        description: `"${courseName}" added to your favorites.`,
        variant: "default",
      });
      return true;
    } else {
      toast({
        title: "Failed to add favorite",
        description: "Could not add the course to favorites.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const removeFavoriteWithStateUpdate = useCallback(async (courseId: string, courseName: string) => {
    const success = await removeFavoriteService(courseId);
    if (success) {
      setFavorites(prev => prev.filter(id => id !== courseId));
      toast({
        title: "Removed from favorites",
        description: `"${courseName}" removed from your favorites.`,
        variant: "default",
      });
      return true;
    } else {
      toast({
        title: "Failed to remove favorite",
        description: "Could not remove the course from favorites.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  return { 
    favorites, 
    user, 
    loading,
    addFavorite: addFavoriteWithStateUpdate,
    removeFavorite: removeFavoriteWithStateUpdate,
    isFavorite: useCallback((courseId: string) => favorites.includes(courseId), [favorites])
  };
}
