const audio = document.getElementById("audioPlayer");

const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");

const duration = document.getElementById("duration");
const currentTime = document.getElementById("currentTime");

const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");
const volumeValue = document.getElementById("volumeValue");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const favoriteBtn = document.getElementById("favoriteBtn");
const favoriteText = document.getElementById("favoriteText");

const autoplayToggle = document.getElementById("autoplayToggle");

const playlistElement = document.getElementById("playlist");
const trackCount = document.getElementById("trackCount");

const albumArt = document.getElementById("albumArt");

const audioUpload = document.getElementById("audioUpload");

const playlistNav = document.getElementById("playlistNav");

let currentIndex = 0;

let isShuffle = false;

let isRepeat = false;

let isFavorite = false;

const songs = [

    {
        title: "Midnight Drive",
        artist: "Luna Waves",
        duration: "5:00",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        icon: "♫"
    },

    {
        title: "Neon Dreams",
        artist: "The Night Riders",
        duration: "6:12",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        icon: "◉"
    },

    {
        title: "Afterglow",
        artist: "Echo Avenue",
        duration: "5:35",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        icon: "✦"
    }

];

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const secondsPart = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${secondsPart}`;
}


function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


function renderPlaylist() {

    playlistElement.innerHTML = "";



    if (songs.length === 0) {

        playlistElement.innerHTML = `
            <div class="empty-playlist">
                No songs added yet.<br>
                Use "Add Local Songs" to build your playlist.
            </div>
        `;

        trackCount.textContent = "0 tracks";

        return;
    }



    trackCount.textContent =
        `${songs.length} ${songs.length === 1 ? "track" : "tracks"}`;



    songs.forEach((song, index) => {

        const track = document.createElement("div");

        track.className =
            `track ${index === currentIndex ? "active" : ""}`;


        track.innerHTML = `

    <div class="track-art">
        ${song.icon || "♫"}
    </div>

    <div>

        <div class="track-title">
            ${escapeHtml(song.title)}
        </div>

        <div class="track-artist">
            ${escapeHtml(song.artist)}
        </div>

    </div>

    <div class="track-actions">

        <div class="track-duration">

            ${
                index === currentIndex && !audio.paused
                    ? '<span class="track-playing">♫</span>'
                    : ""
            }

            ${song.duration || "0:00"}

        </div>

        <button
            class="delete-song"
            type="button"
            title="Delete song"
            aria-label="Delete ${escapeHtml(song.title)}"
        >
            🗑
        </button>

    </div>

`;


       track.addEventListener("click", () => {

    loadSong(index);

    playSong();

});


const deleteButton =
    track.querySelector(".delete-song");


deleteButton.addEventListener("click", (event) => {

    // Stop the track click event
    event.stopPropagation();

    deleteSong(index);

});

        playlistElement.appendChild(track);

    });

}



function deleteSong(index) {

    if (index < 0 || index >= songs.length) {
        return;
    }


    const wasPlaying =
        index === currentIndex && !audio.paused;


    // Stop current audio if deleting current song
    if (index === currentIndex) {

        audio.pause();

        audio.currentTime = 0;

        audio.removeAttribute("src");

        audio.load();

    }


    // Release local file memory
    if (
        songs[index].src &&
        songs[index].src.startsWith("blob:")
    ) {

        URL.revokeObjectURL(songs[index].src);

    }


    // Remove song
    songs.splice(index, 1);


    // Playlist is now empty
    if (songs.length === 0) {

        currentIndex = 0;

        songTitle.textContent = "No Song Selected";

        songArtist.textContent = "Add a song to start listening";

        currentTime.textContent = "0:00";

        duration.textContent = "0:00";

        progressBar.value = 0;

        playBtn.textContent = "▶";

        albumArt.classList.remove("playing");

        renderPlaylist();

        return;
    }


    // Adjust current index
    if (index < currentIndex) {

        currentIndex--;

    }

    else if (currentIndex >= songs.length) {

        currentIndex = songs.length - 1;

    }


    // Load another song
    loadSong(currentIndex);


    // Continue playing if deleted song was playing
    if (wasPlaying) {

        playSong();

    }

}

function loadSong(index) {

    if (songs.length === 0) {
        return;
    }



    currentIndex =
        (index + songs.length) % songs.length;


    const song = songs[currentIndex];



    audio.src = song.src;



    songTitle.textContent = song.title;

    songArtist.textContent = song.artist;

    currentTime.textContent = "0:00";

    duration.textContent =
        song.duration || "0:00";
    progressBar.value = 0;

    isFavorite = false;

    favoriteBtn.classList.remove("liked");

    favoriteBtn.textContent = "♡";

    favoriteText.textContent =
        "Add to favorites";
    renderPlaylist();

}

async function playSong() {

    if (songs.length === 0) {
        return;
    }


    try {

        await audio.play();


        playBtn.textContent = "Ⅱ";

        playBtn.setAttribute(
            "aria-label",
            "Pause"
        );


        albumArt.classList.add("playing");


        renderPlaylist();

    }

    catch (error) {

        console.warn(
            "Playback could not start:",
            error
        );


        alert(
            "The browser could not start this track. " +
            "Try clicking Play again or add a local MP3 file."
        );

    }

}


function pauseSong() {

    audio.pause();


    playBtn.textContent = "▶";


    playBtn.setAttribute(
        "aria-label",
        "Play"
    );


    albumArt.classList.remove("playing");


    renderPlaylist();

}


function togglePlay() {

    if (audio.paused) {

        playSong();

    }

    else {

        pauseSong();

    }

}


function nextSong() {

    if (songs.length === 0) {
        return;
    }


    // Shuffle mode

    if (isShuffle && songs.length > 1) {

        let nextIndex;


        do {

            nextIndex =
                Math.floor(
                    Math.random() * songs.length
                );

        }

        while (nextIndex === currentIndex);


        loadSong(nextIndex);

    }

    else {

        loadSong(currentIndex + 1);

    }


    playSong();

}

function previousSong() {

    if (songs.length === 0) {
        return;
    }




    if (audio.currentTime > 3) {

        audio.currentTime = 0;

        return;

    }


    loadSong(currentIndex - 1);

    playSong();

}

playBtn.addEventListener(
    "click",
    togglePlay
);

nextBtn.addEventListener(
    "click",
    nextSong
);

prevBtn.addEventListener(
    "click",
    previousSong
);

shuffleBtn.addEventListener(
    "click",
    () => {

        isShuffle = !isShuffle;


        shuffleBtn.classList.toggle(
            "active",
            isShuffle
        );

    }
);

repeatBtn.addEventListener(
    "click",
    () => {

        isRepeat = !isRepeat;


        repeatBtn.classList.toggle(
            "active",
            isRepeat
        );

    }
);

favoriteBtn.addEventListener(
    "click",
    () => {

        isFavorite = !isFavorite;


        favoriteBtn.classList.toggle(
            "liked",
            isFavorite
        );


        if (isFavorite) {

            favoriteBtn.textContent = "♥";

            favoriteText.textContent =
                "Added to favorites";

        }

        else {

            favoriteBtn.textContent = "♡";

            favoriteText.textContent =
                "Add to favorites";

        }

    }
);



volumeBar.addEventListener(
    "input",
    () => {

        audio.volume =
            Number(volumeBar.value);
        volumeValue.textContent =
            `${Math.round(audio.volume * 100)}%`;

    }
);

progressBar.addEventListener(
    "input",
    () => {

        if (!Number.isFinite(audio.duration)) {
            return;
        }


        audio.currentTime =
            (Number(progressBar.value) / 100)
            * audio.duration;

    }
);

audio.addEventListener(
    "loadedmetadata",
    () => {

        duration.textContent =
            formatTime(audio.duration);

    }
);




audio.addEventListener(
    "timeupdate",
    () => {

        if (
            !Number.isFinite(audio.duration) ||
            audio.duration === 0
        ) {
            return;
        }


        const percentage =
            (audio.currentTime / audio.duration) * 100;


        progressBar.value =
            percentage;


        currentTime.textContent =
            formatTime(audio.currentTime);


        duration.textContent =
            formatTime(audio.duration);

    }
);




audio.addEventListener(
    "play",
    () => {

        playBtn.textContent = "Ⅱ";


        playBtn.setAttribute(
            "aria-label",
            "Pause"
        );


        albumArt.classList.add("playing");


        renderPlaylist();

    }
);




audio.addEventListener(
    "pause",
    () => {

        playBtn.textContent = "▶";


        playBtn.setAttribute(
            "aria-label",
            "Play"
        );


        albumArt.classList.remove("playing");


        renderPlaylist();

    }
);




audio.addEventListener(
    "ended",
    () => {



        if (isRepeat) {

            audio.currentTime = 0;

            playSong();

        }



        else if (autoplayToggle.checked) {

            nextSong();

        }



        else {

            pauseSong();

        }

    }
);



audio.volume = 0.75;




audioUpload.addEventListener(
    "change",
    (event) => {

        const files =
            [...event.target.files];


        files.forEach((file) => {



            if (!file.type.startsWith("audio/")) {
                return;
            }



            const localSong = {

                title:
                    file.name.replace(
                        /\.[^/.]+$/,
                        ""
                    ),

                artist:
                    "Local File",

                duration:
                    "Loading...",

                src:
                    URL.createObjectURL(file),

                icon:
                    "♫"

            };



            songs.push(localSong);

        });



        renderPlaylist();



        if (songs.length === files.length) {

            loadSong(0);

        }



        event.target.value = "";

    }
);




playlistNav.addEventListener(
    "click",
    () => {

        document
            .getElementById("playlistPanel")
            .scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

    }
);




document
    .getElementById("themeHint")
    .addEventListener(
        "click",
        () => {

            alert(
                "NightBeat uses a dark theme for a clean music-player experience."
            );

        }
    );




loadSong(0);