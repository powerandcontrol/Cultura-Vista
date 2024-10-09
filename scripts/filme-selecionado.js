const movieData = document.getElementById('movie-data');
const urlParams = new URLSearchParams(window.location.search);
const movieTitle = urlParams.get('title');
const tmdbKey = '4ebcb61071c2ed1498e5b8e64cc8817f'; // Substitua pela sua chave da API TMDB
const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(movieTitle)}`;

const resources = {
    en: {
        translation: {
            "Popularity": "Popularity",
            "Year": "Year",
            "Rated": "Rated",
            "Genre": "Genre",
            "Plot": "Plot",
            "Directed by": "Directed by",
            "Starring": "Starring",
            "No results": "No results",
            "Where to Watch": "Where to Watch"
        }
    },
    pt: {
        translation: {
            "Popularity": "Popularidade",
            "Year": "Ano",
            "Rated": "Classificação",
            "Genre": "Gênero",
            "Plot": "Enredo",
            "Directed by": "Dirigido por",
            "Starring": "Estrelando",
            "No results": "Sem resultados",
            "Where to Watch": "Onde Assistir"
        }
    }
};

i18next.init({
    lng: 'pt', // Defina o idioma padrão aqui
    debug: true,
    resources
});

const translateText = (key) => i18next.t(key);

const getMovieDetails = async (movieId) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbKey}&language=pt-BR&append_to_response=credits`);
    return response.json();
};

const getWhereToWatch = async (movieId) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${tmdbKey}`);
    const data = await response.json();
    return data.results.BR; // Assumindo que você quer informações do Brasil
};


const movieDataTpl = (movie, whereToWatch) => {
    let actors = movie.credits.cast.map(cast => cast.name).join(', ');

    const whereToWatchHtml = whereToWatch && whereToWatch.flatrate ? whereToWatch.flatrate.map(provider => {
        return `
            <div class="watch-option">
                <a href="${whereToWatch.link}" target="_blank">${provider.provider_name}</a>
            </div>
        `;
    }).join('') : '<p>Sem informações disponíveis</p>';
    

    return `
        <div class="movie__poster">
            <span class="movie__poster--fill">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
            </span>
            <span class="movie__poster--featured">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
            </span>
        </div>
        <div class="movie__details">
            <h2 class="movie__title">${movie.title}</h2>
            <ul class="movie__tags list--inline">
                <li class="movie__rated">${translateText('Popularity')}: ${movie.popularity}</li>
                <li class="movie__year">${new Date(movie.release_date).getFullYear()}</li>
                <li class="movie__genre">${movie.genres.map(genre => genre.name).join(', ')}</li>
            </ul>
            <p class="movie__plot">${movie.overview}</p>
            <div class="movie__credits">
                <p><strong>${translateText('Directed by')}:</strong> ${movie.credits.crew.filter(member => member.job === 'Director').map(member => member.name).join(', ')}</p>
                <p><strong>${translateText('Starring')}:</strong> ${actors}</p>
            </div>

            <div class="where-to-watch">
                <h3>${translateText('Where to Watch')}</h3>
                ${whereToWatchHtml}
            </div>
        </div>
    `;
};

const noResultsTpl = () => {
    return `
        <div class="movie__no-results">
            <h2>${translateText('No results')}</h2>
        </div>
    `;
};

const findMovie = async (title) => {
    try {
        const res = await fetch(tmdbUrl);
        const data = await res.json();

        if (data.results.length > 0) {
            const movie = await getMovieDetails(data.results[0].id);
            const whereToWatch = await getWhereToWatch(data.results[0].id);
            movieData.innerHTML = movieDataTpl(movie, whereToWatch);
        } else {
            movieData.innerHTML = noResultsTpl();
        }
    } catch (err) {
        movieData.innerHTML = noResultsTpl();
    }
};

if (movieTitle) {
    findMovie(movieTitle);
}
