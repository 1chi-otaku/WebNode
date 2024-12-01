import redis from "redis";

const client = redis.createClient({
    url:"redis://127.0.0.1:6379"
});

client.connect().then(()=>{
    console.log("Success!");
    client.set("fruit", "blueberry").then(()=>{
        console.log("Added Blueberry");
        client.quit();
    })
})
.catch(err=>console.log(err));
