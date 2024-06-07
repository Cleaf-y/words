import Datebase from "tauri-plugin-sql-api";
import dayjs from "dayjs";

const DB_NAME = "sqlite:words.db";

export async function getStatistics() {
    const db = await Datebase.load(DB_NAME);

    // get total note counts
    let result = await db.select("SELECT COUNT(*) as totalCounts FROM Note");
    const totalNotes = result[0].totalCounts;

    // get today counts
    const today = dayjs().format("YYYY-MM-DD");
    result = await db.select("SELECT COUNT(*) as todayCounts FROM Note WHERE addTimestamp LIKE $1", [today + "%"]);
    const todayCounts = result[0].todayCounts;

    return { totalNotes, todayCounts };
}
