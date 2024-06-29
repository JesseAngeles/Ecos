import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder, } from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";
import { LLMChain } from "langchain/chains";

const chatModel = new ChatOpenAI({
    temperature: 0.2,
    openAIApiKey: '',
    modelName: 'gpt-3.5-turbo',
    maxTokens: 200
});

const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a nice chatbot having a conversation with a human."],
    new MessagesPlaceholder("chat_history"),
    ["human", "{question}"],
]);

const memory = new BufferMemory({
    memoryKey: 'chat_history',
    returnMessages: true
});

const chatConversationChain = new LLMChain({
    llm: chatModel,
    prompt: chatPrompt,
    verbose: true,
    memory: memory
});

export async function answer(question: string): Promise<string> {
    try {
        const quest = await chatConversationChain.invoke({ question });
        return quest.text;
    } catch (error) {
        console.error("Error al procesar la pregunta:", error);
        throw error;
    }
};


export async function answer2(name: string, flow: Array<[boolean, string]>, message: string): Promise<string> {
    try {
        const question: String = createPrompt(name, flow, message);
        console.log(question);
        const quest = await chatConversationChain.invoke({ question });
        return quest.text;
    } catch (error) {
        console.error("Error al procesar la pregunta:", error);
        throw error;
    }
};

export async function answer3(name: string, flow: Array<[boolean, string]>,
    message: string, params: string, context: string): Promise<string> {
    try {
        const question: string = createPrompt2(name, flow, message, params, context);
        const quest = await chatConversationChain.invoke({ question });
        return quest.text;
    } catch (error) {
        console.error("Error al procesar la pregunta:", error);
        throw error;
    }
}

function createPrompt2(name: string, flow: Array<[boolean, string]>,
    messagePlayer: string, params: string, context: string): string {

    const playerName: string = "Valentine";

    let prompt = `Your name is ${name}. Your personal context is ${context}.
    you are in a theater scene. The script is the next:\n`;

    for (const message of flow) {
        if (message[0]) {
            prompt += `${name}: ${message[1]}.\n`;
        } else {
            prompt += `${playerName}: ${message[1]}.\n`;
        }
    }

    prompt += `${playerName}: ${messagePlayer}.\n`;
    prompt += `The last message given by ${playerName} is: ${params}\n`;
    prompt += `Be creative. 
        Follow the conversation. 
        Write only the message. 
        Message under 25 words. 
        Dont write "${name}:"`;

    return prompt;
}

function createPrompt(name: string, flow: Array<[boolean, string]>, messagePlayer: string): String {
    var prompt: String = new String;

    const playerName: string = "Valentine";

    const startingMessage: string =
        "Estas en juego de rol, tu papel es el siguiente:" +
        "Eres un aldeano que se encuentra en una mina" +
        "buscando minerales. Tu nombre es " + name +
        "y eres una persona muy gruñona. Tu historial de " +
        "conversación con " + playerName + "es el siguiente:";

    prompt += startingMessage;

    for (let i = 0; i < flow.length; i++) {
        const message = flow[i];
        if (message[0]) {
            prompt += name + ":" + message[1] + ".\n";
        } else {
            prompt += playerName + ":" + message[1] + ".\n";
        }
    }
    prompt += playerName + ":" + messagePlayer + ".\n";

    prompt += "Necesito que continues la conversación." +
        "Que tu mensaje sea corto y menor a 25 palabras";

    return prompt;
};

export async function answerTest(question: string) {
    return "Tu mensaje fue: " + question;
}
