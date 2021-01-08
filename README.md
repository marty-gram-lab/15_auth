# 15_auth


### Posts/Grams

Create RESTful post routes
* `GET /posts/popular`
  * respond with a list of the 10 posts with the most comments

### Comments

Create RESTful comments routes

* `POST /comments`
  * requires authentication
  * create a new comment
  * respond with the comment
  * HINT: get the user who created the comment from `req.user`.
* `DELETE /comments/:id`
  * requires authentication
  * delete a comment by id
  * respond with the deleted comment
  * NOTE: make sure the user attempting to delete the comment owns it

### Users

* BONUS:
  * `GET /users/popular`
    * respond with the 10 users with the most total comments on their posts
  * `GET /users/prolific`
    * respond with the 10 users with the most posts
  * `GET /users/leader`
    * respond with the 10 users with the most comments
  * `GET /users/impact`
    * respond with the 10 users with the highest `$avg` comments per post

## Rubric

* User model - 4 points
* Auth routes - 4 points
* Post setup (routes and model) 5 points
* Comment setup (routes and model) 5 points
* Aggregations - 2 points (1 point per aggregation)