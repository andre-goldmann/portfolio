import type { Handle } from '@sveltejs/kit';
import * as dfd from "danfojs-node";
import { Document } from 'langchain/document';
import * as dotenv from "dotenv";
import {utils, Vector} from "@pinecone-database/pinecone";
import {embedder} from "./lib/server/recommender/article/embeddings";
import {getEnv} from "./lib/server/utils/util";
import loadCSVFile from "./lib/server/utils/csvLoader";
import {getPineconeClient} from "./lib/server/utils/pinecone";
import { sql } from 'drizzle-orm'
import {db} from "./lib/server/db";
import {sequence} from "@sveltejs/kit/hooks";

dotenv.config();
const { createIndexIfNotExists, chunkedUpsert } = utils;

interface ArticleRecord {
    index: number,
    title: string;
    article: string;
    publication: string;
    url: string;
    author: string;
    section: string;
}

async function embedAndUpsert(dataFrame: dfd.DataFrame,
                              chunkSize: number,
                              pineconeClient:any,
                              indexName:string) {
    const chunkGenerator = processInChunks<ArticleRecord, 'section' | 'url' | 'title' | 'publication' | 'author' | 'article', 'article'>(
        dataFrame,
        100,
        ['section', 'url', 'title', 'publication', 'author', 'article'],
        'article'
    );
    const index = pineconeClient.Index(indexName);

    for await (const documents of chunkGenerator) {
        await embedder.embedBatch(documents, chunkSize, async (embeddings: Vector[]) => {
            await chunkedUpsert(index, embeddings, "default");
            //progressBar.increment(embeddings.length);
        });
    }
}

async function getChunk(df: dfd.DataFrame, start: number, size: number): Promise<dfd.DataFrame> {
    // eslint-disable-next-line no-return-await
    return await df.head(start + size).tail(size);
}

async function* processInChunks<T, M extends keyof T, P extends keyof T>(
    dataFrame: dfd.DataFrame,
    chunkSize: number,
    metadataFields: M[],
    pageContentField: P
): AsyncGenerator<Document[]> {
    for (let i = 0; i < dataFrame.shape[0]; i += chunkSize) {
        const chunk = await getChunk(dataFrame, i, chunkSize);
        const records = dfd.toJSON(chunk) as T[];
        yield records.map((record: T) => {
            const metadata: Partial<Record<M, T[M]>> = {};
            for (const field of metadataFields) {
                metadata[field] = record[field];
            }
            return new Document({
                pageContent: record[pageContentField] as string,
                metadata,
            });
        });
    }
}

export const dataSetup: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);
    console.info("Setting Up-Data!");

    //const fileParts = await splitFile("./data/all-the-news-2-1.csv", 500000);
    //const firstFile = fileParts[0];
    //Error embedding text: undefined, TypeError: Cannot read properties of undefined (reading 'split')
    // TypeError: Cannot read properties of undefined (reading 'split')
    //https://components.one/datasets/
    const data = await loadCSVFile("./data/all-the-news-2-1.csv.2");
    const clean = data.dropNa() as dfd.DataFrame;
    clean.head().print();

    const indexName = getEnv("PINECONE_INDEX");
    const pineconeClient = await getPineconeClient();
    await createIndexIfNotExists(pineconeClient, indexName, 384);
    await embedder.init("Xenova/all-MiniLM-L6-v2");
    await embedAndUpsert(clean, 1, pineconeClient, indexName);
    console.info("Data Setup finished!")

    return response;
}


export const databasSetup: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);
    console.info("Setting Up-Database!");
    try {
        await db.execute(sql`CREATE TABLE IF NOT EXISTS orderflows (
                                                                   id SERIAL PRIMARY KEY,
                                                                   symbol varchar(20),
                                                                   ordertype varchar(255),
                                                                   price decimal,
                                                                   quantity int,
                                                                   timestamp TIMESTAMP DEFAULT NOW()
                      );`);
    } catch (error) {
        console.error(error);
        throw error;
    }

    return response;
}
// This function runs every time the SvelteKit server receives a request —
// whether that happens while the app is running, or during prerendering — and determines the response
//export const handle = sequence(queryData, databasSetup);
//export const handle = sequence(databasSetup);
