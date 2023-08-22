import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
    return {
        posts: ["1", "2"],
    };
};