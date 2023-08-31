import {drizzle, PostgresJsDatabase} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import {getEnv} from "./utils/util";
import {Decimal} from "decimal.js";
import {CronJob} from "cron";
import {sql} from "drizzle-orm";
import type {LevelData, OrderFlowDefinition} from "./models";
import {orderflow} from "./schema";

config({ path: '.env' });

const queryClient = postgres(getEnv("POSTGRES_URL"));
export const db: PostgresJsDatabase = drizzle(queryClient);


function aggregateLevels(levels_df: LevelData[], agg_level: Decimal = new Decimal('0.0001'), side: string = 'bid'): LevelData[] {

    let label_func: (x: { left: number; right: number }) => number;

    if (side === 'bid') {
        label_func = (x) => x.left;
    } else if (side === 'ask') {
        label_func = (x) => x.right;
    } else {
        throw new Error(`Invalid side value: ${side}`);
    }

    const min_price:number = Math.min(...levels_df.map((level:LevelData) => level.price));
    const max_price:number = Math.max(...levels_df.map((level:LevelData) => level.price));

    const min_level:number = new Decimal(min_price)
        .dividedBy(agg_level)
        .minus(1)
        .times(agg_level)
        .toNumber();
    const max_level:number = new Decimal(max_price)
        .dividedBy(agg_level)
        .plus(1)
        .times(agg_level)
        .toNumber();

    const level_bounds: number[] = [];
    for (let x:number = 0; x <= (max_level - min_level) / agg_level.toNumber(); x++) {
        level_bounds.push(new Decimal(min_level).plus(agg_level.times(x)).toNumber());
    }

    const bid_levels_df:{bid:number | undefined, price: number, quantity: number}[] = levels_df.map((level:LevelData) => ({
        ...level,
        bid: level_bounds.find((bound:number) => level.price >= bound && level.price < bound + agg_level.toNumber()),
    }));

    const grouped_levels:LevelData[] = Object.values(
        bid_levels_df.reduce((acc, level:{bid:number | undefined, price: number, quantity: number}) => {
            if(level.bid) {
                const key:number = level.bid;
                if (!acc[key]) {
                    acc[key] = {bid: level.bid, quantity: 0};
                }
                acc[key].quantity += parseInt(level.quantity);
                return acc;
            }
            return {
                price:0,
                quantity:0
            }
        }, {})
    );

    const filtered_levels:LevelData[] = grouped_levels.filter((level:LevelData):boolean => level.quantity > 0);

    return filtered_levels.map((level:LevelData):{price: number, quantity: number} => ({
        price: label_func({left: level.bid, right: level.bid}),
        quantity: parseInt(level.quantity),
    }));
}

async function manuallTransform(requestData, symbol:string):Promise<void> {

    const asksTemp:LevelData[] = requestData['asks'];
    const asks:LevelData[] = [];
    asksTemp.forEach(e => {
        const ask:LevelData = {
            price: e[0],
            quantity: parseInt(e[1])
        }
        asks.push(ask);
    });
    const aggregateAsks:LevelData[] = aggregateLevels(asks,new Decimal('0.0001'), 'ask' );
    const filteredAsks:LevelData[] = aggregateAsks.filter((value) => value.price > 1.0);
    filteredAsks.sort((a,b) => b.quantity - a.quantity);

    const storedAsk = await db.select().from(orderflow)
        .where(sql`${orderflow.symbol} = ${symbol} and ${orderflow.ordertype} = 'ask' and ${orderflow.price} = ${filteredAsks[0].price}`);

    if(storedAsk && storedAsk.length == 0) {
        console.info("Found " + storedAsk.values.length + " entries for ");
        console.info(`symbol = ${symbol}, ordertype: "ask", price: ${filteredAsks[0].price}, quantity: ${filteredAsks[0].quantity}`)
        await db.insert(orderflow).values({
            symbol: symbol,
            ordertype: "ask",
            price: filteredAsks[0].price,
            quantity: filteredAsks[0].quantity
        }).returning();

    } else {
        console.info("Entries for " + Object.keys(filteredAsks[0]) + " allready stored, maybe update them.");
        const stored =  await db.select().from(orderflow)
            .where(sql`${orderflow.symbol} = ${symbol} and ${orderflow.ordertype} = 'ask' and ${orderflow.price} = ${filteredAsks[0].price}`);
        console.info("Actual quantity: " + filteredAsks[0].quantity + ", stored quantity: " + stored[0])
    }


    const bidsTemp:LevelData[] = requestData['bids'];
    const bids:LevelData[] = [];
    bidsTemp.forEach((e:LevelData) => {
        let bid:LevelData = {
            price: e[0],
            quantity: parseInt(e[1])
        }
        bids.push(bid);
    });
    const aggregateBids:LevelData[] = aggregateLevels(bids);
    const filteredBids:LevelData[] = aggregateBids.filter((value) => value.price > 1.0);
    filteredBids.sort((a,b) => b.quantity - a.quantity);

    const storedBid = await db.select().from(orderflow)
        .where(sql`${orderflow.symbol} = ${symbol} and ${orderflow.ordertype} = 'bid' and ${orderflow.price} = ${filteredBids[0].price}`);

    if(storedBid && storedBid.length == 0) {
        console.info("Found " + storedAsk.values.length + " entries for ");
        console.info(`symbol = ${symbol}, ordertype: "bid", price: ${filteredBids[0].price}, quantity: ${filteredBids[0].quantity}`)
        await db.insert(orderflow).values({
            symbol: symbol,
            ordertype: "bid",
            price: filteredBids[0].price,
            quantity: filteredBids[0].quantity
        }).returning();
    } else {
        console.info("Entries for " + Object.keys(filteredBids[0]) + " allready stored, maybe update them.");
        const stored =  await db.select().from(orderflow)
            .where(sql`${orderflow.symbol} = ${symbol} and ${orderflow.ordertype} = 'bid' and ${orderflow.price} = ${filteredBids[0].price}`);
        console.info("Actual quantity: " + filteredBids[0].quantity + ", stored quantity: " + stored[0])
    }

}

const orderFlowStoreJob = new CronJob(
    '*/60 * * * *',
    function() {

        fetch("https://api.binance.com/api/v3/depth?symbol=EURUSDT&limit=1000")
            .then(response => response.json())
            .then(result => manuallTransform(result, "EURUSDT"))

        fetch("https://api.binance.com/api/v3/depth?symbol=GBPUSDT&limit=1000")
            .then(response => response.json())
            .then(result => manuallTransform(result, "GBPUSDT"))

        console.log('last updated at ' +  new Date().toLocaleString());

    },
    null,
    true,
    'America/Los_Angeles'
);
orderFlowStoreJob.start(); //- See note below when to use this
console.info("##################### orderFlowStoreJob started #################");

const orderFlowDeleteJob = new CronJob(
    '0 0 * * *',
    function() {

        db.delete(orderflow);
        console.log('Deleted oderflows at ' +  new Date().toLocaleString());

    },
    null,
    true,
    'America/Los_Angeles'
);
orderFlowDeleteJob.start();
console.info("##################### orderFlowDeleteJob started #################");
