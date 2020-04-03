const fs = require("fs")

const all = JSON.parse(fs.readFileSync("./tesco_ready.json"))

let final = []

for(let i=0; i<all.length; i++){
    for(let ii = 0; ii<all[i].length; ii++){
        final.push(all[i][ii])
    }

    if(i == all.length - 1){
        fs.writeFileSync('tesco.json', JSON.stringify(final))
    }
}

