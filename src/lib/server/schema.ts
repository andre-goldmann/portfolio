import {pgTable, integer, text, real} from "drizzle-orm/pg-core";
import type { InferInsertModel, InferSelectModel} from 'drizzle-orm';
export const orderflow = pgTable('orderflows', {
    symbol: text('symbol'),
    ordertype: text('ordertype'),
    price: real('price'),
    quantity: integer('quantity')
});

export type SelectEntity = InferSelectModel<typeof orderflow>;
export type InsertEntity = InferInsertModel<typeof orderflow>;
