// ~ name spaced app ~ //
const app = {};

// globally scoped variable that stores and connects to a html element //
const gallery = document.querySelector('.gallery');
const results = document.querySelector('.results');


// url endpoints stored in a variable //
app.apiUrl = 'https://api.tvmaze.com/search/shows';
app.apiUrlTwo = 'https://proxy.junocollege.com/https://api.tvmaze.com/shows';


// storing url in a new URL to manipulate data within //
const url = new URL(app.apiUrl);
const urlTwo = new URL(app.apiUrlTwo);

app.englishArray = [];
app.noEnglishArray = [];

app.ratingValue = '';


// ~ add listeners function that is called and waits for user change ~ //
app.addListeners = (jsonResult, form, array) => {
   // counter variable 
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
      // add 1 to the counter for loop break use.
      counter = counter + 1;
      console.log(counter)
      // if counter reaches 1, stop the loop and possible alert in checkForm();
      if (counter > 1) {
         return;
      }
      // prevents app from refreshing on submit //
      e.preventDefault();

      // on submit that always changes the form selection to its original "all results" selection //
      app.selectLanguage.value = `all`;
      app.selectRating.value = `all`;

      // calling function to getTvShows //
      app.getTvShows();
   });

   // event listener that calls checkLanguage() on any user changes if theres data in the parameter //
   app.selectLanguage.addEventListener(`change`, function () {

      if(jsonResult){
         app.checkLanguage(jsonResult, this.value, form);
      };
   });
   
   // show how many shows in a page event listener // `
   app.selectCounter.addEventListener(`change`, function(){

      // function call that fetches for data with new arguements
      app.fetchAllShows(urlTwo, this.value);
      app.ratingValue = this.value;
      console.log(app.ratingValue)
   });
   
   // event listener that calls checkRating() on any user change if theres data in the parameter //
   app.selectRating.addEventListener(`change`, function(){

      // if data is available, call checkRating() //
      if (jsonResult) {
         app.checkRating(jsonResult, this.value, form);
      };
      app.languageForm.classList.remove('displayNone');
   });
   
};


// ~ check rating changes the search depending on users choice of highest or lowest rated shows ~ //
app.checkRating = (jsonResult, userInput, form) => {
   // if statement that checks to see what user selected //
   if (userInput === 'highest') {
      // sort method that arranges array according to highest-lowest
      jsonResult.sort((a, b) => {
         return b.show.rating.average - a.show.rating.average;
      });
   } else if (userInput === 'lowest') {
      // sort method that arranges array according to lowest-highest
      jsonResult.sort((a, b) => {
         return a.show.rating.average - b.show.rating.average;
      });
      // console.log(jsonResult)
   } else if (userInput === 'all') {
         // console.log('it worked', jsonResult)
      app.shuffle(jsonResult);

      // return jsonResult;
   }
   console.log(jsonResult, userInput)

   // clearing gallery in the DOM //
   gallery.innerHTML = ``;

   // ** CANNOT FIGURE OUT THE IF STATEMENT TO WORK. ** // 

   // if statement to see if we have an array, then use that info to the appendToDom() //
   // if (array[0].show.language === 'English') {
   //    console.log('yay')
   //    app.showUserResults(array, form)
   //    array.forEach((tvShow) => {
   //       // console.log(`${tvShow.show.rating.average}`, array);
   //       app.appendToDom(tvShow)
   //    });
   // } else {

   // show user result with next function, using data as arguements.
   app.showUserResults(jsonResult, form);

   // forEach method which will loop through array and append each to next function
   jsonResult.forEach((tvShow) => {

      app.appendToDom(tvShow);
   });
   // };
};




// ~ function contains key API information which is used throughout app ~ //
app.getTvShows = () => {
   // storing input tag in a variable //
   const input = document.querySelector('#showSearch');

   // new search params //
   url.search = new URLSearchParams({
      q: input.value
   });
   console.log(input.value)

   // call check form to determine if user search matches what is needed for correct search //
   app.checkUserForm(input.value, url);

   // clears out search bar after submit after we have passed the data to the next function //
   input.value = ``;
};




// ~ check form function that checks for any special characters or no entry in the form ~ //
app.checkUserForm = (form, url) => {
   // counter = counter + 1;
   // console.log(form, counter)
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
      // app.languageForm.classList.remove('displayNone');
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
   // counter = 0;

   // setting an empty array for use below //
   app.englishArray = [];
   app.noEnglishArray = [];

   // forEach method that loops through jsonResult data and pushes the correct object to the designated array //
   jsonResult.forEach((tvShowArray) => {
      // counter = counter +1;
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
      //  else {
         //    console.log(tvShowArray);
         // };
   });
      
   // if statement that checks to see what language user has selected //
   if (userInput === 'noEnglish') {
      // calls function with array of non english shows passed as an arguement //
      app.displayLanguageShows(app.noEnglishArray, form, jsonResult, userInput);
      // app.addListeners(jsonResult, form, noEnglishArray)
   } else if (userInput === 'english') {
      // calls function with array of english shows passed as an arguement //
      app.displayLanguageShows(app.englishArray, form, jsonResult, userInput);
      // app.addListeners(jsonResult, form, englishArray);
   } else {
   // if user does not select english or noEnglish, then call the original displayTvShows function //
   app.displayTvShows(jsonResult, form);
   };
   
};







// ~ displays the tv shows according to the language chosen by the user ~ //
app.displayLanguageShows = (tvShows, form, jsonResult, userInput) => {

   // tv show counter variable //
   const tvResults = tvShows.length;
   
   // clear the gallery //
   gallery.innerHTML = ``;

   // showing total results appended to the DOM for user view //
   app.showUserResults(tvShows, form);

   // for loop to append each show to the DOM //
   for (let i = 0; i < tvResults; i++) {
      app.appendToDom(tvShows[i]);
      console.log(tvShows[i], tvShows.length);
   };
};





// ~ function that displays shows to the DOM ~ //
app.displayTvShows = (tvShowArray, form) => {

   // clear gallery before displaying new search results //
   gallery.innerHTML = ``;

   // showing total tv show results, appended to the DOM //
   app.showUserResults(tvShowArray, form);
   
   // forEach method that loops through every object in tvShowArray //
   tvShowArray.forEach(tvShow => {
      // function that called and passes every tvShow object as an arguement //
      app.appendToDom(tvShow);
   });
};






// ~ appends the data to the dom every time the loop runs in the previous function ~ //
app.appendToDom = (tvShow) => {

   // destructured objects from tvShow array //
   const { show } = tvShow;
   const { image, name, summary, rating, genres, averageRuntime, status, language } = show;

   // create li element stored in a variable //
   const newListItem = document.createElement('li');
   newListItem.classList.add('showContainer');

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
      <div class="imgContainer"><img src="${imagePath}" alt="${altPath}" /></div>
      <div class="infoContainer">
         <div class="summaryContainer displayNone">
         <p><span class="showInfo">Summary:</span> ${summary}</p>
         </div>
         <p><span class="showInfo">Rating:</span>  ${rating.average}</p>
         <p><span class="showInfo">Language:</span>  ${language}</p>
         <p><span class="showInfo">Genres:</span>  ${genres}</p>
         <p><span class="showInfo">Episode Length:</span>  ${averageRuntime} mins</p>
         <p><span class="showInfo">Show Current Status:</span>  ${status}</p>
      </div>
      `;

   // append each entry to the gallery //
   gallery.appendChild(newListItem);
};





// ~ function that shows user search total results ~ //
app.showUserResults = (tvShows, form) => {
   results.innerHTML = ``;
   // storing the users input into a variable while capitalizing the first letter //
   const userSearch = form[0].toUpperCase() + form.substring(1);

   // storing the array length in variable //
   const tvResults = tvShows.length;

   // creating a variable and storing a new p element tag in it //
   const totalResults = document.createElement('p');
   totalResults.classList.add('totalResults')

   // appending html into variable with p tag //
   totalResults.innerHTML = `
      Total Results for "<span class="bold">${userSearch}</span>" Found: ${tvResults}
   `;

   // appending totalResults p tag element as a child to gallery //
   results.appendChild(totalResults);
};


app.shuffle = (array) => {
   let currentIndex = array.length, randomIndex;

   // While there remain elements to shuffle.
   while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
         array[randomIndex], array[currentIndex]];
   }

   return array;
}




// ------ SHOW ALL TV SHOWS BY PAGES FEATURE BRANCH ------ // 




// ~ globally scoped variables that connect to html elements ~ // 

// search by name feature branch variables //
const showSearchTitle = document.querySelector('.searchShowByName');
const searchByName = document.querySelector('.searchByName');

// show all shows in pages feature branch variables
const showPageTitle = document.querySelector('.searchShowByPages');
const showPagesButton = document.querySelector('.showAllPages');
const pageNumberOne = document.querySelector('.pageNumberOne');
const pageNumberTwo = document.querySelector('.pageNumberTwo');
const pageNumberThree = document.querySelector('.pageNumberThree');
const pageNumberFour = document.querySelector('.pageNumberFour');
const pageNumberFive = document.querySelector('.pageNumberFive');
const pageNumberSix = document.querySelector('.pageNumberSix');
const pageNumberSeven = document.querySelector('.pageNumberSeven');
const pageNumberEight = document.querySelector('.pageNumberEight');
const pageNumberNine = document.querySelector('.pageNumberNine');
const pageNumberTen = document.querySelector('.pageNumberTen');



// ~ show pages button that listens for user click, display:none elements and fetch's 2nd endpoint data ~ // 
showPagesButton.addEventListener('click', function(){

   // data needed for specific end point fetch //
   const input = document.querySelector('#pageNumberOne');

   // new search params with values based on user choice //
   urlTwo.search = new URLSearchParams({
      page: input.value
   });
   console.log(showPagesButton)

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
   pageNumberOne.classList.remove('displayNone');
   pageNumberTwo.classList.remove('displayNone');
   pageNumberThree.classList.remove('displayNone');
   pageNumberFour.classList.remove('displayNone');
   pageNumberFive.classList.remove('displayNone');
   pageNumberSix.classList.remove('displayNone');
   pageNumberSeven.classList.remove('displayNone');
   pageNumberEight.classList.remove('displayNone');
   pageNumberNine.classList.remove('displayNone');
   pageNumberTen.classList.remove('displayNone');
   showPageTitle.classList.remove('displayNone');
   app.showCounter.classList.remove('displayNone');

   results.innerHTML = ``;
   
});



// ~ search by name button that appears when show all page button is clicked, when searchByName is clicked by user, clear gallery, and return app to original state ~ //
searchByName.addEventListener('click', function(){
   // clear the gallery in the DOM //
   gallery.innerHTML = ``;

   // adding a class to html elements //
   searchByName.classList.add('displayNone');
   pageNumberOne.classList.add('displayNone');
   pageNumberTwo.classList.add('displayNone');
   pageNumberThree.classList.add('displayNone');
   pageNumberFour.classList.add('displayNone')
   pageNumberFive.classList.add('displayNone')
   pageNumberSix.classList.add('displayNone')
   pageNumberSeven.classList.add('displayNone')
   pageNumberEight.classList.add('displayNone')
   pageNumberNine.classList.add('displayNone')
   pageNumberTen.classList.add('displayNone')
   app.showCounter.classList.add('displayNone');
   showPageTitle.classList.add('displayNone');

   // removing a class to html elements //
   app.searchBar.classList.remove('displayNone');
   showPagesButton.classList.remove('displayNone');
   showSearchTitle.classList.remove('displayNone');
});



// ~ 1st page event listener button that waits for user click, and fetches 2nd endpoint data, with a different query value ~ //
pageNumberOne.addEventListener('click', function(){
   // storing html button element in variable 
   const input = document.querySelector('#pageNumberOne');

   // new search params
   urlTwo.search = new URLSearchParams({
      page: input.value
   });

   // function call //
   app.fetchAllShows(urlTwo, input.value);
});


// ~ 2nd page event listener button that waits for user click, and fetches 2nd endpoint data, with a different query value ~ //
pageNumberTwo.addEventListener('click', function(){
   // storing html button element in variable //
   const input = document.querySelector('#pageNumberTwo');

   // new search params
   urlTwo.search = new URLSearchParams({
      page: input.value
   });

   // function call //
   app.fetchAllShows(urlTwo, input.value);
});


// ~ 3rd page event listener button that waits for user click, and fetches 2nd endpoint data, with a different query value ~ // 
pageNumberThree.addEventListener('click', function(){
   // storing html button element in variable  //
   const input = document.querySelector('#pageNumberThree');

   // new search params //
   urlTwo.search = new URLSearchParams({
      page: input.value
   });

   // function call //
   app.fetchAllShows(urlTwo, input.value);
});


// ~ 4th page event listener button that waits for user click, and fetches 2nd endpoint data, with a different query value ~ // 
pageNumberFour.addEventListener('click', function () {
   // storing html button element in variable  //
   const input = document.querySelector('#pageNumberFour');

   // new search params //
   urlTwo.search = new URLSearchParams({
      page: input.value
   });

   // function call //
   app.fetchAllShows(urlTwo, input.value);
});


// ~ 5th page event listener button that waits for user click, and fetches 2nd endpoint data, with a different query value ~ // 
pageNumberFive.addEventListener('click', function () {
   // storing html button element in variable  //
   const input = document.querySelector('#pageNumberFive');

   // new search params //
   urlTwo.search = new URLSearchParams({
      page: input.value
   });

   // function call //
   app.fetchAllShows(urlTwo, input.value);
});


// ~ 6th page event listener button that waits for user click, and fetches 2nd endpoint data, with a different query value ~ // 
pageNumberSix.addEventListener('click', function () {
   // storing html button element in variable  //
   const input = document.querySelector('#pageNumberSix');

   // new search params //
   urlTwo.search = new URLSearchParams({
      page: input.value
   });

   // function call //
   app.fetchAllShows(urlTwo, input.value);
});

// ~ 7th page event listener button that waits for user click, and fetches 2nd endpoint data, with a different query value ~ // 
pageNumberSeven.addEventListener('click', function () {
   // storing html button element in variable  //
   const input = document.querySelector('#pageNumberSeven');

   // new search params //
   urlTwo.search = new URLSearchParams({
      page: input.value
   });

   // function call //
   app.fetchAllShows(urlTwo, input.value);
});

// ~ 8th page event listener button that waits for user click, and fetches 2nd endpoint data, with a different query value ~ // 
pageNumberEight.addEventListener('click', function () {
   // storing html button element in variable  //
   const input = document.querySelector('#pageNumberEight');

   // new search params //
   urlTwo.search = new URLSearchParams({
      page: input.value
   });

   // function call //
   app.fetchAllShows(urlTwo, input.value);
});

// ~ 9th page event listener button that waits for user click, and fetches 2nd endpoint data, with a different query value ~ // 
pageNumberNine.addEventListener('click', function () {
   // storing html button element in variable  //
   const input = document.querySelector('#pageNumberNine');

   // new search params //
   urlTwo.search = new URLSearchParams({
      page: input.value
   });

   // function call //
   app.fetchAllShows(urlTwo, input.value);
});

// ~ 10th page event listener button that waits for user click, and fetches 2nd endpoint data, with a different query value ~ // 
pageNumberTen.addEventListener('click', function () {
   // storing html button element in variable  //
   const input = document.querySelector('#pageNumberTen');

   // new search params //
   urlTwo.search = new URLSearchParams({
      page: input.value
   });

   // function call //
   app.fetchAllShows(urlTwo, input.value);
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
   console.log(app.ratingValue)
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
            app.appendAllShowsToDom(show);
         };
         // if userInput is 1 but app.ratingValue isnt empty
      } else if (userInput == '1' && app.ratingValue !== '') {
         // then compare tvShowsCounter to the app.ratingValue instead of userInput
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendAllShowsToDom(show)
         };
      } else if (userInput == '2' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendAllShowsToDom(show);
         };
         // otherwise, if userInput is not = 1, then still check as usual.
      } else if (userInput == '2' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendAllShowsToDom(show)
         }
      } else if (userInput == '3' && app.ratingValue == ''){
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendAllShowsToDom(show);
         };
      } else if (userInput == '3' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendAllShowsToDom(show)
         }
      } else if (userInput == '4' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendAllShowsToDom(show);
         };
      } else if (userInput == '4' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendAllShowsToDom(show)
         }
      } else if (userInput == '5' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendAllShowsToDom(show);
         };
      } else if (userInput == '5' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendAllShowsToDom(show)
         }
      } else if (userInput == '6' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendAllShowsToDom(show);
         };
      } else if (userInput == '6' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendAllShowsToDom(show)
         }
      } else if (userInput == '7' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendAllShowsToDom(show);
         };
      } else if (userInput == '7' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendAllShowsToDom(show)
         }
      } else if (userInput == '8' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendAllShowsToDom(show);
         };
      } else if (userInput == '8' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendAllShowsToDom(show)
         }
      } else if (userInput == '9' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendAllShowsToDom(show);
         };
      } else if (userInput == '9' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendAllShowsToDom(show)
         }
      } else if (userInput == '10' && app.ratingValue == '') {
         userInput = '9';
         // after userInput has been changes, check to see if tvShowCounter is greater than userInput, then stop the loop //
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendAllShowsToDom(show);
         };
      } else if (userInput == '10' && app.ratingValue !== '') {
         if (tvShowsCounter > app.ratingValue) {
            return;
         } else {
            app.appendAllShowsToDom(show)
         }
      } else {
         if (tvShowsCounter > userInput) {
            // stop the loop //
            return;
         } else {
            app.appendAllShowsToDom(show);
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
      // console.log(userInput)
   });
};



// ~ creation of new html elements, and appending information to DOM ~ //
app.appendAllShowsToDom = (show) => {

   // creating an html element, storing it in a variable //
   const newListItem = document.createElement('li');
   newListItem.classList.add('showContainer');

   // destructured objects // 
   const { image, rating, summary, name, language, status, averageRuntime, genres } = show;

   // image path variable for use in new element creation, includes conditions for null image //
   const imagePath = image ? image.original : 'https://placekitten.com/200/300';

   // alt text path variable for use in new element creation, includes conditions for placeholder image //
   let altPath;
   // if statement that checks to see and adds placeholder if the object image is null //
   if (image != null) {
      altPath = `Poster for ${name}`;
   } else {
      altPath = `placeholder image`;
   };

   // console.log(show)

   // adding content to the li element // 
   newListItem.innerHTML = `
      <h2 class="tvTitle">${name}</h2>
      <div class="imgContainer"><img src="${imagePath}" alt="${altPath}" /></div>
      <div class="infoContainer">
         <div class="summaryContainer displayNone">
         <p><span class="showInfo">Summary:</span> ${summary}</p>
         </div>
         <p><span class="showInfo">Rating:</span>  ${rating.average}</p>
         <p><span class="showInfo">Language:</span>  ${language}</p>
         <p><span class="showInfo">Genres:</span>  ${genres}</p>
         <p><span class="showInfo">Episode Length:</span>  ${averageRuntime} mins</p>
         <p><span class="showInfo">Show Current Status:</span>  ${status}</p>
      </div>
      `;

   // append li element to the gallery in the DOM // 
   gallery.appendChild(newListItem);
};

// ------ ** SHOW ALL SHOWS IN PAGES FEATURE BRANCH ENDS ** ------ //



// init function that loads the page //
app.init = () => {
   app.addListeners();
};




// initial function call to start the app //
app.init();



// ------- ** ISSUES: ** ------- // 

// the tvshow form to append the amount of shows per pages, if statement needs to be fixed. when you select "25" shows, and then click a new page, it only appends 10 shows (as the if statement states userInput = '10'), you need to change that with the app.ratingValue and using that in the if statement to fix it.

// 1. PARTIAL COMPLETED - Filter by rating, does not allow you to filter by language first, it doesnt take the language filtered array and filter through that too 
// ^ what it does is, it takes the original appended 10 shows, and changes by rating
// Connect the two forms! what works: if user decides to click rating first, then language, it should filter both, by rating and by language


// 2. when you freestyle and alternate/click all the buttons, eventually the app gets bogged down w/ so much data, that it slows the browser. it even requests you kill the app. Also happens on the fetch for the 2nd feature branch
// example - it usually happens between the rating filter followed by the language filter. 

// 2. OBSERVATIONS - for some reason when i console.log the tvShow.length, it shows more than the length, and i think it doubles every time its used. We need to stop that from happening. Theres a loop between app.addListeners & app.checkLanguage calling each other. But it shouldnt loop because the checkLanguage is only called in the eventListener. 

// 3. I just noticed that when you click a page number on the 2nd feature branch, it only appends 3 on the second and third page until you change the show form. the if statement to check if user click is 1 works, but if you use || then it breaks. 

// 3. styling - making the correct page thats click to have a blue color on the font when its clicks, and adjusts when its clicked. 

// 4. 2nd feature branch, should show/append the page # the user is currently on. (ex: when page 1 is clicked, the DOM should show that "You are currently on Page: 1")

// 5. COMPLETED - when you search multiple times after using the language rating, it puts empty string alert on check form, when theres a search on the submit. FIXED - took away the addListeners() in the checkLanguage(), 


// 6. COMPLETED - show all tv shows in pages branch, when you click the button, it initially only appends 3 shows first, then adjusts when you click the change how many shows correctly. 
// Reason : when you click show all pages button, there is no userInput value to use, and technically the input value is set to 1. so it will only append 2 shows.
// SOLUTION: either decide to figure out a way to make the userInput value to 10, or create an additional html option set to 2 shows


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
// -- ** app ends & loops through these on user change ** -- //

// ** NEW ** 
// 12. onChange listener waits for user selection to change the rating. it then calls app.checkRating()
// 13. app.checkRating() clears gallery, calls app.showUserResults, and then calls app.appendToDom()

// -- ** 2nd feature branch : show tvShows in pages ** -- // 

// 14. on click event listener that takes api data, and calls app.fetchAllShows()
// 15. app.fetchAllShows() get API data, & calls app.displayAllTvShows()
// 16. app.displayAllTvShows loops through the array, and calls app.appendAllShowsToDom();
// 17. app.appendAllShowsToDom() takes the passed data and appends every tvShow in the loop

// 18. page button addEventListener, waits for user click, and then fetches the API data with new search params, based on page #. It calls fetch, then displayAllTvShows, then appendAllShowsToDom.
// 19. a tvCounter form is created, and has an onChange eventListener that waits for user selection. When changed, it calls fetchAllShows but takes the value of the counter and uses it as a counter stopper in an if statement. that way it cuts the loop once the counter and the userInput value match. 
// 20. there for is appends number of shows user requests. 




















// ---------------------- ** OLD GOALS ** ----------------------------//


// *** PHASE THREE - NEXT STEPS ***

// POSSIBLE NEW GOAL: 

// 2. COMPLETED - we have the skeleton for creating a form to filter through any type of value in the API array, we could create it for others (i.e genre, etc)ALMOST COMPLETE! - adding a form that sorts by highest or lowest rating? we would need to take the array of objects, look at the rating, and sort() it
// 3. COMPLETED possible fetch a new end point and see what we can add to our app with specific end point. Was able to get the second end point, showing pages of shows (242 shows per page). 
// 4. COMPLETED - I was thinking of maybe adding a second page that appends all shows and it changes by user changing the page number. 
// 5. COMPLETED - we would need to have a button thats like "all shows" when you click it, it either takes you to a new HTML page, orrrr
// 6. COMPLETED - it display:nones all the html, and display: block the page number, while appending the first page of shows. 
// 7. COMPLETED - then it waits for the onchange listener to change and append a new set of 242 shows to the DOM.
// Last - styling via SCSS. 


// -------------------------------------------------------

// *** PHASE TWO - COMPLETED ***
// 1. COMPLETED - Find out what else we want to append to DOM (average run time, genres, statue, ended, etc);
// 4. COMPLETED: find out why the second if statement is true, passes information, but does not clear the gallery like the "english" statement does
// 5. COMPLETED: fix the language form to always be at "all results", with every search & even when you refresh. 
// 6. COMPLETED - add a "how many results have shown : ${results}" shown on the DOM to let users know what was found. 
// 6a. COMPLETED - written twice in both displayLanguageShows & displayTvShows (maybe create a function to append results, to keep code clean?)
// 7. COMPLETED - Also same things here, create an appendData function that will append data once, instead of having it written twice in displayLanguageShows & displayTvShows - the newListItem.innerHTML & gallery.appendChild(newListItem);
// 8. COMPLETED - on submit, input value = ""
// 8a. COMPLETED -  change "total results found" to include input value

// ---------------------------------------------------------- //

// *** PHASE ONE - OLD STEPS ***
// ALMOST COMPLETED: STRETCH GOAL: adding additional input to filter by languages
// COMPLETED - error handling the forms for any incorrect user inputs 
// COMPLETED - pop up if there are no results.
// NOT NEEDED - API considers & appends anything remotely close to the user input (i.e submit and gives "summit, sbit, sunmi, subat");
// NOT NEEDED - reset button (and display: none the search tab when a user searches once) MAYBEEE
// NOT POSSIBLE? - api only gives out 10 recommendations per search, coincidence?? (find a way to display more than 10+ recco's)
// NO NEED, IT ONLY DISPLAYS 10 anyways - limit the reccomendations to (maybe 5?)

// ----------------------** MVP **-------------------------------- //

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