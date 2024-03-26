const showBtn = document.querySelector("#showArtBtn");
const inputField = document.querySelector("#input");
let pageNumber = 0;

showBtn.addEventListener("click", getArtworks);
inputField.addEventListener("keypress", enterHotKey);

function enterHotKey(e) {
  if (e.keyCode === 13) {
    getArtworks();
  }
}

//Show alert while validating
function displayAlert(titleAlert) {
  Swal.fire({
    title: titleAlert,
    width: 600,
    padding: "3em",
    color: "darkred",
  });
}

//Make an api call to artic, convert received response into json format and call displayRresult() function
async function getArtworks() {
  pageNumber++;

  if (inputField.value.length === 0) {
    displayAlert("Enter artist name, title or another key word");
    return false;
  } else {
    try {
      const rowResponse = await fetch(
        `https://api.artic.edu/api/v1/artworks/search?&q=${inputField.value}&fields=id,title,artist_display,image_id&page=${pageNumber}&limit=1`
      );
      const jsonResponse = await rowResponse.json();
      displayResult(jsonResponse);

      if (pageNumber === jsonResponse.pagination.total_pages) {
        showBtn.disabled = true;
        displayAlert("This was the last page. Start over with new search!");
      }
    } catch (err) {
      console.error(err);
    }
  }
}

//Retrieve data from response and display in HTML
function displayResult(request) {
  let image = document.querySelector("#image");
  let artist = document.querySelector("#artist");
  let title = document.querySelector("#title");

  //Show alert if request is invalid
  if (request.pagination.total === 0) {
    displayAlert("Try to search by another criteria");
    return false;
  } else {
    image.style.display = "block";

    //Show generic image when no image is available in response
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
