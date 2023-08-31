import { config } from 'dotenv';
import {CharacterTextSplitter, RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import { FaissStore } from "langchain/vectorstores/faiss";
import {loadPdf} from "./utils";
import {HuggingFaceInferenceEmbeddings} from "langchain/embeddings/hf";
config({ path: '.env' });
describe('Transformer Service', () => {
    // afterAll(() => {
    //     //dateSpy.mockRestore()
    // })

    describe('Transformer', () => {
        it('should accept a payload and transform it to vectors', async () => {
            console.info(process.env.HF_TOKEN);
            console.info("Executing test");
            const loadedDocs = await loadPdf("myFile");

            // const model = new HuggingFaceInference({
            //     model: "gpt2",
            //     apiKey: process.env.HF_TOKEN, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
            // });
            //const embeddings = new TensorFlowEmbeddings();
            //
            // nur das funktioniert
            //const embeddings = new OpenAIEmbeddings();

            //const embeddings = new TensorFlowEmbeddings();
            const embeddings = new HuggingFaceInferenceEmbeddings({
                apiKey: process.env.HF_TOKEN, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
            });
            // const textSplitter = new RecursiveCharacterTextSplitter({
            //     chunkSize: 500,
            //     chunkOverlap: 50,
            // });
            const textSplitter= new CharacterTextSplitter({
                separator: "\n",
                chunkSize: 500,
                chunkOverlap: 50
            });

            // const loadedDocs:Document[] = [];
            // const doc:Document =  {
            //     pageContent: "Hello World",
            //     metadata: {}
            // }
            // loadedDocs.push(doc);
            const docs = await textSplitter.splitDocuments(loadedDocs);
            //console.info(docs);
            //console.info("##### Loading docs:");
            //const vectorStore = await FaissStore.load("C:\\Users\\agol\\github\\portfolio\\vectorstores_tfl", embeddings);
            //console.info("##### Storing docs:");
            //console.info(storedData);
            const vectorStore = await FaissStore.fromDocuments(docs, embeddings);
            vectorStore.save("C:\\Users\\agol\\github\\portfolio\\vectorstores_tfl");
            const resultOne = await vectorStore.similaritySearch("Before we begin", 2);
            console.log(resultOne);

        }, 300000)
    })
})