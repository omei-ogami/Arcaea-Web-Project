fetch('data/song_list.json') // Load the JSON file
    .then(response => response.json())
    .then(songs => {
        const songList = document.querySelector('.song-grid');
        const modal = document.getElementById('song-modal');
        const modalContent = modal.querySelector('.modal-content');

        songs.forEach(song => {
            const difficultyClass = song.difficulty.toLowerCase();

            // Dynamically create song cards
            const card = document.createElement('div');
            card.classList.add('song-card');
            card.innerHTML = `
                <img src="${song.image}" alt="${song.title}">
                <label class="${difficultyClass}">${song.difficulty} ${song.level}</label>
            `;

            // Add click event to each card
            card.addEventListener('click', () => {
                // Dynamically generate modal content
                modalContent.innerHTML = `
                    <img src="${song.image}" alt="${song.title}">
                    <p>${song.pack}</p>
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                    <label class="${difficultyClass}">${song.difficulty} ${song.constant}</label>
                    <p>BPM: ${song.bpm}</p>
                    <p>Side: ${song.side}</p>
                    <p>Chart Designer: ${song.chart_designer}</p>
                    <p>Unlock Condition: ${song.unlock}</p>
                `;

                // Show modal
                modal.classList.remove('hidden');
                modal.classList.add('show');
            });

            songList.appendChild(card);
        });

        // Close modal when clicking outside modal content
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });

        // Random button functionality
        document.getElementById("random-button").addEventListener("click", function() {
            // Show modal
            const modal = document.getElementById("song-modal");
            modal.classList.remove('hidden');
            modal.classList.add('show');

            // Initially show "Drawing..."
            const modalContent = modal.querySelector('.modal-content');

            // Simulate random scroll animation
            let count = 0;
            const animationInterval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * songs.length); // Use songs array for random selection
                modalContent.innerHTML = `
                    <img src="${songs[randomIndex].image}" alt="${songs[randomIndex].title}">
                    <p>${songs[randomIndex].pack}</p>
                    <h3>${songs[randomIndex].title}</h3>
                    <p>${songs[randomIndex].artist}</p>
                    <label class="${songs[randomIndex].difficulty.toLowerCase()}">${songs[randomIndex].difficulty} ${songs[randomIndex].constant}</label>
                    <p>BPM: ${songs[randomIndex].bpm}</p>
                    <p>Side: ${songs[randomIndex].side}</p>
                    <p>Chart Designer: ${songs[randomIndex].chart_designer}</p>
                    <p>Unlock Condition: ${songs[randomIndex].unlock}</p>
                    
                `;
            }, 50); // Change every 100ms for random effect

            // After 2 seconds, show the final result
            setTimeout(() => {
                clearInterval(animationInterval); // Stop the animation
                const finalSong = songs[Math.floor(Math.random() * songs.length)]; // Randomly pick a final song
                
                // Update modal content with final song details
                modalContent.innerHTML = `
                    <img src="${finalSong.image}" alt="${finalSong.title}">
                    <p>${finalSong.pack}</p>
                    <h3>${finalSong.title}</h3>
                    <p>${finalSong.artist}</p>
                    <label class="${finalSong.difficulty.toLowerCase()}">${finalSong.difficulty} ${finalSong.constant}</label>
                    <p>BPM: ${finalSong.bpm}</p>
                    <p>Side: ${finalSong.side}</p>
                    <p>Chart Designer: ${finalSong.chart_designer}</p>
                    <p>Unlock Condition: ${finalSong.unlock}</p>
                    <button id="pick-again-button">Pick Again</button>
                `;
                
                // Add event listener to the "Pick Again" button
                document.getElementById("pick-again-button").addEventListener("click", function() {
                    // Reset the modal content and call the random button functionality again
                    document.getElementById("random-button").click();
                });
            }, 2000);
        });

        

    })
    .catch(error => console.error('Error loading songs:', error));


