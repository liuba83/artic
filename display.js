const showBtn = document.querySelector("#showArtBtn");
showBtn.addEventListener("click", getArtworks);

const inputField = document.querySelector("#input");
inputField.addEventListener("keypress", enterHotKey);

let pageNumber = 0;

function enterHotKey(e) {
  if (e.keyCode === 13) {
    getArtworks();
  }
}

function displayAlert(titleAlert) {
    //function shows alert
  Swal.fire({
    title: titleAlert,
    width: 600,
    padding: "3em",
    color: "darkred",
  });
}

async function getArtworks() {
  //function makes an api call to artic, converts received response into json format and operates displayRresult() function
  pageNumber++;

  if (inputField.value.length === 0) {
    displayAlert("Enter artist name, title or another key word");
    return false;
  } else {
    const rowRequest = await fetch(
      `https://api.artic.edu/api/v1/artworks/search?&q=${input.value}&fields=id,title,artist_display,image_id&page=${pageNumber}&limit=1`
    );
    const jsonRequest = await rowRequest.json();
    displayResult(jsonRequest);
    if (pageNumber === jsonRequest.pagination.total_pages) {
        showBtn.disabled = true;
        displayAlert("This was the last page. Start over with new search!")
    }
  }
}

function displayResult(request) {
  //function retrieves data from response and displays on UI
  let image = document.querySelector("#image");
  let artist = document.querySelector("#artist");
  let title = document.querySelector("#title");

  if (request.pagination.total === 0) {
    displayAlert("Try to search by another criteria");
    return false;
  } else {
    image.style.display = "block";

    if (request.data[0].image_id === null) {
      image.setAttribute("src", "notAvailable.jpeg");
      return false;
    }

    image.setAttribute(
      "src",
      `https://www.artic.edu/iiif/2/${request.data[0].image_id}/full/843,/0/default.jpg`
    );
    artist.textContent = `${request.data[0].artist_display}`;
    title.textContent = `${request.data[0].title}`;
  }
}

