const fs = require("fs")


function make(all, name){
    let final = []

    for(let i=0; i<all.length; i++){
        for(let ii = 0; ii<all[i].length; ii++){
            final.push(all[i][ii])
        }

        if(i == all.length - 1){
            fs.writeFileSync(name + '.json', JSON.stringify(final))
        }
    }


}


module.exports = {
    make: make
}