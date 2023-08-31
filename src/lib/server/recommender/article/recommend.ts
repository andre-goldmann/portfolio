import { ScoredVector } from "@pinecone-database/pinecone";

import {embedder} from "./embeddings";
import {getEnv} from "../../utils/util";
import {getPineconeClient} from "../../utils/pinecone";

const indexName = getEnv("PINECONE_INDEX");

export interface Article{
    title: string,
    content: string,
    publication: string
    section: string
}


// A couple of functions to calculate mean vector
const mean = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length;
const meanVector = (vectors: number[][]): number[] => {
    const { length } = vectors[0];

    return Array.from({ length }).map((_, i) =>
        mean(vectors.map(vec => vec[i]))
    );
};

//--query="tennis" --section="Sports"
export async function recommend(query:string, section:string){
    const pineconeClient = await getPineconeClient();
    const pineconeIndex = pineconeClient.Index(indexName);

    // We create a simulated a user with an interest given a query and a specific section
    await embedder.init("Xenova/all-MiniLM-L6-v2");
    const queryEmbedding = await embedder.embed(query);

    const queryResult = await pineconeIndex.query({
        queryRequest: {
            vector: queryEmbedding.values,
            includeMetadata: true,
            includeValues: true,
            namespace: "default",
            filter: {
                section: { "$eq": section }
            },
            topK: 10
        }
    });

    // We extract the vectors of the results
    const userVectors = queryResult?.matches?.map((result: ScoredVector) => result.values as number[]);

    // We calculate the mean vector of the results
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const meanVec = meanVector(userVectors!);

    // We query the index with the mean vector to get recommendations for the user
    const recommendations = await pineconeIndex.query({
        queryRequest: {
            vector: meanVec,
            includeMetadata: true,
            includeValues: true,
            namespace: "default",
            topK: 10
        }
    });

    let userPreferences: Article[] = [];
    let userRecommendations: Article[] = [];

    queryResult?.matches?.slice(0, 10).forEach((result: any) => {
        const { title, article, publication, section } = result.metadata;
        const entry = {
            title: title,
            content: article,//`${article.slice(0, 70)}...`,
            publication: publication,
            section: section
        };
        userPreferences.push(entry);
    });

    recommendations?.matches?.slice(0, 10).forEach((result: any) => {
        const { title, article, publication, section } = result.metadata;
        const entry:Article = {
            title: title,
            content: article,//`${article.slice(0, 70)}...`,
            publication: publication,
            section: section
        };
        userRecommendations.push(entry);
    });
    //console.log("=========== Recommendations ==========");
    //userRecommendations.printTable();
    //console.info(userPreferences);
    //console.info("#######")
    //console.info(userRecommendations);
    const result: Article[] = [];
    result.push(...userPreferences);
    result.push(...userRecommendations);
    return result;
}
