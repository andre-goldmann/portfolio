import type { LayoutServerLoad } from './$types';
import {config} from "dotenv";

config({ path: '.env' });
export const load: LayoutServerLoad = async () => {
        return {
                posts: ["1", "2"],
        };
};




