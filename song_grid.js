fetch('data/song_list.json') 
    .then(response => response.json())
    .then(songs => {
        const songList = document.querySelector('.song-grid');
        const modal = document.getElementById('song-modal');
        const modalContent = modal.querySelector('.modal-content');
        const packFilter = document.getElementById('song-pack-filter'); 
        const difficultyFilter = document.getElementById('difficulty-filter'); 
        const minLevelFilter = document.getElementById('min-level');
        const maxLevelFilter = document.getElementById('max-level');

        let allSongs = songs; // save all songs in a variable

        // Function to display songs in the grid
        function displaySongs(filteredSongs) {
            songList.innerHTML = ""; // clear previous contnet
            filteredSongs.forEach(song => {
                const difficultyClass = song.difficulty.toLowerCase();
                const sideClass = song.side.toLowerCase();

                let lockIcon = '';
                if(song.unlock.includes("[Special]") || song.unlock.includes("[Anomaly]")) {
                    lockIcon = `<div class="lock-icon">
                        <i class="fa-solid fa-diamond" title="The song has some special unlock condition."></i>
                    </div>`;
                } else if(song.unlock.includes("World Mode")) {
                    lockIcon = `<div class="lock-icon">
                        <i class="fas fa-lock" title="The song can be unlocked in world mode."></i>
                    </div>`;
                }

                // Create a card for each song
                const card = document.createElement('div');
                card.classList.add('song-card');
                card.innerHTML = `
                    <img src="${song.image}" alt="${song.title}">
                    ${lockIcon}
                    <label class="${difficultyClass}">${song.difficulty} ${song.level}</label>
                `;

                // Click event listener for each card to display the song details in the modal
                card.addEventListener('click', () => {
                    modalContent.innerHTML = `
                        <img src="${song.image}" alt="${song.title}">
                        <p>${song.pack}</p>
                        <h3 class="${sideClass}">${song.title}</h3>
                        <p>${song.artist}</p>
                        <label class="${difficultyClass}">${song.difficulty} ${song.constant}</label>
                        <p>BPM: ${song.bpm}</p>
                        <p>Side: ${song.side}</p>
                        <p>Chart Designer: ${song.chart_designer}</p>
                        <p>Unlock Condition: ${song.unlock}</p>
                    `;

                    modal.classList.remove('hidden');
                    modal.classList.add('show');
                });

                songList.appendChild(card);
            });
        }

        // Load all songs initially
        displaySongs(allSongs);

        // Parse "+" to 0.5 in level, 9+ → 9.5
        function parseLevel(level) {
            if (level.includes("+")) {
                return parseInt(level) + 0.5; 
            }
            return parseInt(level); 
        }

        // Function to filter and display songs
        let filteredSongs = allSongs
        function applyFilters() {
            filteredSongs = allSongs.filter(song => {
                const selectedDifficulty = difficultyFilter.value.toLowerCase();
                const selectedPack = packFilter.value.toLowerCase();
                const selectedMinLevel = parseLevel(minLevelFilter.value); 
                const selectedMaxLevel = parseLevel(maxLevelFilter.value); 

                return (
                    (selectedDifficulty === "all" || song.difficulty.toLowerCase() === selectedDifficulty) &&
                    (selectedPack === "all" || song.pack.toLowerCase() === selectedPack) &&
                    (parseLevel(song.level) >= selectedMinLevel) &&
                    (parseLevel(song.level) <= selectedMaxLevel)
                );
            });

            displaySongs(filteredSongs);
        }

        // Attach event listeners to filters
        difficultyFilter.addEventListener('change', applyFilters);
        packFilter.addEventListener('change', applyFilters);
        minLevelFilter.addEventListener('input', applyFilters);
        maxLevelFilter.addEventListener('input', applyFilters);

        // Close modal when clicked outside
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });

        // Random Button
        const randomButton = document.getElementById("random-button");
        if (filteredSongs.length === 0) {
            randomButton.disabled = true;
            randomButton.classList.add("disabled");
        } else {
            randomButton.disabled = false;
            randomButton.classList.remove("disabled");
        }

        document.getElementById("random-button").addEventListener("click", function() {
            if(filteredSongs.length === 0){
                alert("No songs found.");
                return;
            }
            modal.classList.remove('hidden');
            modal.classList.add('show');
            const modalContent = modal.querySelector('.modal-content');

            let count = 0;
            const animationInterval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * filteredSongs.length);
                const sideClass = filteredSongs[randomIndex].side.toLowerCase();
                modalContent.innerHTML = `
                    <img src="${filteredSongs[randomIndex].image}" alt="${filteredSongs[randomIndex].title}">
                    <p>${filteredSongs[randomIndex].pack}</p>
                    <h3 class="${sideClass}">${filteredSongs[randomIndex].title}</h3>
                    <p>${filteredSongs[randomIndex].artist}</p>
                    <label class="${filteredSongs[randomIndex].difficulty.toLowerCase()}">${filteredSongs[randomIndex].difficulty} ${filteredSongs[randomIndex].constant}</label>
                    <p>BPM: ${filteredSongs[randomIndex].bpm}</p>
                    <p>Side: ${filteredSongs[randomIndex].side}</p>
                    <p>Chart Designer: ${filteredSongs[randomIndex].chart_designer}</p>
                    <p>Unlock Condition: ${filteredSongs[randomIndex].unlock}</p>
                `;
            }, 80);

            setTimeout(() => {
                clearInterval(animationInterval);
                const finalSong = filteredSongs[Math.floor(Math.random() * filteredSongs.length)];
                const sideClass = finalSong.side.toLowerCase();
                modalContent.innerHTML = `
                    <img src="${finalSong.image}" alt="${finalSong.title}">
                    <p>${finalSong.pack}</p>
                    <h3 class="${sideClass}">${finalSong.title}</h3>
                    <p>${finalSong.artist}</p>
                    <label class="${finalSong.difficulty.toLowerCase()}">${finalSong.difficulty} ${finalSong.constant}</label>
                    <p>BPM: ${finalSong.bpm}</p>
                    <p>Side: ${finalSong.side}</p>
                    <p>Chart Designer: ${finalSong.chart_designer}</p>
                    <p>Unlock Condition: ${finalSong.unlock}</p>
                    <button id="pick-again-button">Pick Again</button>
                `;

                document.getElementById("pick-again-button").addEventListener("click", function() {
                    document.getElementById("random-button").click();
                });
            }, 2000);
        });
    })
    .catch(error => console.error('Error loading songs:', error));
