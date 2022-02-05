import cryptoRandomString from "crypto-random-string";
import fs from "fs";
import path from "path";
import axios from "axios";



export const login = async (req, res) => {
  const config = {
    url: "https://c-sport.tk/api/users/auth/login/",
    headers: {
      "Content-Type": "application/json",
    },
    data: req.body,
  };

  try {
    const { data } = await axios.post(config.url, config.data, { headers: config.headers });
    res.json(data);
  } catch (error: any) {
    res.status(error.response.status).json(error.response.data)
  }

};
export const register = async (req, res) => {

  const config = {
    url: "https://c-sport.tk/api/users/auth/register/",
    headers: {
      "Content-Type": "application/json",
    },
    data: req.body,
  };

  try {
    const { data } = await axios.post(config.url, config.data, { headers: config.headers });
    res.json(data);
  } catch (error: any) {
    res.status(error.response.status).json(error.response.data)
  }

};


export const getUser = async (req, res) => {
  const config = {
    url: "https://c-sport.tk/api/users/",
    headers: {},
    data: req.body,
  };
  if (req.headers.authorization) {
    config.headers = {
      Authorization: req.headers?.authorization,
    }
  }
  try {
    const { data } = await axios.get(config.url, { headers: config.headers });
    res.json(data);
  } catch (error: any) {
    res.status(error.response.status).json(error.response.data)

  }
}
export const postQuestion = async (req, res) => {
  const config: any = {
    url: "https://c-sport.tk/api/question/",
    headers: {
      "Content-Type": "application/json",
    },
    data: req.body,
  };
  if (req.headers.authorization) {
    config.headers = {
      ...config.headers,
      Authorization: req.headers?.authorization,
    }
  }

  try {
    const { data } = await axios.post(config.url, config.data, { headers: config.headers });
    res.json(data);
  } catch (error: any) {
    res.status(error.response.status).json(error.response.data)
  }
}
export const createHTML = async (req, res) => {
  let html = req.body.html_content;
  const replace = req.body.replace;
  if (replace) {
    replace.forEach((replaceObj) => {
      html = html.replaceAll(replaceObj.value, replaceObj.toBeReplacedWith);
    });
  }
  const randStr = cryptoRandomString(5);

  const filePath = `./public/${randStr}.html`;
  try {
    await fs.writeFileSync(filePath, html);
    const record = {
      id: randStr,
      path: filePath,
    };
    await addRecordToDB(record);

    res.status(200).json({
      msg: "File saved successfully",
      data: record,
    });
  } catch (error) {
    res.status(400).json({
      msg: "An error occured while saving the file",
    });
  }
};

export const getRecord = async (req, res) => {
  const id = req.params.fileId;
  const htmlFile = await getRecordById(id);
  if (!htmlFile) {
    return res.status(404).json({
      msg: "File does not exist",
    });
  }
  res.sendFile(path.resolve(htmlFile.path));
};

async function addRecordToDB(record: { id: string; path: string }) {
  const mydb = await fs.readFileSync("db.json", "utf8");
  const db = JSON.parse(mydb).data;
  db.push(record);
  await fs.writeFileSync("db.json", JSON.stringify({ data: db }));
}

async function getRecordById(id: string) {
  const mydb = await fs.readFileSync("db.json", "utf8");
  const db = JSON.parse(mydb).data;
  const htmlFile = db.find((file) => file.id === id);
  try {
    await fs.readFileSync(htmlFile.path, "utf8");
    return htmlFile;
  } catch (error) {
    return null;
  }
}
