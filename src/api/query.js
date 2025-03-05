import {httpRequest} from "@/api/base.js";


const wordRootPrompt = `Settings:
1.Check if the word has roots/prefixes. If so, extract them all. If not, output only hasRoot: false in the data structure.
2.Explain the meaning of the root in Chinese.
3.Check for other words with the same root. If there are any, list them.
4.Output a structured JSON object following this TypeScript:
interface Explanation { hasRoot?: boolean; details?: RootInfo[]; } 
interface RootInfo { root?: string; rootMeaning?: string; relatedWords?: string[]; }
5.Example for "extrude":
const explanation = { "hasRoot": true, "details": [ { "root": "ex-", "rootMeaning": "源于拉丁语，意思为外、出、超越", "relatedWords": [ "exclude", "expand", "export", "exhale" ] }, { "root": "trud-/trus-", "rootMeaning": "源于拉丁语trudere，意思为推、挤", "relatedWords": [ "intrude", "protrude", "detrude", "intrusion", "protrusion" ] } ] }
Ensure relatedWords has at least one word.
Begin analysis and output: const explanation=`

const scenePrompt = `You are an intelligent assistant for English vocabulary learning, generating relevant content for user-inputted words and returning it in JSON string format.
Settings:
1.Provide bilingual example sentences (English and Chinese) for different usage scenarios, including formal, informal, correspondence, etc. Include slang if available.
2.Use 'Sentence' type for formal scenarios and 'Dialog' type for informal ones.
3.Examples are just format guidelines; don't limit scenarios to those in the example.
4.Output structured JSON object as per this TypeScript: interface SceneExamples { examples: Example[] } interface Example { isFormal: boolean, scene_desc: string, example: Sentence | Dialog[] } interface Sentence { content: string, trans_cn: string } interface Dialog { speaker: string, sentence: Sentence }
5.Here's an example for 'prohibit': const sceneExamples = { "examples": [{ "isFormal": true, "scene_desc": "政府公告", "example": { "content": "The city council has passed an ordinance that prohibits parking on Main Street during peak hours.", "trans_cn": "市政府通过了一项法令，禁止在主要街道上的高峰时段停车。" } }, { "isFormal": false, "scene_desc": "家长和孩子的对话", "example": [{ "speaker": "母亲", "sentence": { "content": "I prohibit you from playing video games until you finish your homework.", "trans_cn": "我禁止你在完成作业之前玩电子游戏。" } }, { "speaker": "孩子", "sentence": { "content": "Okay, I 'll finish my homework first.", "trans_cn": "好吧，我会先完成作业。" } }] }] };
Start analysis, output: const sceneExamples="`

const dialogPrompt = `You are an intelligent assistant for English vocabulary learning, generating relevant content for user-inputted words and returning it in JSON string format.
Settings:
1.Provide bilingual example sentences (English and Chinese) for different usage scenarios, INFORMAL ONLY. Include slang if available.
2.Examples are just format guidelines; don't limit scenarios to those in the example.
3.Output structured JSON object as per this TypeScript: interface SceneExamples { examples: Example[] } interface Example { isFormal: boolean, scene_desc: string, example: Dialog[] } interface Sentence { content: string, trans_cn: string } interface Dialog { speaker: string, sentence: Sentence }
4.Here's an example for 'prohibit': const sceneExamples = { "examples": [ { "isFormal": false, "scene_desc": '家长和孩子的对话', "example": [{ "speaker": "母亲", "sentence": { "content": "I prohibit you from playing video games until you finish your homework.", "trans_cn": "我禁止你在完成作业之前玩电子游戏。" } }, { "speaker": "孩子", "sentence": { "content": "Okay, I 'll finish my homework first.", "trans_cn": "好吧，我会先完成作业。" } }] }] };
Start analysis, output: const sceneExamples="`

const formalPrompt = `You are an intelligent assistant for English vocabulary learning, generating relevant content for user-inputted words and returning it in JSON string format.
Settings:
1.Provide bilingual example sentences (English and Chinese) for different usage scenarios, FORMAL ONLY.
2.Examples are just format guidelines; don't limit scenarios to those in the example.
3.Output structured JSON object as per this TypeScript: interface SceneExamples { examples: Example[] } interface Example { isFormal: boolean, scene_desc: string, example: Sentence } interface Sentence { content: string, trans_cn: string } 
4.Here's an example for 'prohibit': const sceneExamples = { "examples": [{ "isFormal": true, "scene_desc": '政府公告', "example": { "content": "The city council has passed an ordinance that prohibits parking on Main Street during peak hours.", "trans_cn": "市政府通过了一项法令，禁止在主要街道上的高峰时段停车。" } }] };
Start analysis, output: const sceneExamples="`

const treePrompt = `You are an intelligent assistant aiding English vocabulary learning. Generate related content for a given word and return a JSON string:
Settings:
1.Output the word's Hypernyms, Co-Hyponyms, and Hyponyms.
2.The example is for format reference only. 
3.Output a structured JSON object conforming to the TypeScript interface: interface Node { word: string, trans_cn: string, children?: Node[] }
4.Example for "purple": const wordTree = {"word": "color", "trans_cn": "颜色", "children": [{"word": "red", "trans_cn": "红色"}, {"word": "purple", "trans_cn": "紫色", "children": [{"word": "violet", "trans_cn": "紫罗兰色"}, {"word": "lavender", "trans_cn": "薰衣草色"}, {"word": "lilac", "trans_cn": "丁香色"}]}, {"word": "green", "trans_cn": "绿色"}]};
Now analyze and output: const wordTree=
`

const promptMap = {
    'root': wordRootPrompt,
    'scene': scenePrompt,
    'dialog': dialogPrompt,
    'formal': formalPrompt,
    'tree': treePrompt
}


function getGPTExplanation(word, promptType){
    // get config from loacl storage
    let config = localStorage.getItem('config')
    config = JSON.parse(config)
    return httpRequest({
        url: config.apiUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        data: {
            model: config.selModel,
            messages: [
                {
                    'role': 'system',
                    'content': promptMap[promptType]
                },
                {
                    'role': 'user',
                    'content': `generate content for ${word}`
                }
            ],
            stream: false
        }
    })
}


function getSuggestion(word){
    return httpRequest({
        url: 'https://dict.youdao.com/suggest',
        query: {
            num: '5',
            ver: '3.0',
            doctype: 'json',
            cache: 'false',
            le: 'en',
            q: word
        }
    })
}

function getSingleBrief(word){
    return httpRequest({
        url: 'https://dict.youdao.com/suggest',
        query: {
            num: '1',
            ver: '3.0',
            doctype: 'json',
            cache: 'false',
            le: 'en',
            q: word
        }
    })
}

function getCibaExplanation(word){
    return httpRequest({
        url: 'https://www.iciba.com/_next/data/gCMOQ_c1uQ3vzVASlE8yE/word.json',
        query: {
            w: word
        }
    })
}

export { getSuggestion, getCibaExplanation, getSingleBrief, getGPTExplanation }
