// name spaced app 
const app = {};

// url endpoint in a variable 
app.apiUrl = 'https://api.tvmaze.com/search/shows';

// call get tv show function, inside form submission. 
// app.userInput = document.getElementsByClassName('userInput');
app.addListeners = () => {

   document.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      app.getTvShows();
   });
}


// what the user inputs in the search bar 

// calling fetch to make GET request
app.getTvShows = () => {
   
   const input = document.querySelector('#showSearch');
   // console.log(input);
   // let userSearch = app.userInput[0].value;
   const url = new URL(app.apiUrl);
   url.search = new URLSearchParams({
      q: input.value
   });
   app.checkForm(input.value, url, url.search)


};

app.fetch = (url) => {
      fetch(url)
      .then(response => {
         // console.log(response)
         if(response.ok === true) {
            return response.json();
         } else {
            throw new Error(response.statusText);
         };
      })
      .then(function (jsonResult) {
         
         console.log(jsonResult);
         app.displayTvShows(jsonResult);
         // if (jsonResult = false) {
         //    console.log("no response");
         // };
         // app.checkForm(input.value, jsonResult)
      })
      .catch((error)=> {
         if(error.message === "Not Found") {
            alert('does not exist, something went wrong');
         } else {
            alert ('something went wrong');
         };
      });
}

app.checkForm = (form, url, search) => {
   console.log(form)
   if(form == '') {
      alert(`Error: Input is empty!`);
      // return false;
   }
   const spec = /^[\w ]+$/;
   if(!spec.test(form))  {
      alert(`Error: Input contains invalid characters!`);
      // return false;
   } else {
      app.fetch(url)
   }
   // return true;
}

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

   });
}

app.init = () => {
   // app.userSubmit = document.querySelector('form').addEventListener('submit', function () {
   //    console.log('it worked!');
   //    // app.getTvShows();
   // });
   app.addListeners();
};

app.init();


// *** NEXT STEPS ***
// error handling the forms for any incorrect user inputs
// pop up if there are no results. 
// API considers & appends anything remotely close to the user input (i.e submit and gives "summit, sbit, sunmi, subat");
// reset button (and display: none the search tab when a user searches once) MAYBEEE
// api only gives out 10 recommendations per search, coincidence?? (find a way to display more than 10+ recco's)
// limit the reccomendations to (maybe 5?)
// STRETCH GOAL: adding additional input to filter by ratings. & maybe genre???


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
