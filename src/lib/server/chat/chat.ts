import { PineconeStore } from "langchain/vectorstores/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChainTool } from "langchain/tools";

import {getEnv} from "../utils/util";
import {HuggingFaceInference} from "langchain/llms";
import {getPineconeClient} from "../utils/pinecone";
import {TransformersJSEmbedding} from "../recommender/article/embeddings";
import {Ollama} from "langchain/llms/ollama";

const indexName = getEnv("PINECONE_INDEX");


// const vectorStoreSearchResult = await vectorStore.similaritySearch("when was the college of engineering in the University of Notre Dame established?", 3);
// console.log(vectorStoreSearchResult);

//const model = new OpenAI({});
const model = new HuggingFaceInference({
    //model: "gpt2",
    // does not work
    //model:"text-davinci-003",
    // does not work
    //model: "Xenova/all-MiniLM-L6-v2",
    //model: "all-MiniLM-L6-v2",
    // does not work
    //model: "facebook/seamless-m4t-large",
    apiKey: process.env.HF_TOKEN, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
});
// dazu muss ein server von Ollama gestartet werden
// const model = new Ollama({
//     baseUrl: "http://localhost:11434", // Default value
//     model: "llama2", // Default value
// });

export async function chat(input:string) {

    const pineconeClient = await getPineconeClient();
    const pineconeIndex = pineconeClient.Index(indexName);

    const vectorStore = await PineconeStore.fromExistingIndex(
        new TransformersJSEmbedding({
            modelName: "Xenova/all-MiniLM-L6-v2"
        }),
        { pineconeIndex, namespace: "default", textKey: "context" },
    );
    const chain = VectorDBQAChain.fromLLM(model, vectorStore);

    const kbTool = new ChainTool({
        name: "Knowledge Base",
        description:
            "use this tool when answering general knowledge queries to get more information about the topic",
        chain,
    });

    const executor = await initializeAgentExecutorWithOptions([kbTool], model, {
        agentType: "zero-shot-react-description",
        verbose: false,
    });
    console.log("Loaded agent.");

    console.log(`Executing with input: "${input}"...`);

    const result = await executor.call({input});
    const chatResult = result.output;
    console.log(`${chatResult}`);
    //return {chatResult};
    return { success: true, chatResult: "" };
}