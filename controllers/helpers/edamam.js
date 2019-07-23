/* eslint-disable no-loop-func */
const { EDAMAM_APP_ID, EDAMAM_API_KEY } = process.env;
const http = require('https');
const RecipeSchema = require('../../models/recipe');

module.exports = () => {
  let start;
  const increment = 100;
  for (start = 0; start <= 600; start += increment) {
    const url = `https://api.edamam.com/search?q=keto&from=${start}&to=${start + increment}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`;

    http.get(url, (response) => {
      response.setEncoding('utf8');
      let body = '';
      response.on('data', (d) => { body += d; });

      response.on('end', () => {
        const parsed = JSON.parse(body);
        console.log(`${parsed.count} recipes were fetched`);
        console.log(`Edamam reports that there are ${parsed.hits.length} keto recipes available`);
        parsed.hits.forEach((hit) => {
          const recipeFromAPI = new RecipeSchema(hit.recipe);

          RecipeSchema.findOne({ uri: hit.recipe.uri })
            .exec((err, recipeInDB) => {
              if (err) {
                console.log('Error in recipe save: ', err.message);
              } else if (recipeInDB) {
                // console.log("recipe already exists");
              } else {
                // recipe is not in DB yet, save it
                recipeFromAPI.save((error, recipe) => {
                  if (error) {
                    console.log('Error in recipe save: ', error.message);
                  } else {
                    console.log(`successfully saved a recipe: ${recipe.label}`);
                  }
                });
              }
            });
        }); // <--------- END of forEach()
      });
    }); // <---------- END of fetch request
  } // <--- END of foor loop
};
