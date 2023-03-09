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

// calling fetch to make GET request
app.getTvShows = () => {
   
   let userSearch = app.userInput[0].value;
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