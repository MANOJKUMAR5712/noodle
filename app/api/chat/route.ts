import { GoogleGenAI } from "@google/genai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { streamText , convertToCoreMessages } from "ai";
import { google , createGoogleGenerativeAI } from "@ai-sdk/google";

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
        console.log(latestMessage);
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

            // console.log(docsMap);


        } catch (error) {
            console.log('Error quering db ...')
        }

        const template = {
            role : "system",
            content : `You are an AI assistant with deep expertise in **Christopher Nolan** and his films.
                       Use only the provided context to enhance your responses about Nolan’s biography, filmmaking style, thematic techniques, and filmography.
                       Context may include details from Wikipedia, imdb and others.
                       If the context contains the answer, rely solely on it.
                       If the context does not contain the answer, answer by searching the web.
                       Do not mention whether the context includes the information or reveal sources.
                       Do not describe your reasoning process.
                       Use Markdown formatting where appropriate—no images.
                       -----------------
                       START CONTEXT
                       ${docContext}
                       END CONTEXT
                       -----------------
                       Question:${latestMessage}`
        }
        
        const model = createGoogleGenerativeAI({
            apiKey : GEMINIAI_API_KEY
        })

        const res = streamText({
            model : model('gemini-2.5-flash'),
            messages : convertToCoreMessages([
                {role : 'user',content:template.content},
                ...messages
            ]),
        })

        // console.log(res);

        return res.toDataStreamResponse();

    } catch(error){
        console.error("POST error: ",error) ;
        return new Response(`Internal server error` , {status : 500});
    }
}