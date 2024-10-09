document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.details img').alt;
            const genre = card.querySelector('.tags span').innerText;
            const poster = card.querySelector('.poster img').src;
            
            // Salva os dados do filme selecionado no localStorage
            localStorage.setItem('selectedMovie', JSON.stringify({
                title,
                genre,
                poster,
                type: '2D',
                classification: 'LEGENDADO'
            }));

            // Redireciona para a página de ingressos
            window.location.href = 'ingresso.html';
        });
    });
});
