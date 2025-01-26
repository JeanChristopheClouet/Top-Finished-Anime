// 1. import all necessary modules
import express from "express"
import bodyParser from "body-parser"
import axios, { all } from "axios"
import ejs from "ejs"

// 2. define port, set public as the static folder, initialize the app
const port = 3000;
const app = express();
app.use(express.static("public"))

// 3. Mount the middleware to allow us to parse forms
app.use(bodyParser.urlencoded({ extended: true }))

// 4. handle get request to the home page 
app.get("/", (req, res)=>{
    res.render("index.ejs", {animeGif:getRandomAnimeGif()})

})

// 5. handle post request 
app.post("/submit", async (req, res)=>{

    var topTenRecent = [];
    
    // 6. retrieve data from the form
    var myType = req.body.type;
    var myTypeReadable = typeMappings[myType];


    // 7. Find out the current year and month
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth()+1;
    
    // 8. make the API call to Jikan API to get the animes
    try{
        const response = await axios.get(`https://api.jikan.moe/v4/top/anime?type=${myType}&limit=10`)
        const allAnime = response.data.data;
        console.log(allAnime.length)
        // 9. Iterate over the anime and push those more recent to an array
        var i = 0;
        while(i<allAnime.length){
        // 10. Once we have the top then, break out of the loop
            if(topTenRecent.length>10){
                break;
            }
            const currentAnime = allAnime[i];
            console.log(currentAnime.title)
            topTenRecent.push(currentAnime)            
            i++;
        }
        console.log(topTenRecent.length)
        // 11. pass data to the frontend is name, studiot, image, url (button)
        res.render("index.ejs", {topAnime:topTenRecent, animeGif:getRandomAnimeGif(), typeString:myTypeReadable})
        }
    catch(error){
        console.log(error.message)
    }

})


// 12. Make the app listen on the predefined port

app.listen(port, ()=>{
    console.log(`> Server listening on port ${port}`)
})

// 13. Create an array with a bunch of different anime gif urls
const animeGifs = [
"https://giffiles.alphacoders.com/190/190192.gif",
"https://www.icegif.com/wp-content/uploads/2023/07/icegif-86.gif",
"https://media0.giphy.com/media/9DgiLVDnCmiWUzOasR/giphy.gif",
"https://media2.giphy.com/media/3XYuxLiRtIu76/giphy.gif",
"https://66.media.tumblr.com/e79fca60b7e45ebc2ff25c8fa2d1306d/2553a1be7ff3b928-b4/s540x810/c8c5af2b5773af62aa42c2a1b503468d08f39a90.gif",
"https://64.media.tumblr.com/055bd1846341183e2ed09ebd63c20193/0bc3c8e33bd7d505-33/s540x810/88b3200d3fda3e5ad92b66bf13d45ec2c63e4e95.gif",
"https://cdn.vox-cdn.com/thumbor/U7lgXZkbIcT7QhxichMnKF5dlR0=/0x18:360x221/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/37153116/tumblr_lmpg9jl57d1qfeod9.0.0.gif"


]

const typeMappings = {
    "tv":"TV", "movie":"Movie", "ova":"OVA", "special":"Special", "ona":"ONA", "music":"Music", "cm":"Commericial", "pv":"Promotional Videos", "tv_special":"TV Special"
}

// 14. Create a method that taps into an anime gif url and returns one randomly
function getRandomAnimeGif(){
var n = animeGifs.length
var randomIndex = Math.round(Math.random()*(n-1))
console.log(randomIndex)

return animeGifs[randomIndex]
}

