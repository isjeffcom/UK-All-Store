const superagent= require('superagent')
const cheerio = require('cheerio')

const fs = require("fs")

const timeoutDefault = {
    response: 0, //delay 0 second
    deadline: 100000 // 10 second timeout
}

const teBase = "https://www.the-shops.co.uk/chainstore/173-tesco/"

let allAll = []

run()

async function run(){

    //console.log(await getTe(teBase))
    for(let i=1;i<40;i++){

        if(i == 1){
            allAll.push(await getTe(teBase))
        } else {
            allAll.push(await getTe(teBase + i))
        }

        if(i == 39){
            fs.writeFileSync('tesco_ready.json', JSON.stringify(allAll))
        }
        
    }
}


let geo = JSON.parse(fs.readFileSync('./geo.json', 'utf8'));

function getTe(url){

    return new Promise(resolve => {

        let all = []

        superagent.get(url).timeout(timeoutDefault).end((err, res) => {

            if (err) {

                //console.log("err")
                return

            } else {

                

                let $ = cheerio.load(res.text)

                $('.shop').each((idx, el)=>{

                    let tmp = {
                        id: 0,
                        sname: "0",
                        postcode: "0",
                        longitude: 0,
                        latitude: 0,
                        tel: "0",
                        address: "0"
                    }

                    let id = $(el).attr("data-id")
                    //console.log(id)

                    // Get name and replace spaces on double sides
                    let name = $(el).find(".font-weight-bold").text()
                    name = name.replace(/^\s+|\s+$/g,"")

                    // Get name and replace spaces on double sides
                    let add = $(el).find(".font-weight-light").text()
                    add = add.replace(/^\s+|\s+$/g,"")

                    // Put name and address
                    tmp.id = id
                    tmp.sname = name
                    tmp.add = add
                    
                    // Get geo location
                    let fullGeo = getLocFromGeo(id)
                    if(fullGeo != -1){
                        tmp.longitude = fullGeo.lon
                        tmp.latitude = fullGeo.lat
                    }

                    all.push(tmp)
                    
                })

            }

            resolve(all)

            
        })

    })
}

function getLocFromGeo (id) {
    for(let i=0;i<geo.length;i++){
        if(id == geo[i].id){
            return geo[i]
        }
    }

    return -1
}