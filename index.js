const path = require('path');
const fs = require('fs');
const express = require('express');
const e = require('express');
const app = express();

const appConstants = {
    'recipePath': 'recipes'
}

const recipes = {};
const recipeMeta =[];
let recipesReady = false;

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.set('view engine', 'ejs')
app.get('/app', function (req, res) {
    res.render('recipe-list', {recipeMeta:recipeMeta});
});
app.get('/app/recipes/:recipeid', function (req, res) {
    //check if recipe ID is valid
    const recipeData = recipes[req.params.recipeid];
   // if (typeof singleRecipe !==undefined){
        console.log(recipeData)
       res.render('recipe2', {recipeData:recipeData});
    //}
   // else{
        ///RECIPE NOT FOUND
        // res.render('recipe not found')
    // }
    
   // console.log(req.params.recipeid)
    // res.render('recipe-list', {recipeMeta:recipeMeta});
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
    fileList.forEach(function (filename) {
        let fileText = fs.readFileSync(`${appConstants.recipePath}/${filename}`)
        let recipeSlug = path.basename(filename, '.json')
        let recipeObj = JSON.parse(fileText);
        recipes[recipeSlug] = recipeObj;
        recipes[recipeSlug].meta.slug=recipeSlug;
    })
    //build metadata object
    for (const item in recipes){
        recipeMeta.push(recipes[item].meta);
        
    }
    console.log(recipeMeta);

}

loadRecipes();