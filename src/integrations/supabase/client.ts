
// This file is automatically generated. Do not edit it directly.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://jttwsqsfzuzccjeefmfr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0dHdzcXNmenV6Y2NqZWVmbWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NTI5OTMsImV4cCI6MjA1ODIyODk5M30.AZT2cFjtpLgNj9B1kZvnfpWZdSSDBW8T05Bh3M9wwYo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
