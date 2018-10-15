# Keto Recipe Finder

This project is intended to be an API that serves up keto recipies, and then converts them to a shopping list.
The v0 idea is to first serve up recipes. The v1 idea is to convert the recipes into a grocery list. This API will be built
using Node.js + Express.js. We will research API's that return recipies, and our API
will filter those out to show Keto recipies with a filter for Vegan and Gluten Free.

## Useful links:
View our live website at: https://keto-eating.herokuapp.com
View our API documentation at: https://keto-eating.github.io/Keto-Recipe-API/#/

### Project Team

Nicolai Safai, Phyllis Wong, and Leslie Kimm

### Roles

**Lead Backend Engineer / PM**<br>
Nicolai Safai<br><br>
**Lead Frontend Engineer**<br>
Phyllis Wong<br><br>
**Senior Engineer / QA**<br>
Leslie Kimm<br><br>

### Pages/Routes:
- **/** (home)<br>
- **/?term=pizza** (searches for keto recipes for 'pizza'. For multiple terms, separate each term by %20 or use the search bar)<br>
- **/favorites** (logged out: list of public favorites / logged in: list of your saved favorites)<br>
- **/login** (login for existing users)<br>
- **/signup** (create new account)<br>

### Milestones

-   [x] **Sep 28** Ship to Heroku
-   [x] **Oct 10** Non-authenticated landing page: MVP Search for food item --> return keto recipes
-   [x] **Oct 11** Stretch goal - authenticated version
-   [x] **Oct 12** Add test(s)
-   [ ] **Oct 13** Add 1 nested route: user favorites
-   [ ] **Oct 14** Re-deploy to Heroku
-   [ ] **Oct 21** Shipped to our custom domain
