const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const appConstants = {
    'recipePath': 'recipes'
}

const recipes = {};
let recipesReady = false;

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.set('view engine', 'ejs')
app.get('/app', function (req, res) {
    res.render('recipe-list');
});
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`express server running on ${port}`)
})


//load recipe content from the folder defined in appConstants.recipePath
async function loadRecipes() {
    //list all files in the recipes folder
    const fileList = fs.readdirSync(appConstants.recipePath);
    //iterate through all files and load their contents
    fileList.forEach( function (filename) {
        let fileText = fs.readFileSync(`${appConstants.recipePath}/${filename}`)
        let recipeSlug = path.basename(filename, '.json')
        let recipeObj = JSON.parse(fileText);
        recipes[recipeSlug] = recipeObj;
    })
}

loadRecipes();

