// name spaced app
const app = {};
const gallery = document.querySelector('.gallery');



// url endpoint in a variable
app.apiUrl = 'https://api.tvmaze.com/search/shows';




// app.userInput = document.getElementsByClassName('userInput');
app.addListeners = (jsonResult) => {
   // connecting class in html to variable which then listens for a submit, and calls function()
   document.querySelector('form').addEventListener('submit', function (e) {
      // prevents app from refreshing on submit.
      e.preventDefault();
      // calling function
      app.getTvShows();
   });

   // connecting the language id in html to a variable
   app.selectElement = document.querySelector(`#language`);
   // event listener that calls checkLanguage() on any user changes
   app.selectElement.addEventListener(`change`, function () {
      // app.displayTvShows(jsonResult);
      if(jsonResult){
         app.checkLanguage(jsonResult, this.value)
      } 
      // console.log(jsonResult);
   });
};

// option: wrap app.selectElement in an if statement to determine if jsonResult is true then checkLanguage or !== 'undefined'
// or put it in another function 


// function contains key API information which is used throughout app. 
app.getTvShows = () => {
   // storing input tag in a variable
   const input = document.querySelector('#showSearch');
   // storing url in a new URL to manipulate data within
   const url = new URL(app.apiUrl);
   // search params
   url.search = new URLSearchParams({
      q: input.value
   });
   // call check form to determine if user search matches what is needed for correct search
   app.checkForm(input.value, url, url.search);
};




// check form function that checks for any special characters or no entry in the form.
app.checkForm = (form, url, search) => {
   // if statement to check for no user entry
   if (form == '') {
      alert(`Error: Input is empty!`);
   };
   const spec = /^[\w ]+$/;
   // if statement to check for any special characters, not accepted.
   if (!spec.test(form)) {
      alert(`Error: Input contains invalid characters!`);
   } else {
      // if all above is true, then call fetch function
      app.fetch(url, search);
   };
};



// fetching information from the API
app.fetch = (url, search) => {
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
         app.addListeners(jsonResult)
         // calls displayTvShows using the jsonResult data. 
         app.displayTvShows(jsonResult);
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



// separate into 2 functions 
// 1 being to sort the english and non english , into array - maybe in the fetch? def in the fetch
// when they do select on change, then call the function to display the correct array. 



// function that checks to see which the language is selected by the user and creates an array, to push to the next function.
app.checkLanguage = (jsonResult, that) => {
   console.log(that);
   const englishArray = [];
   const noEnglishArray = [];
   jsonResult.forEach((tvShowArray) => {
      const { show } = tvShowArray;
      if (show.language !== 'English') {
         noEnglishArray.push(tvShowArray);
         // console.log(noEnglishArray);
         // this statement is correct, pushes the right objects in the array, and calls the function with passed info.
      } else if (show.language === 'English') {
         englishArray.push(tvShowArray);
         // console.log(englishArray);
      } else {
         // if neither above are true, then remain calling the displayTvShow() function to show all results.
         console.log(tvShowArray);
      };
   });
   if (that === 'noEnglish') {
      app.displayLanguageShows(noEnglishArray);
   } else if (that === 'english') {
      app.displayLanguageShows(englishArray);
   } else {
      app.displayTvShows(jsonResult);
   }
   
};




// displays the tv shows according to the language chosen by the user. 
app.displayLanguageShows = (tvShows) => {
   // clear the gallery.innerHTML = ``;
   // second if statement, passes info correctly here, but does not clear the gallery like the others if statements would. 
   gallery.innerHTML = ``;
   // console.log(tvShows);

   // showing total results appended to the DOM for user view
   app.showUserResults(tvShows);

   const tvResults = tvShows.length;

   // for loop to append each show to the DOM 
   for (let i = 0; i < tvResults; i++) {
      // app.appendToDom(tvShows);

      // destructured variables. 
      const { show } = tvShows[i];
      const { image, name, summary, rating } = show;
      // console.log(show);
      // creating an li element and storing in variable
      const newListItem = document.createElement('li');
      // checking to see if image is not true, then put a placeholder image instead.
      const imagePath = image ? image.original : 'https://placekitten.com/200/300';
      // checking to see if image is null, then change alt tag accordingly.
      let altPath;
      if (image != null) {
         altPath = `Poster for ${name}`;
      } else {
         altPath = 'placeholder image';
      };

      // appending information into li element using template literals 
      // app.appendToDom() function for this???

      newListItem.innerHTML = `
      <h2>${name}</h2>
      <div class="imgContainer"><img src="${imagePath}" alt="${altPath}" /></div>
      <p>${summary}</p>
      <p>${rating.average}</p>
      `;

      // append each li entry to the gallery variable
      gallery.appendChild(newListItem);
   };
};





// function that displays shows to the DOM
app.displayTvShows = (tvShowArray) => {
   // console.log(tvShowArray);
   // clear gallery before displaying new search results
   gallery.innerHTML = ``;

   // showing total tv show results, appended to the DOM 
   app.showUserResults(tvShowArray) 


   tvShowArray.forEach(tvShow => {

      // app.appendToDom(tvShow);
      // destructured objects from tvShow array
      const { show } = tvShow;
      const { image, name, summary, rating} = show;

      // create li element stored in a variable
      const newListItem = document.createElement('li');
      // image path variable for use in new element creation, includes conditions for null image
      const imagePath = image ? image.original : 'https://placekitten.com/200/300';

      // alt text path variable for use in new element creation, includes conditions for placeholder image
      let altPath;
      if (image != null) {
         altPath = `Poster for ${name}`;
      } else {
         altPath = 'placeholder image';
      };

      // create a new element
      newListItem.innerHTML = `
      <h2>${name}</h2>
      <div class="imgContainer"><img src="${imagePath}" alt="${altPath}" /></div>
      <p>${summary}</p>
      <p>${rating.average}</p>
      `;

      // append each entry to the gallery
      gallery.appendChild(newListItem);
   });
};




// function that shows user search total results
app.showUserResults = (tvShows) => {
   // storing the array length in variable
   const tvResults = tvShows.length;
   // creating a variable and storing a new p element tag in it
   const totalResults = document.createElement('p');
   // appending html into variable with p tag
   totalResults.innerHTML = `
   Total Results Found: ${tvResults}
   `;
   // appending totalResults p tag element as a child to gallery.
   gallery.appendChild(totalResults);
};





// // havent tested this yet, but will check. UPDATE: checked it, and for some reason the parameters arent passing correctly between the displayLanguage & displayTvShows functions, test with minha.

// appends the data to the dom every time the loop runs in the previous function calling it. 

// app.appendToDom = (tvShow) => {
//    // destructured objects from tvShow array
//    const { show } = tvShow;
//    const { image, name, summary, rating } = show;

//    // create li element stored in a variable
//    const newListItem = document.createElement('li');
//    // image path variable for use in new element creation, includes conditions for null image
//    const imagePath = image ? image.original : 'https://placekitten.com/200/300';

//    // alt text path variable for use in new element creation, includes conditions for placeholder image
//    let altPath;
//    if (image != null) {
//       altPath = `Poster for ${name}`;
//    } else {
//       altPath = 'placeholder image';
//    };

//    // create a new element
//    newListItem.innerHTML = `
//       <h2>${name}</h2>
//       <div class="imgContainer"><img src="${imagePath}" alt="${altPath}" /></div>
//       <p>${summary}</p>
//       <p>${rating.average}</p>
//       `;

//    // append each entry to the gallery
//    gallery.appendChild(newListItem);
// }




// init function that loads the page. 
app.init = () => {
   app.addListeners();
};



// initial function call. 
app.init();

// -----------------------------------------------------

// ISSUES I CURRENTLY HAVE:
// My observations: the arrays are being console.logged correctly, showing the shows that are specifically english or no english, 
// all results & english only append results in the DOM correctly,
// but i think when i click no english, it isnt clearing out and appending the new data.


// REASON: The second if statement is true, it does call getLanguageShows() and pass the parameter to the function,
// you can console.log the passed data in the new function, but for some reason its not clearing out the gallery,
// but if you get the first if statement, its able to clear the gallery and append to the DOM
// WHAT TO DO: find out why the second if statement is true, passes information, but does not clear the gallery like the "english" statement does
// example to replicate it: "hungry" in the user input, try all selections. 


// ----------------------------------------------------

// POSSIBLE NEW GOAL: 
//  fix the language form to always be at "all results", with every search & even when you refresh. 

// 1. COMPLETED - add a "how many results have shown : ${results}" shown on the DOM to let users know what was found. 
// 1a. COMPLETED - written twice in both displayLanguageShows & displayTvShows (maybe create a function to append results, to keep code clean?)

// 2. ATTEMPTED W/ ISSUES - Also same things here, create an appendData function that will append data once, instead of having it written twice in displayLanguageShows & displayTvShows
// ^ the newListItem.innerHTML & gallery.appendChild(newListItem);

// 3. Find out what else we want to append to DOM (average run time, genres, statue, ended, etc);

// 4. possible fetch a new end point and see what we can add to our app with specific end point.

// Last - styling via SCSS. 


// -----------------------------------------------------




// ----------------------------------------------------------

// *** PHASE ONE - NEXT STEPS ***

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


// STRETCH GOALS››:
// Rather than giving out 5 reccomendations, it will randomly spit out 1 choice using Math.floor + Math.random();
// second level tier of filtering after previous query search, allowing user to get a more detailed reccomendation.
// figuring out how to put an input as the query search params, allowing users to type what they want instead of clicking our given choices.