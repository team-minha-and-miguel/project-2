// console.log('hello world');

// name spaced app 
const app = {};

// url endpoint in a variable 
app.apiUrl = 'https://api.tvmaze.com/search/shows';

// call get tv show function, inside form submission. 

app.userInput = document.getElementsByClassName('userInput');
app.userSubmit = document.querySelector('form').addEventListener('submit', function () {
   console.log('it worked!',);
   app.getTvShows();
});

// what the user inputs in the search bar 

// app.userSubmit.addEventListener('submit', function(){
//    console.log('it works');
// });
// 

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
         // console.log(response)
         return response.json();
      })
      .then(function (jsonResult) {
         // console.log(jsonResult);
         app.displayTvShows(jsonResult);
      });
};

// method that displays shows
app.displayTvShows = (tvShowArray) => {
   // console.log(tvShowArray);
   // app.gallery.innerHTML = ``;
   const gallery = document.querySelector('.gallery');
   gallery.innerHTML = ``;
   tvShowArray.forEach(tvShow => {
      const newListItem = document.createElement('li');
      console.log(tvShow);
      // const listItem = document.createElement ('li');
      // // create image element
      // const image = document.createElement ('img');
      // image.src = tvShow.show.image.original;
      // image.alt = tvShow.show.name;
      // // create h2 element
      // const title = document.createElement ('h2');
      // const showName = tvShow.show.name;


      // // put show name inside h2
      // title.innerHTML = showName;



      // console.log(title);
      // // put image and title inside li
      // listItem.appendChild(image,title);

      // // append image to gallery
      // gallery.appendChild(listItem);
      // // gallery.appendChild(title);

      // create a new element
      newListItem.innerHTML = `
      <h2>${tvShow.show.name}</h2>
      <div class="imgContainer"><img src="${tvShow.show.image.original}" /></div>
      <p>${tvShow.show.summary}</p>
      <p>${tvShow.show.rating.average}</p>
      `;

      gallery.appendChild(newListItem);
   });
   // here we will be filtering which shows we want to show. 
   // or randomly select a show via mathrandom x mathfloor. 
   // tvShowArray[0].genres
   // tvShowArray[0].name
   // tvShowArray[0].averageRuntime  (ex: >= 60 filter )
   // tvShowArray[0].summary
   // tvShowArray[0].ratings
   // tvShowArray[0].image.original
   //
};



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