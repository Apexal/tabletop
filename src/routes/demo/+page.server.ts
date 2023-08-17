import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/database.types';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';

export async function load({ fetch, depends, locals }) {
	const { data: tokens } = await locals.supabase.from('tokens').select();
	return {
		tokens: tokens ?? []
	};
}
