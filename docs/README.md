# Keto Recipe Finder

This project is intended to be an API that serves up keto recipes, and then converts them to a shopping list.
The v0 idea is to first serve up recipes. The v1 idea is to convert the recipes into a grocery list. This API will be built
using Node.js + Express.js. We will research API's that return recipes, and our API
will filter those out to show Keto recipes with a filter for Vegan and Gluten Free.

## Useful links:
- View our [live website](https://keto-eating.herokuapp.com)
- View our [API documentation](https://keto-eating.github.io/Keto-Recipe-API/#/)
- View our [Github Repo](https://github.com/Keto-Eating/Keto-Recipe-API)

## Technologies

Node.js, Express, MongoDB, Mongoose, Handlebars, Bcryptjs, JS, Edamam API 

## Project Team

Nicolai Safai, Phyllis Wong, and Leslie Kimm



## Roles

**Lead Backend Engineer / PM**<br>
Nicolai Safai<br><br>
**Lead Frontend Engineer**<br>
Phyllis Wong<br><br>
**Senior Engineer / QA**<br>
Leslie Kimm<br><br>

## Pages/Routes:
- **/** (home)<br>
- **/?term=pizza** (searches for keto recipes for 'pizza'. For multiple terms, separate each term by %20 or use the search bar)<br>
- **/favorites** (logged out: list of public favorites / logged in: list of your saved favorites)<br>
- **/login** (login for existing users)<br>
- **/signup** (create new account)<br>

## Milestones

-   [x] **Sep 28** Ship to Heroku
-   [x] **Oct 10** Non-authenticated landing page: MVP Search for food item --> return keto recipes
-   [x] **Oct 11** Stretch goal - authenticated version
-   [x] **Oct 12** Add test(s)
-   [x] **Oct 13** Add 1 nested route: user favorites
-   [x] **Oct 14** Re-deploy to Heroku
-   [x] **Nov 14** Create job to store API results to our own DB (WIP)
-   [x] **Nov 14** Re-factor search to look inside our own DB (WIP)
-   [x] **Nov 12** Shipped to our custom domain
-   [x] **Nov 12** Ship functional version and share with friends
-   [ ] Re-factor Favorites (WIP)
-   [ ] Add styling to dashboard, include a weekly meal plan
-   [ ] Create a cart object to store current week's recipes
-   [ ] Parse ingredientLines and create list
-   [ ] Add same ingredients with same units to create reduced grocery list

## How tos

### How to install / run locally
- Fork our [Github Repo](https://github.com/Keto-Eating/Keto-Recipe-API)  and clone it to your local computer
- `cd` to project repository in your Terminal
- install node package manager (if needed)
- run `npm install`

### How to update docs
- Update `/docs/README.md` using markdown syntax
- `cd` to project repository in your Terminal
- run `docsify serve docs`

## Original User Stories (One Version Written By Each Contributor)
- As a person who has been on the keto diet, a problem that I used to run into is selecting all the recipes I would be using for the following week and then figuring out which ingredients I needed to purchase. This was something that took quite a bit of time, I used my Notes app on my phone to jot down what I needed, and would erase each one as I found it at the grocery store. It was not convenient and a took a lot of time every weekend to do my groceries.
- As a person who is on the keto diet, I want to be able to easily find recipes with pictures. I want to be able to filter my searches by food types, examples: tacos, mediterranean, gluten free, etc. I want the recipes to include the amounts of each ingredient. I want to be able to favorite recipes so I can go back to them. I also want to be able to modify the recipes. I want to save the current recipes in a cart, and then I want my cart to create a shopping list for me.
- As a person who likes using other people’s recipes for inspiration, I’d like to browse a list of recipes with pictures, sorted by diet. Once I have decided on a few recipes, I’d like to specify the number of servings I desire and then turn the recipes into a combined grocery list that is smart enough to convert different units of measurement and combine similar ingredients. Once I have the final grocery list, I’d like to easily be able to check off items that I already have in my fridge or pantry. Finally, I might want to save myself a trip to the grocery store by clicking  “checkout via [Instacart or Amazon Prime Now].”

## Data Models
### RecipeSchema:
- createdAt         : { type: Date },
- updatedAt         : { type: Date },
- uri               : { type: String, required: true },
- label             : { type: String, required: true },
- image             : { type: String, required: true },
- url               : { type: String, required: true },
- yield             : { type: Number },
- cautions          : { type: Array },
- healthLabels      : { type: Array },
- dietLabels        : { type: Array },
- ingredientLines   : { type: Array },
- calories          : { type: Number },
- totalWeight       : { type: Number },
- totalTime         : { type: Number },
- usersWhoFavorited : { type: Array } *--> an array of userIds*

### UserSchema:
- createdAt              :  {  type: Date  },
- updatedAt              :  {  type: Date  },
- password               :  {  type: String, select: false},
- username               :  {  type: String, required: true},
- arrayOfFavoriteRecipes :  {  type: Array }, *--> an array of recipeIds*
- recipesInCart          :  {  type: Array } *--> an array of userIds*