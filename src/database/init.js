import Datebase from "tauri-plugin-sql-api";

export async function initDatabase() {
  const db = await Datebase.load("sqlite:words.db");

  // check if table exists
  try {
    const result = await db.execute("SELECT * FROM QueryHistory");
    console.log("Table exists");
    return;
  } catch (err) {
    if (err.includes("code: 1")) {
      console.log("Table does not exist");
      await createTables();
    }
  }
}

async function createTables() {
  const db = await Datebase.load("sqlite:words.db");
  const createTableSqlList = [
    "CREATE TABLE QueryHistory (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, addTimestamp TEXT);",
    "CREATE TABLE Note (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, importance INTEGER, addTimestamp TEXT);",
    "CREATE TABLE Revision (id INTEGER PRIMARY KEY AUTOINCREMENT, note_id INTEGER, expectedTimestamp TEXT, isFinished INTEGER, finishedTimestamp TEXT, FOREIGN KEY (note_id) REFERENCES Note(id));",
  ];
  createTableSqlList.forEach(async (sql) => {
    await db.execute(sql);
  });
}
