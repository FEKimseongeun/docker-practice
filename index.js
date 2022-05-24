const express=require("express");
const redis=require("redis");

const app=express();

const client = redis.createClient({
    host: "redis-server",
    port: 6379,
});

client.set("number", 0);

app.get("/", (req, res) => {
    client.get("number", (err, number) => {
        res.send(`숫자가 1씩 올락바니다. 숫자: ${number}`);
        client.set("number", parseInt(number)+1);


    });
});

app.listen(9000,()=>{
    console.log('Server is running');
});
