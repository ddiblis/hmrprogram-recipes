const fs = require('fs');
const axios = require("axios")
const cheerio = require("cheerio")
const { genPayload, getRecipeChunk } = require("./helpers")

function getSite(html) {
    const recipeList = []
    const reg = /, '(?<company>.*)', '(?<recipe>.*)'/;
    const $ = cheerio.load(html)
    $("div.ka-card").each((_, item) => {
        if (item.attribs.onclick) {
            const rec = {}
            const match = reg.exec(item.attribs.onclick)
            const company = match.groups.company.toLowerCase().replace(/ /g, "-")

            rec[match.groups.recipe] = {
                url: `https://www.hmrprogram.com/recipes/${company}-diet/${match.groups.recipe}`
            }
            recipeList.push(rec)
        }
    })
    return recipeList
}




async function getList(num) {
    const test = []
    const run = [...Array(num).keys()].forEach(async x => {
        data = await axios.post("https://www.hmrprogram.com/cms__ServiceEndpoint", genPayload(x),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                }
            })

        const list = getSite(data.data.htmlResult)
        await genChunk(list)
    })
}

async function genChunk(list) {
    const chunk = []
    chunk.push(await Promise.all(list.map(getRecipeChunk)))
    // const data = await list.map(async l => {
    //     return getRecipe(l[Object.keys(l)[0]].url)
    //     // fs.appendFile("results.json", JSON.stringify(recipes, null, 4), function (err) {
    //     //     if (err) throw err;
    //     //     console.log('The "data to append" was appended to file!');
    //     // });
    // })
    return chunk
    fs.appendFile("results.json", JSON.stringify(test.flat(), null, 4), function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
}



getList(48)