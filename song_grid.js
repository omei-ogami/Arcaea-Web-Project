fetch('data/song_list.json') 
    .then(response => response.json())
    .then(songs => {
        const songList = document.querySelector('.song-grid');
        const modal = document.getElementById('song-modal');
        const modalContent = modal.querySelector('.modal-content');
        const packFilter = document.getElementById('song-pack-filter');
        const nameFilter = document.getElementById('search'); 
        const difficultyFilter = document.getElementById('difficulty-filter'); 
        const minLevelFilter = document.getElementById('min-level');
        const maxLevelFilter = document.getElementById('max-level');

        let allSongs = songs; // save all songs in a variable

        function generateModal(song, sideClass, difficultyClass) {
            return `
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
        }

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
                    modalContent.innerHTML = generateModal(song, sideClass, difficultyClass);

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
                const searchQuery = nameFilter.value.trim().toLowerCase();
                const selectedMinLevel = parseLevel(minLevelFilter.value); 
                const selectedMaxLevel = parseLevel(maxLevelFilter.value);
                return (
                    (selectedDifficulty === "all" || song.difficulty.toLowerCase() === selectedDifficulty) &&
                    (selectedPack === "all" || song.pack.toLowerCase().includes(selectedPack)) &&
                    (searchQuery === "" || song.title.toLowerCase().includes(searchQuery)) &&
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
        nameFilter.addEventListener('input', applyFilters);

        document.getElementById("resetFilters").addEventListener("click", () => {
            document.getElementById("search").value = "";
            document.getElementById("difficulty-filter").value = "all";
            document.getElementById("min-level").value = "1";
            document.getElementById("max-level").value = "12";
            document.getElementById("song-pack-filter").value = "all";
            displaySongs(allSongs);
            filteredSongs = allSongs;
        });

        // Close modal when clicked outside
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });

        const randomModal = document.getElementById("random-multiple-modal");

        randomModal.addEventListener('click', (event) => {
            if (event.target === randomModal) {
                randomModal.classList.add('hidden');
                randomModal.classList.remove('show'); // Ensure 'show' class is also removed
            }
        });

        // Random Button
        document.getElementById("random-button").addEventListener("click", function() {
            if(filteredSongs.length === 0){
                alert("No songs found.");
                return;
            }
            modal.classList.remove('hidden');
            modal.classList.add('show');
            const modalContent = modal.querySelector('.modal-content');

            const animationInterval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * filteredSongs.length);
                const sideClass = filteredSongs[randomIndex].side.toLowerCase();
                const difficultyClass = filteredSongs[randomIndex].difficulty.toLowerCase();
                modalContent.innerHTML = generateModal(filteredSongs[randomIndex], sideClass, difficultyClass);
            }, 80);

            setTimeout(() => {
                clearInterval(animationInterval);
                const finalSong = filteredSongs[Math.floor(Math.random() * filteredSongs.length)];
                const sideClass = finalSong.side.toLowerCase();
                const difficultyClass = finalSong.difficulty.toLowerCase();
                modalContent.innerHTML = generateModal(finalSong, sideClass, difficultyClass);
    
                modalContent.innerHTML += `<button id="pick-again-button">Pick Again</button>`;
                document.getElementById("pick-again-button").addEventListener("click", function() {
                    document.getElementById("random-button").click();
                });
            }, 2000);
        });

        // Random button multiple
        function generateFourSongGrid(songs) {
            return `
                <div class="random-modal-song-grid">
                    ${songs.map(song => `
                        <div class="random-modal-song-item" data-song='${JSON.stringify(song)}'>
                            <img src="${song.image}" alt="${song.title}">
                            <h3 class="${song.difficulty.toLowerCase()}">${song.difficulty} ${song.constant}</h3>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        

        document.getElementById("random-button-multiple").addEventListener("click", function () {
            if (filteredSongs.length < 4) {
                alert("Not enough songs to pick 4.");
                return;
            }

            const randomModal = document.getElementById("random-multiple-modal");
            randomModal.classList.remove("hidden");
            randomModal.classList.add("show");

            const modalContent = randomModal.querySelector(".random-modal-content");

            let animationInterval = setInterval(() => {
                let shuffled = [...filteredSongs].sort(() => 0.5 - Math.random());
                let selectedSongs = shuffled.slice(0, 4);
                modalContent.innerHTML = generateFourSongGrid(selectedSongs);
            }, 80);

            setTimeout(() => {
                clearInterval(animationInterval);
                let shuffled = [...filteredSongs].sort(() => 0.5 - Math.random());
                let finalSongs = shuffled.slice(0, 4);

                modalContent.innerHTML = generateFourSongGrid(finalSongs);
                modalContent.innerHTML += `<button id="pick-again-button-multiple">Pick Again</button>`;

                document.getElementById("pick-again-button-multiple").addEventListener("click", function () {
                    document.getElementById("random-button-multiple").click();
                });
            }, 2000);
        });

        document.addEventListener("click", function (event) {
            if (event.target.closest(".random-modal-song-item")) {
                const songItem = event.target.closest(".random-modal-song-item");
                const song = JSON.parse(songItem.dataset.song);
                const difficultyClass = song.difficulty.toLowerCase();
                const sideClass = song.side.toLowerCase();

                modalContent.innerHTML = generateModal(song, sideClass, difficultyClass);
                modal.classList.remove("hidden");
                modal.classList.add("show");
            }
        });

        
    })
    .catch(error => console.error('Error loading songs:', error));
