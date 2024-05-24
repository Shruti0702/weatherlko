import http from "http";
import request from "requests";

import fs from "fs";
const homeFile=fs.readFileSync("home.html","utf-8");
const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempVal%}",(orgVal.main.temp/10).toFixed(2));
    temperature=temperature.replace("{%tempmin%}",(orgVal.main.temp_min/10).toFixed(2));
    temperature=temperature.replace("{%tempmax%}",(orgVal.main.temp_max/10).toFixed(2));
    temperature=temperature.replace("{%location%}",orgVal.name);
    temperature=temperature.replace("{%country%}",orgVal.sys.country);
    temperature=temperature.replace("{%temp_Status}",orgVal.weather[0].main);
    return temperature;
    
};
const server=http.createServer((req,res)=>{
    if(req.url=='/'){
        request('https://api.openweathermap.org/data/2.5/weather?q=Lucknow&appid=13a711824b05b3dd7e95f463f5f06ae1')
        .on('data',(chunk)=> {
            const objdata=JSON.parse(chunk);
            const arrdata=[objdata];
            console.log(arrdata[0].main.temp);
            const realtimeData=arrdata.map((val)=>replaceVal(homeFile,val)).join("");
            res.write(realtimeData);
            console.log(realtimeData);
    })
    .on('end', (err) =>{
        if (err) return console.log('connection closed due to errors', err);
            console.log('end');
            res.end();

        });
    }
});
server.listen(3306,"127.0.0.1");
