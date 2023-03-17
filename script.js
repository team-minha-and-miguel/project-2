// name spaced app
const app = {};
// variable that stores and connects to a html element
const gallery = document.querySelector('.gallery');



// url endpoint in a variable
app.apiUrl = 'https://api.tvmaze.com/search/shows';



// add listeners function that is called and waits for user change
app.addListeners = (jsonResult, form) => {

   // connecting class in html to variable
   app.languageForm = document.querySelector('#languageFilter');
   // connecting the language id in html to a variable
   app.selectElement = document.querySelector(`#language`);

   document.querySelector('form').addEventListener('submit', function (e) {
      // prevents app from refreshing on submit.
      e.preventDefault();
      // creating a class list that removes displayNone from form element.
      app.languageForm.classList.remove('displayNone');
      // on submit that always changes the form selection to its original "all results" selection.
      app.selectElement.value = "all";
      // calling function
      app.getTvShows();
   });

   // event listener that calls checkLanguage() on any user changes if theres data in the parameter.
   app.selectElement.addEventListener(`change`, function () {
      if(jsonResult){
         app.checkLanguage(jsonResult, this.value, form);
      };
   });
};





// function contains key API information which is used throughout app. 
app.getTvShows = () => {
   // storing input tag in a variable
   const input = document.querySelector('#showSearch');
   // storing url in a new URL to manipulate data within
   const url = new URL(app.apiUrl);
   // new search params
   url.search = new URLSearchParams({
      q: input.value
   });

   // call check form to determine if user search matches what is needed for correct search
   app.checkForm(input.value, url, url.search);

   // clears out search bar after submit after we have passed the data to the next function. 
   input.value = ``;
};




// check form function that checks for any special characters or no entry in the form.
app.checkForm = (form, url, search) => {
   const spec = /^[\w ]+$/;
   // if statement to check for no user entry
   if (form == '') {
      alert(`Error: Input is empty!`);
   }
   // if statement to check for any special characters, not accepted.
   else if (!spec.test(form)) {
      alert(`Error: Input contains invalid characters!`);
   } else {
      // if all above is true, then call fetch function
      app.fetch(url, form, search);
   };
};




// fetching information from the API
app.fetch = (url, form, search) => {
   fetch(url)
      .then(response => {
         // if statement that checks to see if theres an error, or returns json version
         if (response.ok === true) {
            return response.json();
         } else {
            throw new Error(response.statusText);
         };
      })
      // then() that calls functions with passed API data
      .then(function (jsonResult) {
         // calls add listeners function to pass jsonResults over for manipulation
         app.addListeners(jsonResult, form)
         // calls displayTvShows using the jsonResult data. 
         app.displayTvShows(jsonResult, form);
      })
      // catch function that alerts user depending on the type of error
      .catch((error) => {
         if (error.message === "Not Found") {
            alert('does not exist, something went wrong');
         } else {
            alert('something went wrong');
         };
      });
};




// function that checks to see which the language is selected by the user and creates an array, to push to the next function.
app.checkLanguage = (jsonResult, that, form) => {

   // setting an empty array for use below
   const englishArray = [];
   const noEnglishArray = [];

   // forEach method that loops through jsonResult data and pushes the correct object to the designated array
   jsonResult.forEach((tvShowArray) => {
      // destructured variable for use
      const { show } = tvShowArray;
      // if statement that separates objects by english and non-english shows
      if (show.language !== 'English') {
         // pushing non-english shows to an initially empty array
         noEnglishArray.push(tvShowArray);
      } else if (show.language === 'English') {
         // pushing english shows to an initally empty array
         englishArray.push(tvShowArray);
      } else {
         // if neither above are true, which it shouldn't, then do nothing. // maybe we dont need this. 
         console.log(tvShowArray);
      };
   });

   // if statement that checks to see what language user has selected
   if (that === 'noEnglish') {
      // calls function with array of non english shows passed as an arguement
      app.displayLanguageShows(noEnglishArray, form);
   } else if (that === 'english') {
      // calls function with array of english shows passed as an arguement
      app.displayLanguageShows(englishArray, form);
   } else {
      // if user does not select english or noEnglish, then call the original displayTvShows function
      app.displayTvShows(jsonResult, form);
   };
   
};




// displays the tv shows according to the language chosen by the user. 
app.displayLanguageShows = (tvShows, form) => {
   const tvResults = tvShows.length;
   
   // clear the gallery
   gallery.innerHTML = ``;

   // showing total results appended to the DOM for user view
   app.showUserResults(tvShows, form);

   // for loop to append each show to the DOM 
   for (let i = 0; i < tvResults; i++) {
      app.appendToDom(tvShows[i]);
   };
};





// function that displays shows to the DOM
app.displayTvShows = (tvShowArray, form) => {
   // clear gallery before displaying new search results
   gallery.innerHTML = ``;

   // showing total tv show results, appended to the DOM 
   app.showUserResults(tvShowArray, form);
   
   // forEach method that loops through every object in tvShowArray
   tvShowArray.forEach(tvShow => {
      //  function that called and passes every tvShow object as an arguement 
      app.appendToDom(tvShow);
   });
};




// function that shows user search total results
app.showUserResults = (tvShows, form) => {
   // storing the users input into a variable while capitalizing the first letter
   const userSearch = form[0].toUpperCase() + form.substring(1);
   // storing the array length in variable
   const tvResults = tvShows.length;
   // creating a variable and storing a new p element tag in it
   const totalResults = document.createElement('p');
   // appending html into variable with p tag
   totalResults.innerHTML = `
   Total Results for "<span class="bold">${userSearch}</span>" Found: ${tvResults}
   `;
   // appending totalResults p tag element as a child to gallery.
   gallery.appendChild(totalResults);
};





// appends the data to the dom every time the loop runs in the previous function
app.appendToDom = (tvShow) => {
   // destructured objects from tvShow array
   const { show } = tvShow;
   const { image, name, summary, rating, genres, averageRuntime, status, language } = show;

   // create li element stored in a variable
   const newListItem = document.createElement('li');
   // image path variable for use in new element creation, includes conditions for null image
   const imagePath = image ? image.original : 'https://placekitten.com/200/300';

   // alt text path variable for use in new element creation, includes conditions for placeholder image
   let altPath;
   // if statement that checks to see and adds placeholder if the object image is null
   if (image != null) {
      altPath = `Poster for ${name}`;
   } else {
      altPath = 'placeholder image';
   };

   // adding content into the li variable
   newListItem.innerHTML = `
      <h2>${name}</h2>
      <div class="imgContainer"><img src="${imagePath}" alt="${altPath}" /></div>
      <p>Summary:${summary}</p>
      <p>Rating: ${rating.average}</p>
      <p>Language: ${language}</p>
      <p>Genres: ${genres}</p>
      <p>Episode Length: ${averageRuntime} mins</p>
      <p>Show Current Status: ${status} </p>
      `;

   // append each entry to the gallery
   gallery.appendChild(newListItem);
}




// init function that loads the page. 
app.init = () => {
   app.addListeners();
};



// initial function call. 
app.init();




// -----------------------------------------------------


// GUIDE ON HOW APP WORKS SUMMARIZED (ORGANIZATION):

// 1. app.init() calls app.addListeners()
// 2. app.addListeners() waits for user change
// 3. if user submits, it calls app.getTvShow() & lets the language form appear on DOM
// 4. app.getTvShow calls app.checkForm()
// 5. app.checkForm() calls app.fetch()
// 6. app.fetch() passes info to app.addListeners, & calls app.displayTvShows()
// 7. app.displayTvShows() calls app.showUserResults() & app.appendToDom()
// 8. app.appendToDom() appends the data to DOM
// 9. when language form appears on DOM (see 3.), user changes form and calls app.checkLanguage()
// 10. app.checkLanguage() calls app.displayLanguageShows()
// 11. app.displayLanguageShows calls app.showUserResults(), & calls app.appendToDom()
// -- ** app ends & loops through these on user change ** -- 

// -------------------------------------------------------

// LONG UNNECESSARY VERSION. 

// 1. app.init() is called, which then calls app.addListeners()
// 2. app.addListeners connects variables to html elements, & has EventListeners that waits for user change
// 3. if user input a search, after submit, it prevents app from refreshing, allows the language form to appear, and calls getTvShow()
// 4. getTvShow() then connects variable to input element, takes the user's search and embeds it into the search params, 
// ^ calls the checkForm() with passed info, and then clears the user's search bar
// 5. checkForm() error handles any user search that shouldnt be searched, if the user search works with the app then it calls the app.fetch()
// 6. app.fetch() takes the data passed from checkForm(), and fetches the API info, parses data into json(), 
// then passes the info into both the app.addListeners() & also calls app.displayTvShows()
// 7. app.displayTvShows() takes the array and the user input as arguements, clears the gallery, calls app.showUserResults(), 
// and calls the app.appendToDom() every time it loops through the tvShowArray objects
// 8. app.showUserResults() takes the tvShowArray and user input, to append the # of results found in the search to the gallery in the DOM
// 9. app.appendToDom() takes the tvShow object, creates an li, and checks and adds placeholders if image is null, 
// once placeholders have been added to images, we append information into the li element, and then append it as a child to the gallery in the DOM
// 10. When the language form appears to the DOM, the addListeners waits for a form change which then 
// calls app.checkLanguage() if theres data being passed to it, and passes the jsonResult, user language selection value, and the user input
// 11. app.checkLanguage() takes the data passed, creates empty arrays, and using a forEach, loop through the objects 
// and pushes the object to the correct array. Once the arrays are completed, we use an if statement to check which language user has selected
// and then calls app.displayLanguageShows() 
// 12. app.displayLanguageShows() takes the data passed, clears the gallery, calls app.showUserResults(), 
// then uses for loop to go through every object in array, while calling app.appendToDom()


// -----------------------------------------------------


// *** PHASE THREE - NEXT STEPS ***

// POSSIBLE NEW GOAL: 

// 1. Find out what else we want to append to DOM (average run time, genres, statue, ended, etc);

// 2. we have the skeleton for creating a form to filter through any type of value in the API array, we could create it for others (i.e genre, etc)

// 3. possible fetch a new end point and see what we can add to our app with specific end point.

// Last - styling via SCSS. 


// -------------------------------------------------------

// *** PHASE TWO - COMPLETED ***

// 4. COMPLETED: find out why the second if statement is true, passes information, but does not clear the gallery like the "english" statement does
// 5. COMPLETED: fix the language form to always be at "all results", with every search & even when you refresh. 
// 6. COMPLETED - add a "how many results have shown : ${results}" shown on the DOM to let users know what was found. 
// 6a. COMPLETED - written twice in both displayLanguageShows & displayTvShows (maybe create a function to append results, to keep code clean?)
// 7. COMPLETED - Also same things here, create an appendData function that will append data once, instead of having it written twice in displayLanguageShows & displayTvShows - the newListItem.innerHTML & gallery.appendChild(newListItem);
// 8. COMPLETED - on submit, input value = ""
// 8a. COMPLETED -  change "total results found" to include input value

// ----------------------------------------------------------

// *** PHASE ONE - OLD STEPS ***

// ALMOST COMPLETED: STRETCH GOAL: adding additional input to filter by languages
// DONE - error handling the forms for any incorrect user inputs 
// DONE - pop up if there are no results.
// NOT NEEDED - API considers & appends anything remotely close to the user input (i.e submit and gives "summit, sbit, sunmi, subat");
// NOT NEEDED - reset button (and display: none the search tab when a user searches once) MAYBEEE
// NOT POSSIBLE? - api only gives out 10 recommendations per search, coincidence?? (find a way to display more than 10+ recco's)
// NO NEED, IT ONLY DISPLAYS 10 anyways - limit the reccomendations to (maybe 5?)

// ----------------------------------------------------------

// ORIGINAL PSUEDO CODE MVP:

// User gets to landing page, start button. ( no start button necessary )

// when user clicks start button, several buttons with keywords will populate the DOM.

// user will have options (created by us) to click which words they would like to choose from, which will then search the API according to that word.

// app displays the first 5 results of search.

// we will choose which key values to populate into each reccomendation (i.e. image, name, cast, etc).

// button (disabled for now) will appear after recommendations have been given out, to reset the app and send user back to main start page.


// *** STRETCH GOALS: ***
// NOT NECESSARY - Rather than giving out 5 reccomendations, it will randomly spit out 1 choice using Math.floor + Math.random();
// POSSIBLE - second level tier of filtering after previous query search, allowing user to get a more detailed reccomendation.
// COMPLETED - figuring out how to put an input as the query search params, allowing users to type what they want instead of clicking our given choices.