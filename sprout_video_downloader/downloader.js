// Title: sprout video downloader
// Description: Downloader video Sprout
// Author: Lucas Albuquerque
// Date: 14-Abr-2020

console.log("Download sprout video; Generate m3u8; Generate MP4\n");

const puppeteer = require('puppeteer');
const util = require('util');
const fs = require('fs');
const request = require("request");
const execSync = require('child_process').execSync;

const videoURL = process.argv.slice(2)[0];

(async () => {
    
    try {
        
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
          });

        const page = await browser.newPage();
        
        await page.goto(videoURL);
        
        page.setRequestInterception(true);
        page.on('request', async (req) => {
            
            if (req.url().includes('video/720.m3u8')) {
                
                request(req.url(), async function (error, response, m3u8Content) {
                    
                    const pageHtml = await page.evaluate(() => new XMLSerializer().serializeToString(document));
                    
                    let regex = new RegExp("dat = '(.*)'");
                    let dat = pageHtml.match(regex)
                    let base64Data = dat[1]
                    
                    let sproutData = JSON.parse(Buffer.from(base64Data, 'base64').toString());
                    
                    const filename = sproutData.title.replace(/\s/g, '');
                    
                    const baseUrl = util.format("https://hls2.videos.sproutvideo.com/%s/%s/video/", sproutData.s3_user_hash, sproutData.s3_video_hash);
                    
                    m3u8Content = m3u8Content.replace(/(\d+.key)/, function(a, b){
                        return baseUrl + a +
                        '?Policy=' + sproutData.signatures.k["CloudFront-Policy"] +
                        '&Signature=' + sproutData.signatures.k["CloudFront-Signature"] +
                        '&Key-Pair-Id=' + sproutData.signatures.k["CloudFront-Key-Pair-Id"] +
                        '&sessionID=' + sproutData.sessionID 
                    });
                    
                    m3u8Content = m3u8Content.replace(/([\d_]+.ts)/g, function(a, b){
                        
                        return baseUrl + a +
                        '?Policy=' + sproutData.signatures.t["CloudFront-Policy"] +
                        '&Signature=' + sproutData.signatures.t["CloudFront-Signature"] +
                        '&Key-Pair-Id=' + sproutData.signatures.t["CloudFront-Key-Pair-Id"] +
                        '&sessionID=' + sproutData.sessionID 
                        
                    });

                    const filegenerate = filename.replace('.mp4', '') + '.m3u8'
                    
                    let m3u8FilePath = __dirname + '/' + filegenerate;
                    
                    fs.writeFile(m3u8FilePath, m3u8Content, function(err) {
                        if(err) {
                            return console.error(err);
                        }

                        console.warn("File created => " + m3u8FilePath);

                        browser.close();
                        browser.disconnect();
                        browser.off();

                        var options = {
                            encoding: 'utf8'
                        };
                        
                        const cmd = "echo 'Gerando o video .mp4' && sh file.sh " + filegenerate;
                        console.log(execSync(cmd, options));
                    });
                });
                
            }
            
            req.continue();
            
        });
        
        //page.close();
        
    } catch (error) {
        return console.error(error);
    }
})();