document.addEventListener('DOMContentLoaded', () => {
    const tmdbKey = '4ebcb61071c2ed1498e5b8e64cc8817f'; // Substitua pela sua chave da API TMDb
    let currentPage = 1; // Página inicial
    const tmdbUrl = (page) => `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbKey}&language=pt-BR&page=${page}`;

    const movieCardsContainer = document.getElementById('movie-cards');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    const fetchMovies = async (page) => {
        try {
            const response = await fetch(tmdbUrl(page));
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error('Erro ao buscar dados da API TMDb:', error);
        }
    };

    const displayMovies = (movies) => {
        movieCardsContainer.innerHTML = ''; // Limpa os filmes atuais
        movies.forEach(movie => {
            const card = createMovieCard(movie);
            movieCardsContainer.appendChild(card);
        });
    };

    const createMovieCard = (movie) => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <div class="poster" style="background-color:black;">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            </div>
            <div class="details">
                <h3>${movie.title}</h3>
                <div class="rating">
                    <i class="fa-solid fa-star"></i>
                    <span>${movie.vote_average}</span>
                </div>
                <div class="tags">
                    <span style="color:#fff">${movie.release_date.split('-')[0]}</span>
                </div>
                <div class="info">
                    <p>${movie.overview}</p>
                </div>
            </div>
        `;
        return card;
    };

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchMovies(currentPage);
        }
    });

    nextPageButton.addEventListener('click', () => {
        currentPage++;
        fetchMovies(currentPage);
    });

    // Carrega a primeira página de filmes
    fetchMovies(currentPage);
});
