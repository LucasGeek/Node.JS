const { exec } = require("child_process");

const vimeoCombineScript = exec('sh vimeo-combine.sh');
const combineScript = exec('sh combine.sh');

const fs = require("fs");
const url = require("url");
const https = require("https");
const log = (...args) => console.log("→", ...args);
const list = require("./videojson.js");
const promises = [];

function loadVideo(num, cb) {
  let masterUrl = list[num].url;
  if (!masterUrl.endsWith("?base64_init=1")) {
    masterUrl += "?base64_init=1";
  }

  getJson(masterUrl, (err, json) => {
    if (err) {
      return cb(err);
    }

    const videoData = json.video
      .sort((v1, v2) => v1.avg_bitrate - v2.avg_bitrate)
      .pop();
    const audioData = json.audio
      .sort((a1, a2) => a1.avg_bitrate - a2.avg_bitrate)
      .pop();

    const videoBaseUrl = url.resolve(
      url.resolve(masterUrl, json.base_url),
      videoData.base_url
    );
    const audioBaseUrl = url.resolve(
      url.resolve(masterUrl, json.base_url),
      audioData.base_url
    );

    processFile(
      "video",
      videoBaseUrl,
      videoData.init_segment,
      videoData.segments,
      list[num].name + ".m4v",
      err => {
        if (err) {
          return cb(err);
        }

        processFile(
          "audio",
          audioBaseUrl,
          audioData.init_segment,
          audioData.segments,
          list[num].name + ".m4a",
          err => {
            if (err) {
              return cb(err);
            }

            exec("sh vimeo-combine.sh", (error, stdout, stderr) => {
              if (error) {
                  console.log(`error: ${error.message}`);
                  return;
              }
              if (stderr) {
                  console.log(`stderr: ${stderr}`);
                  return;
              }

              log(
                "📦", "🎬",
                "Criando video ..."
              );

              exec("sh combine.sh", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
  
                log(
                  "📦", "🎥",
                  "Vídeo criado..."
                );
              });
            });

            cb(null, num + 1);
          }
        );
      }
    );
  });
}

function processFile(type, baseUrl, initData, segments, filename, cb) {
  const filePath = `./parts/${filename}`;
  const downloadingFlag = `./parts/.${filename}~`;
  
  if(fs.existsSync(downloadingFlag)) {
    log("⚠️", ` ${filename} - ${type} está incompleto, reiniciando o download`);
  } else if (fs.existsSync(filePath)) {
    log("⚠️", ` ${filename} - ${type} já existe`);
    return cb();
  } else {
    fs.writeFileSync(downloadingFlag, '');
  }

  const segmentsUrl = segments.map(seg => baseUrl + seg.url);

  const initBuffer = Buffer.from(initData, "base64");
  fs.writeFileSync(filePath, initBuffer);

  const output = fs.createWriteStream(filePath, {
    flags: "a"
  });

  combineSegments(type, 0, segmentsUrl, output, filePath, downloadingFlag, err => {
    if (err) {
      log("⚠️", ` ${err}`);
    }

    output.end();
    cb();
  });
}

function combineSegments(type, i, segmentsUrl, output, filename, downloadingFlag, cb) {
  if (i >= segmentsUrl.length) {
    fs.unlinkSync(downloadingFlag);
    log("🏁", ` ${filename} - ${type} feito`);
    return cb();
  }

  log(
    "📦",
    type === "video" ? "📹" : "🎧",
    `Baixando ${type} segmento ${i}/${segmentsUrl.length} de ${filename}`
  );

  https
    .get(segmentsUrl[i], res => {
      res.on("data", d => output.write(d));

      res.on("end", () =>
        combineSegments(type, i + 1, segmentsUrl, output, filename, downloadingFlag, cb)
      );
    })
    .on("error", e => {
      cb(e);
    });
}

function getJson(url, cb) {
  let data = "";

  https
    .get(url, res => {
      res.on("data", d => (data += d));

      res.on("end", () => cb(null, JSON.parse(data)));
    })
    .on("error", e => {
      cb(e);
    });
}

function initJs(n = 0) {
  if (!list[n] || (!list[n].name && !list[n].url)) return;

  loadVideo(n, (err, num) => {
    if (err) {
      log("⚠️", ` ${err}`);
      return;
    }

    if (list[num]) {
      initJs(num);
    }
  });
}

initJs();
