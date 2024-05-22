import {defineStore} from "pinia";
import {ref} from "vue";


export const useConfigStore = defineStore('config', () => {
    const appTitle = ref('Words')

    return {
        appTitle
    }
})
