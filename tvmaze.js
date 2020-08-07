/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:s
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	const res = await axios.get("http://api.tvmaze.com/search/shows", {
		params: { q: query },
	});
	const data = res.data;

	return createShowsArr(data);
}

// creates an array of shows based on the response data from the query term passed into searchShows
function createShowsArr(data) {
	const showsArr = [];
	for (let index of data) {
		showsArr.push({
			id: index.show.id,
			name: index.show.name,
			summary: index.show.summary,
			image: index.show.image,
		});
	}
	return showsArr;
}

// accepts a show (object) and an image
// creates a div that contains a card that contains the show's picture, name, summary and a button to view episodes
function createItem(show, image) {
	let $item = $(
		`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
       <div class="card mb-3 shadow" data-show-id="${show.id}" style="height: 600px;">
       <img class="card-img-top" src="${image}" style="height: 350px">
         <div class="card-body" style="overflow-y: scroll;">
           <h5 class="card-title">${show.name}</h5>
           <p class="card-text">${show.summary}</p>
         </div>
         <button type="button" class="btn btn-primary ep-btn mt-2" data-toggle="modal" data-target="#exampleModal">Episodes</button>
       </div>
     </div>
    `
	);
	return $item;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $("#shows-list");
	$showsList.empty();

	for (let show of shows) {
		let img = generateImg(show);
		let $item = createItem(show, img);
		$showsList.append($item);
	}

	let $epBtns = jQuery.makeArray($(".ep-btn"));
	for (let btn of $epBtns) {
		btn.addEventListener("click", (e) => handleClick(btn));
	}
}

// generates the appropriate image for the corresponding show
function generateImg(show) {
	if (show.image === null) {
		return "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300";
	} else {
		return show.image.medium;
	}
}

//
async function handleClick(btn) {
	const card = btn.closest("div.card");
	const id = card.getAttribute("data-show-id");
	const episodes = await getEpisodes(id);
	populateEpisodes(episodes);
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
	evt.preventDefault();

	let query = $("#search-query").val();
	if (!query) return;

	$("#episodes-area").hide();
	let shows = await searchShows(query);
	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
	// list of episodes from the response data
	const episodes = res.data;

	// TODO: return array-of-episode-info, as described in docstring above
	return createEpisodesArr(episodes);
}

// creates an array of episodes based on the response data from the episodes request in getEpisodes
function createEpisodesArr(episodes) {
	return episodes.map((episode) => {
		return {
			id: episode.id,
			name: episode.name,
			season: episode.season,
			number: episode.number,
		};
	});
}

// is provided an array of episodes info, and populates that into the #episodes-list part of the DOM.
function populateEpisodes(episodes) {
	const $ul = $("#episodes-list");
	$($ul).empty();

	for (let episode of episodes) {
		$ul.append(
			`<li><b>${episode.name}</b> (Season ${episode.season}, Number ${episode.number})</li>`
		);
	}

	$(".modal-body").append($ul);
}
