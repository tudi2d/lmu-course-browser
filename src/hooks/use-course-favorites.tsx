
import { useState, useEffect } from "react";
import { 
  fetchFavorites, 
  syncFavoritesOnLogin 
} from "@/services/courseService";
import { supabase } from "@/integrations/supabase/client";

export function useCourseFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  // Handle user authentication and favorite syncing
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const newUser = session?.user || null;
      setUser(newUser);
      
      // If a user just logged in, sync local favorites to the database
      if (newUser && !user) {
        syncFavoritesOnLogin(newUser.id)
          .then(() => {
            // After syncing, fetch the combined favorites
            return fetchFavorites();
          })
          .then(updatedFavorites => {
            setFavorites(updatedFavorites);
          })
          .catch(error => {
            console.error("Error syncing favorites:", error);
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUser = session?.user || null;
        if (event === 'SIGNED_IN' && newUser && !user) {
          syncFavoritesOnLogin(newUser.id)
            .then(() => {
              // After syncing, fetch the combined favorites
              return fetchFavorites();
            })
            .then(updatedFavorites => {
              setFavorites(updatedFavorites);
            })
            .catch(error => {
              console.error("Error syncing favorites:", error);
            });
        }
        setUser(newUser);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Load favorites
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const userFavorites = await fetchFavorites();
        console.log("Loaded favorites:", userFavorites);
        setFavorites(userFavorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    loadFavorites();
  }, []);

  return { favorites, user };
}
