import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://cetuwhoumiszqvevafnn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldHV3aG91bWlzenF2ZXZhZm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNTA2MTIsImV4cCI6MjA3NjgyNjYxMn0.zKGYudNfK58hPUSEG93T5Z5sB7XvFot8fsxAouBm2Wk"
);
