// song_grid.js 
// Loading the song informations
fetch('data/song_list.json') // 載入 JSON 檔案
    .then(response => response.json())
    .then(songs => {
        const songList = document.querySelector('.song-grid');

        songs.forEach(song => {
            const difficultyClass = song.difficulty.toLowerCase();
            const card = document.createElement('div');
            card.classList.add('song-card');

            card.innerHTML = `
            <img src="${song.image}" alt="${song.title}">
            <label class = ${difficultyClass}>${song.difficulty} ${song.level}</label>
            `;

            songList.appendChild(card);
        });
    })
    .catch(error => console.error('Error loading songs:', error));
