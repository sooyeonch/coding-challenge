# Coding Challenge

## Setup

#### Prerequite:
- Need to install MongoDB Community Edition. `https://www.mongodb.com/`


#### How to start:
1. `git clone https://github.com/sooyeonch/coding-challenge.git`
2. cd to the cloned directory 
3. `npm install`
4. Backend:
    - cd to the "backend" directory
    - Run `node server.js` ("Server at port 3000 started!" will be printed on a terminal.)
    
    Frontend:  *can use VSCode Live Server 
    - Open a new terminal window
    - cd to the "frontend" directory
    - Run `http-server`
    - Open a web browser (e.g. Chrome)
    - Go to `http://127.0.0.1/8080/index.html` or simply `http://127.0.0.1/8080`

- Backend: port 3000
- Frontend: port 8080


#### How to end: 
    - Close the website
    - Ctrl-C to end the server ("Ctrl-C: Terminating the backend & database  - Goodbye" will be printed.)
    - Delete the "cheeseDB" database (*Note: only the collection is deleted by ending the server)


## How does the website work

1. The backend fetches the data from the API (from Agriculture and Agri-Food Canada).

    - To solve the CORS issue, the backend uses the Express CORS package.

2. The backend saves the raw data in a MongoDB database.
    - Why I decided to save the data in the database:
        - I wanted users to click on different categories and view a list of cheeses in that category.
        - In order to do this, I had to somehow extract only the requested category.
        - I thought using a database query was the simplest solution.

3. When the website loads, the frontend fetches a list of cheeses that does not have a category type in English.

4. The frontend sorts the data alphabetically (A-Z) and displays it in a multi-page table.
    - If a cheese does not have information in one language, I used the other language to display the information.
     For example, Paneer (Northumberland Co-operative) doesn't have a French name.
     Even if a user wants to view the website in French, "Paneer (Northumberland Co-operative)" will be shown.
     
   - Each row is clickable, so a user can get the additional information that is not shown in the table.
   
5. The frontend send a GET request by providing a category type and a langauge.

#### Users can:
    - Switch between English and French (radio buttons at the top left corner).
    - Click any category at the top.
    - Click a row to view more information.
    - Click arrow buttons or enter a number to go to the different page in the table.
    - Search a cheese by name.
    - Sort the table by a cheese name, a fat content percentage, or a moisture percentage.

### Screenshots

<img width="500" alt="1" src="https://user-images.githubusercontent.com/48460686/126950746-c7e9f9f3-8035-4d76-8e3c-65cccad15fc6.png"> 

##### English

<img width="500" alt="2" src="https://user-images.githubusercontent.com/48460686/126950765-44d87132-1497-4919-9843-a305e0a7a377.png">

##### French

<img width="500" alt="3" src="https://user-images.githubusercontent.com/48460686/126950774-7f78017d-d3b1-41aa-bb8b-0934a78fff26.png">

##### When a row is clicked



## My solutions/ideas for the "Strech" section

1. Language:
   Since a user may be Anglophone or Francophone, I made radio buttons to allow users to switch between English and French.
   I translated some important words in French. 
   In order to ensure that the website is fully translated, I think Google Cloud Translation API will be helpful.

2. Assistive Technolgies / Users using assitive devices:
   My main prioity was to make a clean and responsive website using minimal colours.
   I put the categories of cheese in the header to make the website easy to navigate.
   
   I referenced this website
    
        - https://venngage.com/blog/color-blind-friendly-palette/
    
   to pick colours that are colourblind-friendly.

    However, to increase accessibility, I think a speech-to-text API can also be added to the website.

## Planning

###### User Information

1. Anglophone or Francophone
2. may need to use an assistive device

###### Assumptions:

- CheeseId is private
- LastUpdateDate is private
- For "Organic": 0 = false, 1 = true

###### Initial Idea:

- Let's display a subset of data in a table and let users click on a row to get the information that is not shown in the table.

###### What I planned:

1. Create a low-fidelity prototype for the website
   - Title, table, search box, buttons to go to a previous/next page
2. Create a HTML page
3. Learn and get data from the provided API
4. Make a function to dynamically add data from the API
5. Create functions to respond to user interactions

## Languages and Tools

- HTML
- CSS
- JavaScript
- Node.js
- MongoDB (local)
- jest

## Timeline
###### Day 1 
    - Created a prototype.
    - Created a page using HTML and Javascript.
    - Used a Chrome extension, Allow CORS: Access-Control-Allow-Origin, fetched the data.
    - Populated the table with the fetched data.
    - Started working on a pagination feature.
    
###### Day 2
    - Realized that using the Chrome extension might not be a good idea.
    - Learned about the Express CORS package.
    - Learned the basic Node.js to create a backend.
    - Table had 138 pages. 
        - Needed to find a way to reduce this number.
        - Came up with the idea of utilizing the category type.

###### Day 3
    - To get data by category, thought of using a database.
    - Learned how to access MongoDB in Node.js.
    - Although understanding MongoDB & Node.js took some time, I could not give up on it because I had time until the deadline.
    
###### Day 4
    - Added a sort feature. 
    - Continued to learn  MongoDB & Node.js.
    - Decided to use a simple query.

###### Day 5
    - Clean up 

## Difficulties & Resolutions:

1. At first, I had some issues with accessing the API from my localhost URL.
   As a quick fix, I used the extension, Allow CORS: Access-Control-Allow-Origin.
   But I realized that it was better to use a backend to solve the CORS issue.

2. As I was creating the website, I thought of displaying the different categories of cheese, so that users can click one of the categories
   and get a list of cheeses in that category.
   At that point, I already created a backend to fetch data from the API.
   So, I thought of using a database to query cheese data by category more easily.

3. Since the data is in JSON format, noSQL database seemed to be a good fit.
   I wanted to challenge myself to learn and use noSQL and MongoDB. However, I realized that I needed more time to properly learn MongoDB.

###### Lessons learned:

- Minimize data processing in the frontend.
- The backend needs to handle data.

###### What to improve:

- Learn more about mongoDB and practice its commands to be able to make complex queries.
- Improve the backend so that data processing/manipulation is done in the backend.
- Use an icon rather than a special character.

###### Resources used:

- `https://www.mongodb.com/`
- `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide`
- `https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment`
- `http://expressjs.com/en/resources/middleware/cors.html`
- `https://nodejs.org/en/docs/guides/`
- `https://nodejs.org/api/process.html`
- `https://jestjs.io/docs/getting-started`
- `https://venngage.com/blog/color-blind-friendly-palette/`
- `https://dev.w3.org/html5/html-author/charref`
