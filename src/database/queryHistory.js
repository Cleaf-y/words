import dayjs from "dayjs";
import Datebase from "tauri-plugin-sql-api";

const DB_NAME = "sqlite:words.db";

async function addQueryHistory(word) {
    const db = await Datebase.load(DB_NAME);
    const todayStr = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const result = await db.execute("INSERT INTO QueryHistory (word, addTimestamp) VALUES ($1, $2)", [word, todayStr]);
    return result.rowsAffected === 1;
}

async function getQueryHistory() {
    const db = await Datebase.load(DB_NAME);
    // get distinct word

    const result = await db.select(
        "SELECT word, MAX(addTimestamp) AS latestTimestamp, COUNT(addTimestamp) as counts FROM QueryHistory GROUP BY word ORDER BY latestTimestamp DESC LIMIT 10;",
    );
    return result;
}

async function getQueriedTimes(word) {
    const db = await Datebase.load(DB_NAME);

    const result = await db.select("SELECT COUNT(*) as count FROM QueryHistory WHERE word = $1", [word]);

    return result[0].count;
}

async function clearQueryHistory() {
    const db = await Datebase.load(DB_NAME);
    const result = await db.execute("DELETE FROM QueryHistory");
    return result.rowsAffected;
}

export { addQueryHistory, getQueryHistory, getQueriedTimes, clearQueryHistory };
