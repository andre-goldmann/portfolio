import {db} from "$lib/server/db";
import {orderflow} from "$lib/server/schema";
import {OrderFlow} from "$lib/server/models";
import {sql} from "drizzle-orm";

export const actions = {
    get: async ({ request, cookies, fetch }) => {

        const formData = await request.formData();
        const symbol:string = formData.get("symbol") || "EURUSDT";
        //console.info("Symbol:" + symbol);
        //console.info("Depth:" + depth);

        let orderFlowEntity = await db.select().from(orderflow)
            .where(sql`${orderflow.symbol} = ${symbol}`)
            .orderBy(orderflow.price);;

        if(orderFlowEntity.values.length > 0) {
            let result = orderFlowEntity.all();

            let orderFlow: OrderFlow =  {
                asks: result.filter(e =>e.ordertype == "ask")
                    .sort((e1, e2) => e2.price - e1.price),
                highestAsk: result.filter(e =>e.ordertype == "ask")
                    .reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current),
                bids: result.filter(e =>e.ordertype == "bid")
                    .sort((e1, e2) => e2.price - e1.price),
                highestBid: result.filter(e =>e.ordertype == "bid")
                    .reduce((prev, current) => (prev.quantity > current.quantity) ? prev : current),
            }
            return {orderFlow};
        }
        return {};
    }
}


  