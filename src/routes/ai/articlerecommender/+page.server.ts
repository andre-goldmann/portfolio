import type { Actions } from './$types';
import {config} from "dotenv";
import {recommend} from "../../../lib/server/recommender/article/recommend";

config({ path: '.env' });

export const actions = {
	post: async ({ request }) => {

        const form = await request.formData();
        const query = form.get('query');
        const section = form.get('section');
        console.info(`Do search with query=${query} and section=${section}`)
        return await recommend(query, section);
	}
} satisfies Actions;
