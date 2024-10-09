document.addEventListener('DOMContentLoaded', function() {
  const dateButtons = document.getElementById('date-buttons');
  const timeButtons = document.getElementById('time-buttons');
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');
  const selectionForm = document.getElementById('selection-form');
  const ticketSection = document.getElementById('ticket-section');
  const ticketForm = document.getElementById('ticket-form');

  const sessionTimes = {
    '2024-06-18': ['13:00', '15:30', '17:25', '18:30'],
    '2024-06-19': ['14:15', '19:25', '21:00']
  };
  
  function clearSelectedButtons(buttons) {
    buttons.forEach(button => button.classList.remove('selected'));
  }
  
  function updateTimes(selectedDate) {
    const times = sessionTimes[selectedDate];
    timeButtons.innerHTML = '';
    times.forEach(time => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = time;
      button.dataset.time = time;
      button.addEventListener('click', function() {
        clearSelectedButtons([...timeButtons.children]);
        button.classList.add('selected');
        timeInput.value = time;
      });
      timeButtons.appendChild(button);
    });
  }
  
  [...dateButtons.children].forEach(button => {
    button.addEventListener('click', function() {
      clearSelectedButtons([...dateButtons.children]);
      button.classList.add('selected');
      const selectedDate = button.dataset.date;
      dateInput.value = selectedDate;
      updateTimes(selectedDate);
    });
  });

  selectionForm.addEventListener('submit', function(event) {
    event.preventDefault();
    ticketSection.style.display = 'block';
  });

  ticketForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const movieTitle = document.getElementById('movie-title').value;
    const cinema = document.getElementById('cinema').value;
    const quantity = document.getElementById('quantity').value;
    const date = dateInput.value;
    const time = timeInput.value;
    
    const tmdbKey = '4ebcb61071c2ed1498e5b8e64cc8817f';
    const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(movieTitle)}`;
    
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}`;
    }
    
    try {
      const response = await fetch(tmdbUrl);
      const data = await response.json();
      if (data.results.length > 0) {
        const movie = data.results[0];
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(movie.title)}%20Ingresso%20${formatDate(date)}%20${time}`;
        const ticketHtml = `
          <div class="ticket">
            <div class="side front">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
              <div class="info bottom">
                <h1>${movie.title}</h1>
                <span class="title address">${cinema}</span>
                <dl>
                  <dt>Ingressos</dt>
                  <dd>${quantity}</dd>
                  <dt>Data</dt>
                  <dd>${formatDate(date)}</dd>
                  <dt>Hora</dt>
                  <dd>${time}</dd>
                </dl>
                <span class="floating price">R$${(quantity * 12.50).toFixed(2)}</span>
              </div>
            </div>
            <div class="side back">
              <div class="top">
                <div class="span">
                  <h2>Filme</h2>
                  <span>${movie.title}</span>
                </div>
                <div class="span">
                  <h2>Cinema</h2>
                  <span>${cinema}</span>
                </div>
                <div class="span span8">
                  <h2>Data</h2>
                  <span>${formatDate(date)}</span>
                </div>
                <div class="span span4">
                  <h2>Hora</h2>
                  <span>${time}</span>
                </div>
                <div class="span span8">
                  <h2>Ingressos</h2>
                  <span>${quantity}</span>
                </div>
                <div class="span span4">
                  <h2>Preço</h2>
                  <span class="strong" style="color:#fff">R$${(quantity * 12.50).toFixed(2)}</span>
                </div>
              </div>
              <div class="qr-code bottom">
                <h1>QR Code</h1>
                <span class="floating"></span>
                <img src="${qrCodeUrl}" alt="QR Code do Ingresso">
              </div>
            </div>
          </div>
        `;
        
        const ticketWindow = window.open('', '_blank');
        ticketWindow.document.write(`
          <html lang="pt-BR">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ingresso</title>
            <link rel="stylesheet" href="styles/ticket.css">
          </head>
          <body>
            ${ticketHtml}
          </body>
          </html>
        `);
        ticketWindow.document.close();
      } else {
        alert('Filme não encontrado!');
      }
    } catch (error) {
      console.error('Erro ao buscar filme:', error);
      alert('Erro ao buscar filme!');
    }
  });
});
