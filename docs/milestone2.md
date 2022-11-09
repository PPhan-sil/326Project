## 1 APIs
 Data model:
 -  api/posts: returning all the posts 
    query: 
        tag: return all the posts with matching tags
        titles: return all the posts with matching titles
 -  api/posts/:id: return the data of post with matching id
 -  api/users: return all users information
 




## Application Structure
User Object:
- Fields: Id, email, name, avatar, posts, totalPosts, likes, comments, dateCreated, favouriteTech, password
- API integration: Yes, but temporary until we set up a database with authentication. Login functionality currently uses this API.

Post Object fields:
- Id, authorId, tags, title, content, likes, commentsId
- API integration: Yes. Create can be done on feed and dashboard. Read occurs on feed, forum, and dashboard. Update (for likes) occurs on feed and forum. Delete occurs on dashboard.

Comment Object fields:
- Id, authorId, postId, content, likes
- API integration: Yes. Create, read, update (likes) occurs on forum page (maybe add deletion later).

Canvas Object fields:
- id, postId, ownerId, drawing, users
- API integration: No. Will implement CRUD with database.

## Frontend implementation
All pages:
- Can logout and login using modal and JS on all pages when applicable.

Feed page:
- Can create posts, search for posts, and like posts with buttons

Forum page:
- Can like post with like button

Dashboard page:
- Can create posts, delete posts, update user password, delete account

Canvas:
- Chat socket integration