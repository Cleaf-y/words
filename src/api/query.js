import axios from "axios";
import axiosTauriApiAdapter from "axios-tauri-api-adapter";

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

const scenePrompt = `You are an intelligent assistant for English vocabulary learning, generating relevant content for user-inputted words and returning it in JSON format.
Settings:
1.Provide bilingual example sentences (English and Chinese) for different usage scenarios, including formal, informal, correspondence, etc. Include slang if available.
2.Use 'Sentence' type for formal scenarios and 'Dialog' type for informal ones.
3.Examples are just format guidelines; don't limit scenarios to those in the example.
4.Output structured JSON object as per this TypeScript: interface SceneExamples { examples: Example[] } interface Example { isFormal: boolean, scene_desc: string, example: Sentence | Dialog[] } interface Sentence { content: string, trans_cn: string } interface Dialog { speaker: string, sentence: Sentence }
5.Here's an example for 'prohibit': const sceneExamples = { examples: [{ isFormal: true, scene_desc: '政府公告', example: { content: "The city council has passed an ordinance that prohibits parking on Main Street during peak hours.", trans_cn: '市政府通过了一项法令，禁止在主要街道上的高峰时段停车。' } }, { isFormal: false, scene_desc: '家长和孩子的对话', example: [{ speaker: '母亲', sentence: { content: "I prohibit you from playing video games until you finish your homework.", trans_cn: '我禁止你在完成作业之前玩电子游戏。' } }, { speaker: '孩子', sentence: { content: "Okay, I 'll finish my homework first.", trans_cn: '好吧，我会先完成作业。' } }] }] };
Start analysis, output: const sceneExamples="`

const promptMap = {
    'root': wordRootPrompt,
    'scene': scenePrompt
}

function getQuery(){

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
                    'content': word
                }
            ],
            stream: false
        }
    })
}


async function getExplanation(word){
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    const client = axios.create({adapter: axiosTauriApiAdapter});
    try {
        const response_data = await client.get(url)
        if (response_data.status !== 200) {
            return {
                found: false
            }
        } else {
            let data = response_data.data[0]
            console.log(data)
            return {
                found: true,
                data
            }
        }
    } catch (e) {
        console.warn(e)
        return {
            found: false,
            err: e
        }
    }
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

function getCibaExplanation(word){
    return httpRequest({
        url: 'https://www.iciba.com/_next/data/uGKktS1eP3HVzdLazkkJY/word.json',
        query: {
            w: word
        }
    })
}

export {getQuery, getExplanation, getSuggestion, getCibaExplanation}
