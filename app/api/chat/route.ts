import { GoogleGenAI } from "@google/genai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const { ASTRA_DB_NAMESPACE,
        ASTRA_DB_COLLECTION,
        ASTRA_DB_API_ENDPOINT,
        ASTRA_DB_APPLICATION_TOKEN,
        GEMINIAI_API_KEY } = process.env ;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

const geminiAI = new GoogleGenAI({apiKey : GEMINIAI_API_KEY});

const db = client.db(ASTRA_DB_API_ENDPOINT,{namespace : ASTRA_DB_NAMESPACE});

export async function POST(req : Request){
    try{
        const {messages} = await req.json();
        const latestMessage = messages[messages?.length-1]?.content ;
        let docContext = "";
        const embedResult = await geminiAI.models.embedContent({
            model : "gemini-embedding-001",
            contents : latestMessage,
            config : {
                outputDimensionality : 1536
            }
        })

        try {
            const collection = db.collection(ASTRA_DB_COLLECTION);
            const dbResponse = collection.find(null,{
                    sort : {
                        $vector : embedResult.embeddings?.[0].values,
                    },
                    limit : 10
                }
            )

            const documents = await dbResponse.toArray();

            const docsMap = documents?.map(doc=>doc.text);

            docContext = JSON.stringify(docsMap);


        } catch (error) {
            console.log('Error quering db ...')
        }

        const template = {
            role : "system",
            content : latestMessage,
        }

    } 
}