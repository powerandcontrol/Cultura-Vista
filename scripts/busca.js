document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('movie-search').value;
    if (query) {
        window.location.href = `filme-selecionado.html?title=${encodeURIComponent(query)}`;
    }
});