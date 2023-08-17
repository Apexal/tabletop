import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	'https://bgmdtlxsakaihinhnjcv.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbWR0bHhzYWthaWhpbmhuamN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE2MTY2NjEsImV4cCI6MjAwNzE5MjY2MX0.LroM3enT8HnWDudIwyMAm0EHiDOdwN4tSAbnuzJ2rPA'
);
