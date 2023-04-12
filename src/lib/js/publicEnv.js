// if you're looking at this file and thinking that I'm crazy to expose
// what should be environment variables, then chill. I've thought this through.
// even if I use SvelteKit's '$env/static/public', these variables are
// completely exposed. I can write a simple Java class that can get public
// environment variables from my home page. considering this, there's no point
// in hiding these two strings. I put them here so they can be accessed in my
// app when UnitPlayground is used as a library. this way I don't have to bundle
// anything. the database is protected with Row Level Security (RLS) policies.
// the worst someone can do is erase all of their OWN data, and I really couldn't
// care less about that.

export const supabaseUrl = 'https://ztxukfuiygdrjibccfzk.supabase.co'
export const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0eHVrZnVpeWdkcmppYmNjZnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAzODYyMTUsImV4cCI6MTk5NTk2MjIxNX0.gsADczUxLP9JHe4xM9yGYLqLvud-9vg935zWbSf5UcI'
