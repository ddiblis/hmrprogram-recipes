const axios = require("axios")
const cheerio = require("cheerio")

function genPayload(x) {
    return {
        action: "getNextCardSet",
        listTitle: "Recipes",
        objectType: "Recipes",
        dataCategory: "Getting_Started",
        recipeCategory: "Phase 2",
        subFilters: "",
        offset: x,
        recordCount: x * 6,
        recordsShown: "kA4410000007DZbCAM",
        service: "HMR_CMS_Knowledge_ServiceInterface",
        ocmsContext: "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",
        token: "s+DK9ypmqs1ZOFJMYRc63HUXZcgEnswGriBbiIntILDb9YeKE3ttxJF3l4PLCxSqQJlbBYITiyGkvKOGgWU45Q==",
    }
}


function genList(soup, ol) {
    const list = {}
    soup("li").each((i, item) => {
        const child = item.children[0]

        if (ol) {
            if (!isNaN(parseInt(String(child).charAt(0)))) {
                list[i + 1] = child.slice(3)
            } else {
                if (!child.data) {
                    list[i + 1] = child.children[0].children[0].data
                } else {
                    list[i + 1] = child.data.slice(1)
                }
            }
        } else {
            if (child.data) {
                list[i + 1] = child.data
            } else {
                list[i + 1] = child.children[0].data
            }
        }

        // ol ? !isNaN(parseInt(String(child).charAt(0))) ? list[i + 1] = child.slice(3) : list[i + 1] = child.slice(1) : child ? list[i + 1] = child :
        // list[i + 1] = item.children[0].children[0].data
    })
    return list
}

async function getRecipeChunk(item) {
    return getRecipe(item[Object.keys(item)[0]].url)
}


async function getRecipe(url) {

    const data = await axios.get(url)
    const $ = cheerio.load(data.data);
    const ing = cheerio.load($("main ul#r_ingredients").html())
    const dir = cheerio.load($("main ol#r_instructions").html())
    const inglist = genList(ing, 0)
    const dirlist = genList(dir, 1)
    const reg = /s\/(?<company>.*)-diet/
    const match = reg.exec(url)

    const full = {
        recipe: $("main h2.white").html(),
        comapny: match.groups.company,
        prep_time: $("main div.icon-text").html().trim(),
        description: $("main h6.text-thin").html(),
        ingredients: inglist,
        directions: dirlist,
        per_serving: {
            calories: $("main h5#r_calories").html(),
            fruit_servings: $("main h5#r_fServe").html(),
            vegetable_servings: $("main h5#r_vServe").html(),
        }
    }

    return full
}

module.exports = {
    genPayload,
    genList,
    getRecipeChunk
}