export async function load({ fetch, depends, locals }) {
	const { data: tokens } = await locals.supabase.from('tokens').select();
	return {
		tokens: tokens ?? []
	};
}
