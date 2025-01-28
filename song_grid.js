// song_grid.js 
fetch('data/song_list.json') // 载入 JSON 文件
    .then(response => response.json())
    .then(songs => {
        const songList = document.querySelector('.song-grid');
        const modal = document.getElementById('song-modal');
        const modalContent = modal.querySelector('.modal-content');

        songs.forEach(song => {
            const difficultyClass = song.difficulty.toLowerCase();

            // 动态创建歌曲卡片
            const card = document.createElement('div');
            card.classList.add('song-card');
            card.innerHTML = `
                <img src="${song.image}" alt="${song.title}">
                <label class="${difficultyClass}">${song.difficulty} ${song.level}</label>
            `;

            // 添加点击事件
            card.addEventListener('click', () => {
                // 动态生成 Modal 内容
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

                // 显示 Modal
                modal.classList.remove('hidden');
                modal.classList.add('show');

                // Close the modal when clicking outside the modal content
                modal.addEventListener('click', (event) => {
                    if (event.target === modal) {
                        modal.classList.add('hidden');
                    }
                });

            });

            songList.appendChild(card);
        });
    })
    .catch(error => console.error('Error loading songs:', error));
