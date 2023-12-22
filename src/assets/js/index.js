// Global variables
const tagline = document.getElementById('tagline');
const navbarToggler = document.querySelector(".navbar-toggler");
const icon = document.getElementById("navbar-toggler-label");
const screenWidth = window.innerWidth;

// NASA Open API key and URI
const nasaApiKey = 'gJp5NcbMaTiyes5G6LaXHhC7U3u29c3xdSdZzUB2';
const nasaApiUri = 'https://api.nasa.gov/planetary/apod';

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    tagline.style.setProperty("margin-top", screenWidth < 480 ? "4vh" : "13vh", "important");

    const categoriesDropDown = document.getElementById('categoriesDropDown');
    if (categoriesDropDown) {
        categoriesDropDown.addEventListener('change', performCategorySearch);
    }

    navbarToggler.addEventListener("click", toggleNavbarIcon);

    const searchForm = document.querySelector('form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            performSearch();
        });
    }

    document.getElementById('descriptionModal').addEventListener('show.bs.modal', function (event) {
        // Event listener for modal show event
        const fullDescription = event.relatedTarget.getAttribute('data-description');
        // Set the content of the modal
        const modalDescription = document.getElementById('fullDescription');
        modalDescription.textContent = fullDescription;
    });


    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const searchInput = document.getElementById('searchInput');

            // Check if the search input is empty
            if (searchInput.value.trim() === '') {
                // Show empty search modal
                var emptySearchModal = new bootstrap.Modal(document.getElementById('emptySearchModal'));
                emptySearchModal.show();
            } else {
                // Perform search
                performSearch();
            }
        });
    }
});

function toggleNavbarIcon() {
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const searchQuery = searchInput.value;

        fetch(`https://images-api.nasa.gov/search?q=${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                // Update the result cards
                updateResultCards(data.collection.items);
            })
            .catch(handleError);
    }
}

function updateResultCards(items) {
    const resultsContainer = document.getElementById('results-container');
    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));

    if (resultsContainer) {
        // Clear existing content
        resultsContainer.innerHTML = '';

        if (items.length === 0) {
            // Show result modal and adjust tagline margin
            resultModal.show();
            tagline.style.display = 'block';
            tagline.style.setProperty("margin-top", screenWidth < 480 ? "4vh" : "13vh", "important");
        } else {
            // Hide tagline and display result cards
            hideTagline();

            // Iterate through each item and create a card
            items.forEach(item => {
                const card = createResultCard(item);
                resultsContainer.appendChild(card);
            });
        }
    }
}


function createResultCard(item) {
    const card = document.createElement('div');
    card.className = 'col-sm g-5';

    const title = item.data && item.data.length > 0 ? item.data[0].title : 'No title available';
    const imageHref = item.links && item.links.length > 0 ? item.links[0].href : 'https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg';
    const altText = item.data && item.data.length > 0 ? item.data[0].title : 'No alt value';
    const dateCreated = item.data && item.data.length > 0 ? formatDate(item.data[0].date_created) : 'No date available.';
    const fullDescription = item.data && item.data.length > 0 ? item.data[0].description : 'No description available.';

    // Limit the description to a certain number of characters
    const descriptionLimit = 150;
    const limitedDescription = fullDescription.length > descriptionLimit
        ? `${fullDescription.substring(0, descriptionLimit)}...`
        : fullDescription;

    card.innerHTML = `
        <div class="card mx-auto shadow" style="width: 18rem;">
            <div class="card-header text-center text-dark fw-bold">${title}</div>
            <a href="#" data-bs-toggle="modal" data-bs-target="#imageModal" data-src="${imageHref}" alt="${altText}">
                <img class="card-img-top img-fluid" src="${imageHref}" alt="${altText}">
            </a>
            <div class="card-body">
                <div class="card-text">
                    <p style="font-family:'Roboto', sans-serif !important;"><strong><b style="font-family:'Roboto', sans-serif !important;">Date:</b></strong> ${dateCreated}</p>
                    <p style="font-family:'Roboto', sans-serif !important;"><strong><b style="font-family:'Roboto', sans-serif !important;">Description:</b></strong> ${limitedDescription}</p>
                    ${fullDescription.length > descriptionLimit
            ? `<button class="btn btn-link" data-bs-toggle="modal" data-bs-target="#descriptionModal" data-description="${fullDescription}">Read More</button>`
            : ''
        }
                </div>
            </div>
        </div>
    `;
    return card;
}

// Function to format the date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
}

function handleError(error) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput.value != '') {
        // Function to handle errors
        console.error(`Error: ${error}`);
        var errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
        console.error('Failed to fetch data from NASA Open API. Please try again later.', error);
    }

}


function showResultModal() {
    // Function to show the result modal and adjust tagline margin
    var resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    resultModal.show();
    tagline.style.display = 'block';
    tagline.style.setProperty("margin-top", screenWidth < 480 ? "4vh" : "13vh", "important");
}

function hideTagline() {
    // Function to hide the tagline
    tagline.style.display = 'none';
    tagline.style.removeProperty('margin-top');
}

function backToTop() {
    // Function to scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.onscroll = function () {
    // Show/hide the scroll to top button based on scroll position
    var backToTopButton = document.getElementById('backToTopButton');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
};

document.getElementById('imageModal').addEventListener('show.bs.modal', function (event) {
    // Event listener for modal show event
    const imageSrc = event.relatedTarget.getAttribute('data-src');
    // Set the src attribute of the modal image
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modalImage.alt = event.relatedTarget.getAttribute('alt');
});

document.getElementById('imageModal').addEventListener('hide.bs.modal', function () {
    // Event listener for modal hide event
    // Clear the src attribute when the modal is hidden
    document.getElementById('modalImage').src = '';
});
