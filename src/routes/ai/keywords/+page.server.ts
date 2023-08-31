import type { Actions } from './$types';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import type { Document } from 'langchain/document';
import { PDFLoader } from 'langchain/document_loaders';
import { writeFile, readFile } from 'fs/promises';

import type { LayoutServerLoad } from './$types';
import {FaissStore} from "langchain/vectorstores/faiss";
import {loadQAStuffChain, RetrievalQAChain} from "langchain/chains";
import {HuggingFaceInference} from "langchain/llms";
import {config} from "dotenv";
import {PromptTemplate} from "langchain";
import {HuggingFaceInferenceEmbeddings} from "langchain/embeddings/hf";

config({ path: '.env' });
export const load: LayoutServerLoad = async () => {
        return {
                posts: ["1", "2"],
        };
};



const promptTemplate = `Answer the question based on the context below. If the
question cannot be answered using the information provided answer
with "I don't know".

    Context: {context}

Question: {question}

Answer:
`

const useLocalStorage = true;

export const actions = {
	post: async ({ request }) => {

        // Load and store the file
        const form = await request.formData();
        const file = form.get('file') as File;
        let storeFile;
        try {
            storeFile = await readFile(`static/files/${file.name}`);
        } catch (err) {
            if (err.code === 'ENOENT') {
                    console.log('File not found!');
            } else {
                    throw err;
            }
        }
        if(storeFile === undefined || storeFile.length === 0){
              await writeFile(`static/files/${file.name}`, file.stream());
        }

        // Convert the file to a Document
        const loader = new PDFLoader(`static/files/${file.name}`);
        const docs: Document[] = await loader.load();
        console.log(docs.length);

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap:50,
            separators: ["\n"]});
        const chunks = await splitter.splitDocuments(docs);

        const embeddings = new HuggingFaceInferenceEmbeddings({
            apiKey: process.env.HF_TOKEN, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
        });

        let vectorStore;
        let keyword = "interactive tutorial";//a11y-autofocus
        if(useLocalStorage) {
            try {
                const searchStore = await FaissStore.load("C:\\Users\\agol\\github\\portfolio\\vectorstores", embeddings);

                // TODO speichern in PineCone
                if (searchStore.index.getDimension() === 0) {
                    vectorStore = await FaissStore.fromDocuments(chunks, embeddings);
                    vectorStore.save("C:\\Users\\agol\\github\\portfolio\\vectorstores");
                } else {
                    vectorStore = searchStore;
                }
            }catch (error){
                vectorStore = await FaissStore.fromDocuments(chunks, embeddings);
                vectorStore.save("C:\\Users\\agol\\github\\portfolio\\vectorstores");
            }
        }

        const resultOne = await vectorStore.similaritySearch(keyword, 1);

        const model = new HuggingFaceInference({
            apiKey: process.env.HF_TOKEN, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
        });
        //const chain = loadQARefineChain(model);
        // const chain = loadQARefineChain(model, {
        //     questionPrompt,
        //     refinePrompt,
        // });
        // const question = "What is Benign tumor?";
        // const relevantDocs = await vectorStore.similaritySearch(question, 10);
        // const res = await chain.call({
        //     input_documents: relevantDocs,
        //     question,
        // });

        const prompt = new PromptTemplate({
            inputVariables: ["context", "question"],
            template: promptTemplate,
        });

        const chain = new RetrievalQAChain({
            combineDocumentsChain: loadQAStuffChain(model, { prompt }),
            retriever: vectorStore.asRetriever(),
        });
        const res = await chain.call({
            query: "What is the Kundennummer?"
        });

        //console.log(resultOne);
        console.info(res);

        return { success: true, summary: resultOne };
	}
} satisfies Actions;
