const sqlite3 = require('sqlite3').verbose();

function processDB() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./database/chat.db", sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        let content = "";
        db.all(`SELECT text FROM message WHERE is_from_me = 1 ORDER BY date DESC LIMIT 696969;`, (err, rows) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            rows.forEach((row) => {
              if (row.text !== null) {
                content += String(row.text) + " ";
                if(content.length > 4000) {
                    resolve(content)
                }
              }
            });
            resolve(content);
          }
        });
        db.close();
      }
    });
  });
}

export default async function handler(req, res) {
  try {
    const content = await processDB();
    res.status(200).json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json("Error occurred while processing the database.");
  }
}
