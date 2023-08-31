import {db} from "$lib/server/db";
import {orderflow} from "$lib/server/schema";
import {sql} from "drizzle-orm";
import {OrderFlow} from "$lib/server/models";
import type { PageServerLoad } from './$types';

export const load:PageServerLoad = async ({ cookies, fetch }) => {

    const symbol = "EURUSDT";

    const orderFlowEntity = await db.select().from(orderflow)
        .where(sql`${orderflow.symbol} = ${symbol}`)
        .orderBy(orderflow.price);
    console.info(`found ${orderFlowEntity.length} entries in total`)
    if(orderFlowEntity.length > 0) {

        const orderFlow:OrderFlow =  {
            asks: orderFlowEntity.filter(e =>e.ordertype == "ask")
                .sort((e1, e2) => e2.price - e1.price),
            highestAsk: orderFlowEntity.filter(e =>e.ordertype == "ask")
                .reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current),
            bids: orderFlowEntity.filter(e =>e.ordertype == "bid")
                .sort((e1, e2) => e2.price - e1.price),
            highestBid: orderFlowEntity.filter(e =>e.ordertype == "bid")
                .reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current),
        }
        return {orderFlow};
    }
    return {};

}


// export const actions = {
//     get: async ({ request, cookies, fetch }) => {
//
//         const formData = await request.formData();
//         const symbol:string = formData.get("symbol") || "EURUSDT";
//         //console.info("Symbol:" + symbol);
//         //console.info("Depth:" + depth);
//
//         let orderFlowEntity = await db.select().from(orderflow)
//             .where(sql`${orderflow.symbol} = ${symbol}`)
//             .orderBy(orderflow.price);;
//
//         if(orderFlowEntity.values.length > 0) {
//             let result = orderFlowEntity.all();
//
//             let orderFlow: OrderFlow =  {
//                 asks: result.filter(e =>e.ordertype == "ask")
//                     .sort((e1, e2) => e2.price - e1.price),
//                 highestAsk: result.filter(e =>e.ordertype == "ask")
//                     .reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current),
//                 bids: result.filter(e =>e.ordertype == "bid")
//                     .sort((e1, e2) => e2.price - e1.price),
//                 highestBid: result.filter(e =>e.ordertype == "bid")
//                     .reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current),
//             }
//             return {orderFlow};
//         }
//         return {};
//     }
// }
