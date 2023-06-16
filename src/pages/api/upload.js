import formidable from 'formidable'
import sqlite3 from "sqlite3";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {

  const form = new formidable.IncomingForm ();
  form.uploadDir = "./";
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {

    const content = await processDB(files.file.filepath)

    res.status(200).json(content);
  });
}
export function processDB(filepath, max_length=4000) {
  return new Promise((resolve, reject) => {
    let count=0;
    const db = new sqlite3.Database(filepath, sqlite3.OPEN_READWRITE, (err) => {
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

