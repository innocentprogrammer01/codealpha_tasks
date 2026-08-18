

const filterButtons = document.querySelectorAll(".filter-buttons button");
const galleryItems = document.querySelectorAll(".gallery .image");

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");

const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentImages = [];
let currentIndex = 0;


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Active Button
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        galleryItems.forEach(item => {

            if (filter === "all") {

                item.style.display = "block";

            } else {

                if (item.classList.contains(filter)) {

                    item.style.display = "block";

                } else {

                    item.style.display = "none";

                }

            }

        });

    });

});



galleryItems.forEach(item => {

    item.addEventListener("click", () => {

        currentImages = Array.from(document.querySelectorAll(".gallery .image"))
            .filter(img => img.style.display !== "none");

        currentIndex = currentImages.indexOf(item);

        showImage();

        lightbox.classList.add("active");

    });

});


function showImage() {

    const img = currentImages[currentIndex].querySelector("img");

    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;

}


nextBtn.addEventListener("click", () => {

    currentIndex++;

    if (currentIndex >= currentImages.length) {

        currentIndex = 0;

    }

    showImage();

});



prevBtn.addEventListener("click", () => {

    currentIndex--;

    if (currentIndex < 0) {

        currentIndex = currentImages.length - 1;

    }

    showImage();

});



closeBtn.addEventListener("click", () => {

    lightbox.classList.remove("active");

});


lightbox.addEventListener("click", (e) => {

    if (e.target === lightbox) {

        lightbox.classList.remove("active");

    }

});


document.addEventListener("keydown", (e) => {

    if (!lightbox.classList.contains("active")) return;

    if (e.key === "ArrowRight") {

        nextBtn.click();

    }

    if (e.key === "ArrowLeft") {

        prevBtn.click();

    }

    if (e.key === "Escape") {

        lightbox.classList.remove("active");

    }

});



let startX = 0;

lightbox.addEventListener("touchstart", (e) => {

    startX = e.changedTouches[0].clientX;

});

lightbox.addEventListener("touchend", (e) => {

    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) {

        nextBtn.click();

    }

    if (endX - startX > 50) {

        prevBtn.click();

    }

});