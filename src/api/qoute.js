import axios from "axios";
import axiosTauriApiAdapter from "axios-tauri-api-adapter";
import dayjs from "dayjs";


function getDailyQoute() {
    const todayStr = dayjs().format('YYYY-MM-DD')
    let lastUpdateDateStr = localStorage.getItem('lastUpdateDate')
    if (lastUpdateDateStr === todayStr) {
        const content = localStorage.getItem('lastUpdateContent')
        return JSON.parse(content)
    }
    console.debug('fetching new qoute')

    const client = axios.create({adapter: axiosTauriApiAdapter});

    client.get('https://open.iciba.com/dsapi/', {
        params:{
            date: todayStr
        }
    })
        .then(res => {
            let {content, note} = res.data
            localStorage.setItem('lastUpdateDate', todayStr)
            localStorage.setItem('lastUpdateContent', JSON.stringify({
                content, note
            }))
            return {content, note}
        })
        .catch(e => {
            console.log(e)
        })
}

export {getDailyQoute}
