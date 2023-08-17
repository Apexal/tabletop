import { supabase } from '$lib/supabaseClient';

export async function load() {
	const { data } = await supabase.from('tokens').select();
	return {
		tokens: data ?? []
	};
}
