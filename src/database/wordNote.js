import Datebase from "tauri-plugin-sql-api";
import dayjs from "dayjs";

const DB_NAME = "sqlite:words.db";

async function getWordsList(option) {
    const db = await Datebase.load(DB_NAME);

    const { currentPage, sortBy = "addTimestamp", order = "DESC", pageSize = 10, isGetPages = false } = option || {};

    let result = await db.select("SELECT COUNT(*) as totalCounts FROM Note");
    const totalCounts = result[0].totalCounts;
    const totalPages = Math.ceil(totalCounts / pageSize);

    if (isGetPages) {
        return { totalCounts, totalPages };
    }

    const sql = `SELECT * FROM Note ORDER BY ${sortBy} ${order} LIMIT ${pageSize} OFFSET ${
        (currentPage - 1) * pageSize
    }`;

    result = await db.select(sql);

    return {
        totalCounts,
        totalPages,
        currentPage,
        pageSize,
        words: result,
    };
}

async function addWord(word, options) {
    console.log("addWord", word, options);
    const db = await Datebase.load(DB_NAME);
    const { importance } = options;
    const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
    await db.execute("INSERT INTO Note (word, importance, addTimestamp) VALUES ($1, $2, $3)", [
        word,
        importance,
        timestamp,
    ]);
    return importance;
}

async function removeWord(word) {}

async function updateImportance(word, newImportance) {
    console.log("updateImportance", word, newImportance);
    const db = await Datebase.load(DB_NAME);
    const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
    await db.execute("UPDATE Note SET importance = $1, addTimestamp = $2 WHERE word = $3", [
        newImportance,
        timestamp,
        word,
    ]);
    return newImportance;
}

async function wordNote(word, option) {
    // check if word exists
    const db = await Datebase.load(DB_NAME);
    let result = await db.select("SELECT * FROM Note WHERE word = $1", [word]);
    console.log("wordNote", result);
    console.log("checking word", word, option);
    if (result.length === 0) {
        return await addWord(word, option);
    } else {
        return await updateImportance(word, option.importance);
    }
}

async function getWord(word) {
    const db = await Datebase.load(DB_NAME);
    let result = await db.select("SELECT * FROM Note WHERE word = $1", [word]);
    if (result.length === 0) {
        return 0;
    }
    return result[0].importance;
}

export { wordNote, getWordsList, removeWord, getWord };
