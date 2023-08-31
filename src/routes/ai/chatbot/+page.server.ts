import type { Actions } from './$types';
import {config} from "dotenv";
import {recommend} from "../../../lib/server/recommender/article/recommend";
import {chat} from "../../../lib/server/chat/chat";

config({ path: '.env' });

export const actions = {
	post: async ({ request }) => {

        const form = await request.formData();
        const query = form.get('query');
        console.info(`Do chat with query=${query}`)
        return await chat(query);
	}
} satisfies Actions;
