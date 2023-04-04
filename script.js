// ~ name spaced app ~ //
const app = {};

// globally scoped variable that stores and connects to a html element //
const gallery = document.querySelector('.gallery');
const results = document.querySelector('.results');

// inserting a intro message to user prior to app use. 
gallery.innerHTML = ` <p class="searchMessage">Waiting for a search ..</p> `;

// url endpoints stored in a variable //
app.apiUrl = 'https://api.tvmaze.com/search/shows';
app.apiUrlTwo = 'https://proxy.junocollege.com/https://api.tvmaze.com/shows';

// storing url in a new URL to manipulate data within //
const url = new URL(app.apiUrl);
const urlTwo = new URL(app.apiUrlTwo);

// empty variables to use for data within local scoped functions
app.englishArray = [];
app.noEnglishArray = [];
app.ratingValue = '';
app.languageValue = '';

// ~ add listeners function that is called and waits for user change ~ //
app.addListeners = (jsonResult, form) => {
   // counter variable //
   let counter = 0;
   // connecting class in html to variable //
   app.languageForm = document.querySelector('#languageFilter');
   app.ratingForm = document.querySelector('#ratingFilter');
   app.showCounter = document.querySelector('#showFilter');
   // connecting the language id in html to a variable //
   app.selectLanguage = document.querySelector(`#language`);
   // connecting the rating id in html to a variable //
   app.selectRating = document.querySelector(`#rating`);
   // connecting the showCounter id in html to a variable //
   app.selectCounter = document.querySelector(`#showCounter`);
   

   // event listener that waits for user submission //
   document.querySelector('form').addEventListener('submit', function (e) {
      
      // prevents app from refreshing on submit //
      e.preventDefault();
      
      // clearing out variables every time submit is clicked //
      app.englishArray = [];
      app.noEnglishArray = [];
      app.ratingValue = '';
      app.languageValue = '';

      // add 1 to the counter for loop break use.
      counter = counter + 1;

      // if counter reaches 1, stop the loop and possible alert in checkForm();
      if (counter > 1) {
         return;
      };

      // on submit that always changes the form selection to its original "all results" selection //
      app.selectLanguage.value = `all`;
      app.selectRating.value = `all`;

      // calling function to getTvShows //
      app.getTvShows();
   });


   // event listener that calls checkLanguage() on any user changes if theres data in the parameter //
   app.selectLanguage.addEventListener(`change`, function () {
      // if there's an arguement in the parameters, call function //
      if(jsonResult){
         app.checkLanguage(jsonResult, this.value, form);
      };
   });


   // show how many shows in a page event listener // 
   app.selectCounter.addEventListener(`change`, function(){
      // function call that fetches for data with new arguements //
      app.fetchAllShows(urlTwo, this.value);

      // storing userInput into empty variable //
      app.ratingValue = this.value;
   });
   
   // event listener that calls checkRating() on any user change if theres data in the parameter //
   app.selectRating.addEventListener(`change`, function(){
      // if data is available, call checkRating() //
      if (jsonResult) {
         app.checkRating(jsonResult, this.value, form);
      };
      // remove a class from html element //
      app.languageForm.classList.remove('displayNone');
   });
};




// ~ check rating changes the search depending on users choice of highest or lowest rated shows ~ //
app.checkRating = (jsonResult, userInput, form) => {
   // if statement that checks to see if language arrays are empty, if it is, then proceed to check rating with original API array
   if (app.englishArray.length === 0 && app.noEnglishArray.length === 0 ) {

      // if statement that checks to see what user selected //
      if (userInput === 'highest') {
         // sort array according to highest-lowest //
         jsonResult.sort((a, b) => {
            return b.show.rating.average - a.show.rating.average;
         });

         // clear the gallery //
         gallery.innerHTML = ``;
         // show user results found // 
         app.showUserResults(jsonResult, form);
         // forEach loop that goes through every object in array //
         jsonResult.forEach((tvShow) => {
            // append function on every show object
            app.appendToDom(tvShow, jsonResult);
         });

      } else if (userInput === 'lowest') {
         // sort method that arranges array according to lowest-highest //
         jsonResult.sort((a, b) => {
            return a.show.rating.average - b.show.rating.average;
         });

         // clear the gallery //
         gallery.innerHTML = ``;
         // show user results found //
         app.showUserResults(jsonResult, form);
         // forEach loop that goes through every object in array //
         jsonResult.forEach((tvShow) => {
            // function call to append data to DOM // 
            app.appendToDom(tvShow, jsonResult);
         });

      } else if (userInput === 'all') {
         // shuffle the array //
         app.shuffle(jsonResult);

         // clear the gallery //
         gallery.innerHTML = ``;
         // show user results found // 
         app.showUserResults(jsonResult, form);
         // forEach loop that goes through every object in array //
         jsonResult.forEach((tvShow) => {
            // function call that appends data to DOM // 
            app.appendToDom(tvShow, jsonResult);
         });
      };

   // other wise, if theres objects in the array, then use the data in these arrays instead of original array
   } else if (app.englishArray.length !== 0 || app.noEnglishArray.length !== 0) {
      // if user clicked english and highest rated shows 
      if (app.languageValue === 'english' && userInput === 'highest') {
         // sort the array //
         app.englishArray.sort((a, b) => {
            return b.show.rating.average - a.show.rating.average;
         });

         // clear the gallery //
         gallery.innerHTML = ``;
         // show user results found // 
         app.showUserResults(app.englishArray, form);
         // forEach loop that goes through every object //
         app.englishArray.forEach((tvShow) => {
            // function call to append data to DOM // 
            app.appendToDom(tvShow, jsonResult);
         });
      // if user clicked non english and highest rated shows //
      } else if(app.languageValue === 'noEnglish' && userInput === 'highest') {
         // sort the array //
         app.noEnglishArray.sort((a, b) => {
            return b.show.rating.average - a.show.rating.average;
         });

         // clear the gallery //
         gallery.innerHTML = ``;
         // show user results found // 
         app.showUserResults(app.noEnglishArray, form);
         // forEach loop that goes through every object //
         app.noEnglishArray.forEach((tvShow) => {
            // function call to append data to DOM // 
            app.appendToDom(tvShow, jsonResult);
         });
      // if user clicked english and lowest rated shows //
      } else if(app.languageValue === 'english' && userInput === 'lowest') {
         // sort the array //
         app.englishArray.sort((a, b) => {
            return a.show.rating.average - b.show.rating.average;
         });

         // clear the gallery //
         gallery.innerHTML = ``;
         // show user results found // 
         app.showUserResults(app.englishArray, form);
         // forEach loop that goes through every object //
         app.englishArray.forEach((tvShow) => {
            // function call to append data to DOM
            app.appendToDom(tvShow, jsonResult);
         });
      // if user clicked non english shows and lowest rated shows //
      } else if (app.languageValue === 'noEnglish' && userInput === 'lowest') {
         // sort the array //
         app.noEnglishArray.sort((a, b) => {
            return a.show.rating.average - b.show.rating.average;
         });

         // clear the gallery //
         gallery.innerHTML = ``;
         // show user results found //
         app.showUserResults(app.noEnglishArray, form);
         // forEach loop that goes through every object //

         app.noEnglishArray.forEach((tvShow) => {
            // function call to append data to DOM //
            app.appendToDom(tvShow, jsonResult);
         });
      } else if (app.languageValue === 'english' && userInput === 'all'){
         // shuffle the array //
         app.shuffle(app.englishArray);

         // clear the gallery //
         gallery.innerHTML = ``;
         // show user results found // 
         app.showUserResults(app.englishArray, form);
         // forEach loop that goes through every object in array //
         app.englishArray.forEach((tvShow) => {
            // function call that appends data to DOM // 
            app.appendToDom(tvShow, jsonResult);
         });
      } else if (app.languageValue === 'noEnglish' && userInput === 'all') {
         // shuffle the array //
         app.shuffle(app.noEnglishArray);
         // clear the gallery //

         gallery.innerHTML = ``;
         // show user results found // 
         app.showUserResults(app.noEnglishArray, form);
         // forEach loop that goes through every object in array //
         app.noEnglishArray.forEach((tvShow) => {
            // function call that appends data to DOM // 
            app.appendToDom(tvShow, jsonResult);
         });
      } else if (app.languageValue === 'all' && userInput === 'all') {
         // shuffle the array //
         app.shuffle(jsonResult);

         // clear the gallery //
         gallery.innerHTML = ``;
         // show user results found // 
         app.showUserResults(jsonResult, form);
         // forEach loop that goes through every object in array //
         jsonResult.forEach((tvShow) => {
            // function call that appends data to DOM // 
            app.appendToDom(tvShow, jsonResult);
         });
      } else if (app.languageValue === 'all' && userInput === 'highest') {
         // sort array according to highest-lowest //
         jsonResult.sort((a, b) => {
            return b.show.rating.average - a.show.rating.average;
         });

         // clear the gallery //
         gallery.innerHTML = ``;
         // show user results found // 
         app.showUserResults(jsonResult, form);
         // forEach loop that goes through every object in array //
         jsonResult.forEach((tvShow) => {
            // append function on every show object
            app.appendToDom(tvShow, jsonResult);
         });
      } else if (app.languageValue === 'all' && userInput === 'lowest') {
         // sort method that arranges array according to lowest-highest //
         jsonResult.sort((a, b) => {
            return a.show.rating.average - b.show.rating.average;
         });

         // clear the gallery //
         gallery.innerHTML = ``;
         // show user results found //
         app.showUserResults(jsonResult, form);
         // forEach loop that goes through every object in array //
         jsonResult.forEach((tvShow) => {
            // function call to append data to DOM // 
            app.appendToDom(tvShow, jsonResult);
         });
      };
   };
};




// ~ function contains key API information which is used throughout app ~ //
app.getTvShows = () => {
   // storing input tag in a variable //
   const input = document.querySelector('#showSearch');

   // new search params //
   url.search = new URLSearchParams({
      q: input.value
   });

   // call check form to determine if user search matches what is needed for correct search //
   app.checkUserForm(input.value, url);

   // clears out search bar after submit after we have passed the data to the next function //
   input.value = ``;
};




// ~ check form function that checks for any special characters or no entry in the form ~ //
app.checkUserForm = (form, url) => {
   // variable that contains regex for all special characters // 
   const spec = /^[\w ]+$/;

   // if statement to check for no user entry //
   if (form == '') {
      alert(`Error: Input is empty!`);
   }
   // if statement to check for any special characters, not accepted //
   else if (!spec.test(form)) {
      alert(`Error: Input contains invalid characters!`);
   } else {
      // if all above is true, then call fetch function //
      app.fetch(url, form);

      // creating a class list that removes displayNone from form elements to make it appear to DOM //
      app.languageForm.classList.remove('displayNone');
      app.ratingForm.classList.remove('displayNone');
   };
};





// ~ fetching information from the API ~ //
app.fetch = (url, form) => {
   fetch(url)
      .then(response => {
         // if statement that checks to see if theres an error, or returns json version //
         if (response.ok === true) {
            return response.json();
         } else {
            throw new Error(response.statusText);
         };
      })
      // then() that calls functions with passed API data //
      .then(function (jsonResult) {
         // calls add listeners function to pass jsonResults over for manipulation //
         app.addListeners(jsonResult, form);
         // calls displayTvShows using the jsonResult data //
         app.displayTvShows(jsonResult, form);
      })
      // catch function that alerts user depending on the type of error //
      .catch((error) => {
         if (error.message === "Not Found") {
            alert('does not exist, something went wrong');
         } else {
            alert('something went wrong');
         };
      });
   };






// ~ function that checks to see which the language is selected by the user and creates an array, to push to the next function ~ //
app.checkLanguage = (jsonResult, userInput, form) => {
   app.languageValue = '';

   // setting an empty array for use below //
   app.englishArray = [];
   app.noEnglishArray = [];

   // forEach method that loops through jsonResult data and pushes the correct object to the designated array //
   jsonResult.forEach((tvShowArray) => {
      // destructured variable for use //
      const { show } = tvShowArray;
      // if statement that separates objects by english and non-english shows //
      if (show.language !== 'English') {
         // pushing non-english shows to an initially empty array //
         app.noEnglishArray.push(tvShowArray);
      } else if (show.language === 'English') {
         // pushing english shows to an initally empty array //
         app.englishArray.push(tvShowArray);
      };
   });
   
   // storing userInput into the languageValue variable // 
   app.languageValue = userInput;
   // if statement that checks to see what language user has selected //
   if (userInput === 'noEnglish') {
      // calls function with array of non english shows passed as an arguement //
      app.displayTvShows(app.noEnglishArray, form, userInput);
      // app.addListeners(jsonResult, form, noEnglishArray)
   } else if (userInput === 'english') {
      // calls function with array of english shows passed as an arguement //
      app.displayTvShows(app.englishArray, form, userInput);
      // app.addListeners(jsonResult, form, englishArray);
   } else if (userInput === 'all') {
   // if user does not select english or noEnglish, then call the original displayTvShows function //
   app.displayTvShows(jsonResult, form, userInput);
   };
};






// ~ function that displays shows to the DOM ~ //
app.displayTvShows = (tvShows, form, userInput) => {
   // clear gallery before displaying new search results //
   gallery.innerHTML = ``;

   if(userInput ===  `english` || `noEnglish`) {
      // storing the length of array in variable // 
      const tvResults = tvShows.length;
      // showing total results appended to the DOM for user view //
      app.showUserResults(tvShows, form);

      // for loop to append each show to the DOM //
      for (let i = 0; i < tvResults; i++) {
         app.appendToDom(tvShows[i], tvShows);
      };
   } else {
      // showing total tv show results, appended to the DOM //
      app.showUserResults(tvShows, form);
      
      // forEach method that loops through every object in tvShowArray //
      tvShows.forEach(tvShow => {
         // function that called and passes every tvShow object as an arguement //
         app.appendToDom(tvShow, tvShows);
      });
   };
};



// ~ appends the data to the dom every time the loop runs in the previous function ~ //
app.appendToDom = (tvShow, jsonResult) => {

   // create li element stored in a variable //
   const newListItem = document.createElement('li');
   // adding class to html element //
   newListItem.classList.add('showContainer');

   // if there is no data in the tvShow.show // 
   if (tvShow.show === undefined) {
      // destructured objects // 
      const { image, name, summary, rating, genres, averageRuntime, status, language } = tvShow;
      // image path variable for use in new element creation, includes conditions for null image //
      const imagePath = image ? image.original : 'https://placekitten.com/200/300';

      // alt text path variable for use in new element creation, includes conditions for placeholder image //
      let altPath;
      // if statement that checks to see and adds placeholder if the object image is null //
      if (image != null) {
         altPath = `Poster for ${name}`;
      } else {
         altPath = 'placeholder image';
      };

      // adding content into the li variable //
      newListItem.innerHTML = `
         <h2 class="tvTitle">${name}</h2>
         <div class="imgContainer">
         <img src="${imagePath}" alt="${altPath}" id="img"/>
         ${summary}
         </div>
         <div class="infoContainer">
            <div class="summaryContainer displayNone">
               <p><span class="showInfo">Summary:</span> ${summary}</p>
            </div>
            <p><span class="showInfo">Rating:</span>  ${rating.average}</p>
            <p><span class="showInfo">Language:</span>  ${language}</p>
            <p><span class="showInfo">Genres:</span>  ${genres}</p>
            <p><span class="showInfo">Episode Length:</span>  ${averageRuntime} mins</p>
            <p><span class="showInfo">Show Current Status:</span>  ${status}</p>
         </div> `;
   } else {
      // destructured objects from tvShow array //
      const { show } = tvShow;
      const { image, name, summary, rating, genres, averageRuntime, status, language } = show; 
      // image path variable for use in new element creation, includes conditions for null image //
      const imagePath = image ? image.original : 'https://placekitten.com/200/300';
   
      // alt text path variable for use in new element creation, includes conditions for placeholder image //
      let altPath;
      // if statement that checks to see and adds placeholder if the object image is null //
      if (image != null) {
         altPath = `Poster for ${name}`;
      } else {
         altPath = 'placeholder image';
      };
      
      // adding content into the li variable //
      newListItem.innerHTML = `
      <h2 class="tvTitle">${name}</h2>
      <div class="imgContainer">
      <img src="${imagePath}" alt="${altPath}" id="img"/>
      ${summary}
      </div>
      <div class="infoContainer">
         <div class="summaryContainer displayNone">
            <p><span class="showInfo">Summary:</span> ${summary}</p>
         </div>
         <p><span class="showInfo">Rating:</span>  ${rating.average}</p>
         <p><span class="showInfo">Language:</span>  ${language}</p>
         <p><span class="showInfo">Genres:</span>  ${genres}</p>
         <p><span class="showInfo">Episode Length:</span>  ${averageRuntime} mins</p>
         <p><span class="showInfo">Show Current Status:</span>  ${status}</p>
      </div> `;
   };

   // append each entry to the gallery //
   gallery.appendChild(newListItem);

   app.array = document.querySelectorAll('li');
   
   // adding +1 to the counter variable every time it loops //
   app.domCounter++;
};





// ~ function that shows user search total results ~ //
app.showUserResults = (tvShows, form) => {
   // clearing innerHTML in results element //
   results.innerHTML = ``;
   // storing the users input into a variable while capitalizing the first letter //
   const userSearch = form[0].toUpperCase() + form.substring(1);

   // storing the array length in variable //
   const tvResults = tvShows.length;

   // creating a variable and storing a new p element tag in it //
   const totalResults = document.createElement('p');
   totalResults.classList.add('totalResults');

   // appending html into variable with p tag //
   totalResults.innerHTML = `
      Total Results for "<span class="bold">${userSearch}</span>" Found: ${tvResults}
   `;

   if(tvResults == 0) {
      app.noSearchFound();
   };

   // appending totalResults p tag element as a child to gallery //
   results.appendChild(totalResults);
};



// function that shuffles array and returns new value when called //
app.shuffle = (array) => {
   let currentIndex = array.length, randomIndex;

   // While there remain elements to shuffle. //
   while (currentIndex != 0) {

      // Pick a remaining element //
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element. //
      [array[currentIndex], array[randomIndex]] = [
         array[randomIndex], array[currentIndex]];
   };

   return array;
};


// function that is called when 0 results are found //
app.noSearchFound = () => {
   gallery.innerHTML = ` <h3 class="searchMessage"> OOPS... SORRY, NOTHING FOUND. TRY AGAIN :( </h3> `;
}




// ------ SHOW ALL TV SHOWS BY PAGES FEATURE BRANCH ------ // 




// ~ globally scoped variables that connect to html elements ~ // 

// search by name feature branch variables //
const pages = document.querySelector('.pages');
const showSearchTitle = document.querySelector('.searchShowByName');
const searchByName = document.querySelector('.searchByName');

// show all shows in pages feature branch variables
const showPageTitle = document.querySelector('.searchShowByPages');
const showPagesButton = document.querySelector('.showAllPages');



// ~ show pages button that listens for user click, display:none elements and fetch's 2nd endpoint data ~ // 
showPagesButton.addEventListener('click', function(){
   // data needed for specific end point fetch //
   const input = document.querySelector('#pageNumberOne');
   // new search params with values based on user choice //
   urlTwo.search = new URLSearchParams({
      page: input.value
   });

   // fetching all shows function, with passed arguments //
   app.fetchAllShows(urlTwo, input.value, urlTwo.search);

   // storing search bar to a variable //
   app.searchBar = document.querySelector(`#searchBar`);
   // clearing the gallery in the DOM // 
   gallery.innerHTML = ``;

   // adding a class to html elements //
   app.searchBar.classList.add('displayNone');
   app.languageForm.classList.add('displayNone');
   app.ratingForm.classList.add('displayNone');
   results.classList.add('displayNone');
   showPagesButton.classList.add('displayNone');
   showSearchTitle.classList.add('displayNone');
   
   // removing a class to html elements //
   results.classList.remove('displayNone');
   searchByName.classList.remove('displayNone');
   showPageTitle.classList.remove('displayNone');
   app.showCounter.classList.remove('displayNone');

   results.innerHTML = ``;
});



// ~ search by name button that appears when show all page button is clicked, when searchByName is clicked by user, clear gallery, and return app to original state ~ //
searchByName.addEventListener('click', function(){
   // clear the gallery in the DOM //
   gallery.innerHTML = ` <p class="searchMessage"> Waiting for a search...</p> `;

   // adding a class to html elements //
   searchByName.classList.add('displayNone');
   app.showCounter.classList.add('displayNone');
   showPageTitle.classList.add('displayNone');

   // removing a class to html elements //
   app.searchBar.classList.remove('displayNone');
   showPagesButton.classList.remove('displayNone');
   showSearchTitle.classList.remove('displayNone');
});




// array containing the data necessary to create page buttons using forEach loops //
app.pageClickers = [
   {
      value: 1,
      name: 1,
      class: 'pageNumberOne',
      classTwo: 'page'
   },
   {
      value: 2,
      name: 2,
      class: 'pageNumberTwo',
      classTwo: 'page'
   },
   {
      value: 3,
      name: 3,
      class: 'pageNumberThree',
      classTwo: 'page'
   },
   {
      value: 4,
      name: 4,
      class: 'pageNumberFour',
      classTwo: 'page'
   },
   {
      value: 5,
      name: 5,
      class: 'pageNumberFive',
      classTwo: 'page'
   },
   {
      value: 6,
      name: 6,
      class: 'pageNumberSix',
      classTwo: 'page'
   },
   {
      value: 7,
      name: 7,
      class: 'pageNumberSeven',
      classTwo: 'page'
   },
   {
      value: 8,
      name: 8,
      class: 'pageNumberEight',
      classTwo: 'page'
   },
   {
      value: 9,
      name: 9,
      class: 'pageNumberNine',
      classTwo: 'page'
   },
   {
      value: 10,
      name: 10,
      class: 'pageNumberTen',
      classTwo: 'page',
   }
];



// empty array for use later below //
app.buttonArray = [];



// forEach method that loops through each array to create a button for each page and append/fetch data according to which newly created button is clicked by user // 
app.pageClickers.forEach((button) => {
   // html element creation stored in variable //
   const listItem = document.createElement('li');
   listItem.classList.add('listedButtons');
   const pageButtons = document.createElement('button');


   // adding data to html element values with pageClicker information // 
   pageButtons.value = button.value;
   pageButtons.className = `${button.class} ${button.classTwo} displayNone`;
   pageButtons.id = button.class;

   // page number being appended into the DOM of each button // 
   pageButtons.innerHTML = ` ${button.name} `;

   // append each button in the array to the html element within the DOM //
   listItem.appendChild(pageButtons)
   pages.appendChild(listItem);

   // addEventListener that fetches all tv show pages depending on which user clicks //
   pageButtons.addEventListener('click', function() {
      // changing the query value of the url according to what page user clicks // 
      urlTwo.search = new URLSearchParams({
         page: button.value
      });
      // fetch all show functions //
      app.fetchAllShows(urlTwo, button.value);
      // if statement that checks if array is empty, if it is, then add a class and push info to array. This is to check if a page button is already clicked. //
      if(app.buttonArray.length === 0) {
         // add a class to the selected page button //
         pageButtons.classList.add('selected');
         // pushing data into array
         app.buttonArray.push(button, pageButtons);
      // else if there is something in the array, remove the class from the previous click, and then add the class to the new button clicked //
      } else if (app.buttonArray.length !== 0) {
         const thisButton = document.getElementById(`${app.buttonArray[1].id}`);
         // adding/removing classes from html element //
         thisButton.classList.remove('selected');
         pageButtons.classList.add('selected');
         // clear the array //
         app.buttonArray = [];
         // push new info into the array //
         app.buttonArray.push(button, pageButtons);
      };
   });

   // remove class in a html element when button is clicked //
   showPagesButton.addEventListener('click', function(){
      pageButtons.className = `${button.class} ${button.classTwo}`;
   });

   // add class in a html element when button is clicked // 
   searchByName.addEventListener('click', function(){
      pageButtons.className = `${button.class} ${button.classTwo} displayNone`;
   });
});




// ~ fetch function that gathers data using the 2nd endpoint ~ //
app.fetchAllShows = (urlTwo, form) => {
   // second fetch for additonal data. 
   fetch(urlTwo)
      .then(response => {
         if (response.ok === true) {
            return response.json();
         } else {
            throw new Error(response.statusText);
         };
      })
      .then(function (jsonResult) {

         // calling secondary display function for the next app feature // 
         app.displayAllShowPages(jsonResult, form);
      });
};




// ~ displays tvShows in pages for the 2nd endpoint feature branch ~ //
app.displayAllShowPages = (allShows, userInput) => {
   // clear gallery in the DOM //
   gallery.innerHTML = ``;
   // creating a changable variable with a value of 0 //
   let tvShowsCounter = 0;

   // forEach method that appends the data to the DOM //
   allShows.forEach((show) => {
      // userInput is initially at a value of one, since we call the fetch before the page button click (which has the correct value), so if userInput is 1 & app.ratingValue is empty, then change it to 10 (the first selection value in the form) //
      if (userInput == '1' && app.ratingValue == '') {
         // if tvShowCounter is larger than 10, stop loop, else keep calling function //
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendToDom(show, allShows);
            // app.appendAllShowsToDom(show);
         };
         // if userInput is 1 but app.ratingValue isnt empty
      } else if (userInput == '1' && app.ratingValue !== '') {
         // then compare tvShowsCounter to the app.ratingValue instead of userInput
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendToDom(show, allShows)
         };
      } else if (userInput == '2' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendToDom(show, allShows);
         };
         // otherwise, if userInput is not = 1, then still check as usual.
      } else if (userInput == '2' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendToDom(show, allShows)
         }
      } else if (userInput == '3' && app.ratingValue == ''){
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendToDom(show, allShows);
         };
      } else if (userInput == '3' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendToDom(show, allShows)
         }
      } else if (userInput == '4' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendToDom(show, allShows);
         };
      } else if (userInput == '4' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendToDom(show, allShows)
         }
      } else if (userInput == '5' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendToDom(show, allShows);
         };
      } else if (userInput == '5' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendToDom(show, allShows)
         }
      } else if (userInput == '6' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendToDom(show, allShows);
         };
      } else if (userInput == '6' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendToDom(show, allShows)
         }
      } else if (userInput == '7' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendToDom(show, allShows);
         };
      } else if (userInput == '7' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendToDom(show, allShows)
         }
      } else if (userInput == '8' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendToDom(show, allShows);
         };
      } else if (userInput == '8' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendToDom(show, allShows)
         }
      } else if (userInput == '9' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendToDom(show, allShows);
         };
      } else if (userInput == '9' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendToDom(show, allShows)
         }
      } else if (userInput == '10' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendToDom(show, allShows);
         };
      } else if (userInput == '10' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendToDom(show, allShows)
         }
      } else {
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendToDom(show, allShows);
         };
      };

      // shuffle allShows Array every time function is called to give variety. 
      app.shuffle(allShows);
      
      // stops the forEach method from continuing to append data after userChoice
      if (tvShowsCounter === userInput) {
         return;
      };
      
      // add + 1 to the tvShowCounter // 
      tvShowsCounter = tvShowsCounter + 1;
   });
};

// ------ ** SHOW ALL SHOWS IN PAGES FEATURE BRANCH ENDS ** ------ //



// init function that loads the page //
app.init = () => {
   app.addListeners();
};



// initial function call to start the app //
app.init();

