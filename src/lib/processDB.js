const sqlite3 = require('sqlite3').verbose();

export function processDB(max_length=4000) {
  return new Promise((resolve, reject) => {
    let count=0;
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
                content += String(row.text) + " \n ";
                count++;
                if(content.length > max_length) {
                    resolve({content, count})
                }
              }
            });
            resolve({content, count});
          }
        });
        db.close();
      }
    });
  });
}

