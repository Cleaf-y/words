import Datebase from 'tauri-plugin-sql-api'


export async function initDatabase(){
    const db = await Datebase.load("sqlite:words.db")
    console.log(db)
}
