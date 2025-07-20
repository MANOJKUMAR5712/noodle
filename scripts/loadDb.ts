import { DataAPIClient } from '@datastax/astra-db-ts';
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { GoogleGenAI } from '@google/genai';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import 'dotenv/config';
import { domainToASCII } from 'url';

const { ASTRA_DB_NAMESPACE,
        ASTRA_DB_COLLECTION,
        ASTRA_DB_API_ENDPOINT,
        ASTRA_DB_APPLICATION_TOKEN,
        GEMINIAI_API_KEY } = process.env ;

const geminiAI = new GoogleGenAI({apiKey : GEMINIAI_API_KEY as string})

const cnData : string[] = [
    "https://en.wikipedia.org/wiki/Christopher_Nolan",
    "https://www.imdb.com/name/nm0634240/",
    "https://www.rottentomatoes.com/celebrity/christopher_nolan",
    "https://x.com/nolananalyst?lang=en",
    "https://en.wikipedia.org/wiki/Christopher_Nolan_filmography"
]

type similarityMetric = 'dot_product' | 'cosine' | 'euclidean' ; 

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

const db = client.db(ASTRA_DB_API_ENDPOINT as string,{namespace : ASTRA_DB_NAMESPACE});

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize : 512,
    chunkOverlap : 100
})

const createCollection = async (SimilarityMetric : similarityMetric = 'dot_product')=>{
    const res = await db.createCollection(ASTRA_DB_COLLECTION as string,{
        vector : {
            dimension : 1536,
            metric : SimilarityMetric
        } 
    })

    console.log(res);

}


const scrapePage = async (url : string)=>{
    const loader = new PuppeteerWebBaseLoader(url,{
        launchOptions : {
            headless : true,
        },
        gotoOptions : {
            waitUntil : "domcontentloaded",
        },
        evaluate : async(page,browser)=>{
            const result =await page.evaluate(()=> document.body.innerHTML);
            await browser.close();
            return result;
        }
    })

    return (await loader.scrape())?.replaceAll(/<[^>]*>?/gm,'');;
}


const loadSampleData = async ()=>{
    const collection = await db.collection(ASTRA_DB_COLLECTION as string);    

    for await (const url of cnData){
        const content = await scrapePage(url);
        const chunks = await splitter.splitText(content);
        for await (const chunk of chunks){
            const embedResult = await geminiAI.models.embedContent({
                model : "gemini-embedding-001",
                contents : {parts : [{text:chunk}]},
                config : {
                    taskType : 'RETRIEVAL_DOCUMENT'	,
                    outputDimensionality : 1536
                }
            })

            const vector = embedResult.embeddings?.values;
            const res = await collection.insertOne({
                $vector : vector,
                text : chunk
            })
            console.log(res);
        }
    }
}

createCollection().then(()=> loadSampleData()) ;

