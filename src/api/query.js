import axios from "axios";
import axiosTauriApiAdapter from "axios-tauri-api-adapter";

import {httpRequest} from "@/api/base.js";


const API_URL = ''
const API_KEY = ''
const QUERY_PROMPT = ''




function getQuery(){


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
