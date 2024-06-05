import {httpRequest} from "@/api/base.js";
import dayjs from "dayjs";


async function getDailyQuote() {
    const todayStr = dayjs().format('YYYY-MM-DD')
    let lastUpdateDateStr = localStorage.getItem('lastUpdateDate')
    if (lastUpdateDateStr === todayStr) {
        const content = localStorage.getItem('lastUpdateContent')
        return JSON.parse(content)
    }
    console.debug('fetching new qoute')

    const result = await httpRequest({
        url: 'https://open.iciba.com/dsapi/',
        qurey: {
            date: todayStr
        }
    })

    console.log(result)

    let {content, note} = result.data
    localStorage.setItem('lastUpdateDate', todayStr)
    localStorage.setItem('lastUpdateContent', JSON.stringify({
        content, note
    }))
    return {content, note}
}

export {getDailyQuote}
