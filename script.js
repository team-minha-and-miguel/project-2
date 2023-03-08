// name spaced app 
const app = {};

// url endpoint in a variable 
app.apiUrl = 'https://api.tvmaze.com/search/shows';

// call get tv show function, inside form submission. 

app.userInput = document.getElementsByClassName('userInput');
app.userSubmit = document.querySelector('form').addEventListener('submit', function () {
   // console.log('it worked!',);
   app.getTvShows();
});

// what the user inputs in the search bar 

// calling fetch to make GET request
app.getTvShows = () => {
   let userSearch = app.userInput[0].value;
   // let userInput = '';
   const url = new URL(app.apiUrl);
   url.search = new URLSearchParams({
      q: userSearch
   });
   // console.log(url);

   fetch(url)
      .then(response => {
         console.log(response)
         if(response.ok === true) {
            // console.log(response)
            return response.json();
         } else {
            throw new Error(response.statusText);
         };
      })
      .then(function (jsonResult) {
         // console.log(jsonResult);
         app.displayTvShows(jsonResult);
      })
      .catch((error)=> {
         if(error.message === "Not Found") {
            alert('does not exist, something went wrong');
         } else {
            alert ('something went wrong');
         };
      });
};

// method that displays shows
app.displayTvShows = (tvShowArray) => {
   // console.log(tvShowArray);
   const gallery = document.querySelector('.gallery');
   // clear gallery before displaying new search results
   gallery.innerHTML = ``;
   tvShowArray.forEach(tvShow => {
      // create li element stored in a variable
      const newListItem = document.createElement('li');
      // image path variable for use in new element creation, includes conditions for null image
      const imagePath = tvShow.show.image ? tvShow.show.image.original : 'https://placekitten.com/200/300';
      // alt text path variable for use in new element creation, includes conditions for placeholder image
      let altPath; 
      if (tvShow.show.image != null) {
         altPath = `Poster for ${tvShow.show.name}`;
      } else {
         altPath = 'placeholder image';
      };
      console.log(tvShow);

      // create a new element
      newListItem.innerHTML = `
      <h2>${tvShow.show.name}</h2>
      <div class="imgContainer"><img src="${imagePath}" alt="${altPath}" /></div>
      <p>${tvShow.show.summary}</p>
      <p>${tvShow.show.rating.average}</p>
      `;

      // append each entry to the gallery
      gallery.appendChild(newListItem);

      // console.log(tvShow);

   });

app.init = () => {
   app.getTvShows();
};

app.init();

// PSEUDO CODE:
// giving the user 5 search terms, 
// objective: to help recommend users the best television shows for them, filtering the API based on the users choices. 

// Create an app object (_TV SHOW NAME_)

// Initialize preset data in the dedicated properties
// - apiURL
// - apiKey
// - userQuery

// Create a method (TVShows) to make API calls, which takes the user input as a parameter (userQuery)

// When the API call is successful, display the result by appending the data to the results div

// user will click the start button and be directed to the next html page (or rather than creating an additional html page, make a event listener when user clicks start button, append information on to DOM

// Create an init method to kick off the setup of the application
// - add a 'change' event listener to call the local method (getUserQuery), to track user input

// app.init calls and allows us to access the information from the API. 


// add shows to wish list
// genre




// ---------------------------------------------------------

// PSUEDO CODE MVP: 

// User gets to landing page, start button. ( no start button necessary )

// when user clicks start button, several buttons with keywords will populate the DOM. 

// user will have options (created by us) to click which words they would like to choose from, which will then search the API according to that word. 

// app displays the first 5 results of search. 

// we will choose which key values to populate into each reccomendation (i.e. image, name, cast, etc).

// button (disabled for now) will appear after recommendations have been given out, to reset the app and send user back to main start page. 


// STRETCH GOALS››:

// Rather than giving out 5 reccomendations, it will randomly spit out 1 choice using Math.floor + Math.random();
// second level tier of filtering after previous query search, allowing user to get a more detailed reccomendation. 


// STRETCH GOAL: figuring out how to put an input as the query search params, allowing users to type what they want instead of clicking our given choices.

}