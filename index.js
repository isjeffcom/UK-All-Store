const superagent= require('superagent')
const cheerio = require('cheerio')

const con = require('./concat')

const fs = require("fs")

const timeoutDefault = {
    response: 0, //delay 0 second
    deadline: 100000 // 10 second timeout
}

const tesco = "https://www.the-shops.co.uk/chainstore/224-sainsburys/"
const sainsbury = "https://www.the-shops.co.uk/chainstore/224-sainsburys/"
const aldi = "https://www.the-shops.co.uk/chainstore/241-aldi/"


// IMPORTANT 
// You will need to Manually download chainstore-markers json from the link XHR request above. named it geo_<name>.json
// Easy to find them on Chrome Dev Tool > Network > XHR


/*let geo_s = JSON.parse(fs.readFileSync('./geo_' + 'sainsbury' + '.json', 'utf8'))
let geo_t = JSON.parse(fs.readFileSync('./geo_' + 'tesco' + '.json', 'utf8'))
let geo_aldi = JSON.parse(fs.readFileSync('./geo_' + 'aldi' + '.json', 'utf8'))*/

let allAll = []

// Get sainsbury
run(sainsbury, "sainsbury", 14, (res)=>{
    con.make(res, "sainsbury")
})

// Get Tesco
run(tesco, "tesco", 39, (res)=>{
    con.make(res, "tesco")
})

async function run(source, geo_fn, pageLen, callback){

    let geo_file = JSON.parse(fs.readFileSync('./geo_' + geo_fn + '.json', 'utf8'))

    //console.log(await getTe(teBase))
    for(let i=1;i<pageLen+1;i++){

        if(i == 1){
            allAll.push(await getTe(source, geo_file))
        } else {
            allAll.push(await getTe(source + i, geo_file))
        }

        if(i == pageLen){
            //fs.writeFileSync('sainsbury_ready.json', JSON.stringify(allAll))
            callback(allAll)
        }
        
    }
}



function getTe(url, geo){

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
                    let fullGeo = getLocFromGeo(id, geo)
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

function getLocFromGeo (id, geo) {
    for(let i=0;i<geo.length;i++){
        if(id == geo[i].id){
            return geo[i]
        }
    }

    return -1
}