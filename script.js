// Меняйте здесь список избранных фотографий из папки photos/.
// Ссылка на Яндекс Диск берётся из необязательного файла config.js.
const SITE_CONFIG = {
  diskUrl: "https://disk.yandex.ru/i/PASTE-YOUR-LINK-HERE",
  photos: [
    { src: "photos/photo-01.svg", alt: "Участники смены на вечерней программе", caption: "Вечерняя программа" },
    { src: "photos/photo-02.svg", alt: "Командная игра на улице", caption: "Командные игры" },
    { src: "photos/photo-03.svg", alt: "Общее фото команды и участников", caption: "Все вместе" },
    { src: "photos/photo-04.svg", alt: "Тихий разговор после встречи", caption: "Разговоры без спешки" },
    { src: "photos/photo-05.svg", alt: "Друзья улыбаются на смене", caption: "Новые друзья" },
    { src: "photos/photo-06.svg", alt: "Финальный день смены", caption: "Финальный день" }
  ]
};

const slidesRoot = document.querySelector("#gallerySlides");
const diskLinks = document.querySelectorAll(".js-disk-link");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const lightboxClose = document.querySelector(".lightbox-close");

function applyDiskLinks() {
  const hasDiskUrl = SITE_CONFIG.diskUrl.startsWith("http");

  diskLinks.forEach((link) => {
    if (hasDiskUrl) {
      link.href = SITE_CONFIG.diskUrl;
      link.removeAttribute("aria-disabled");
      link.removeAttribute("title");
      return;
    }

    link.href = "#";
    link.setAttribute("aria-disabled", "true");
    link.title = "Добавьте ссылку на Яндекс Диск в config.js";
    link.addEventListener("click", (event) => event.preventDefault());
  });
}

function photoTemplate(photo, index) {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";

  const button = document.createElement("button");
  button.className = "photo-card";
  button.type = "button";
  button.setAttribute("aria-label", `Открыть фото: ${photo.caption}`);
  button.addEventListener("click", () => openLightbox(photo));

  const image = document.createElement("img");
  image.src = photo.src;
  image.alt = photo.alt;
  image.loading = index < 2 ? "eager" : "lazy";

  const caption = document.createElement("div");
  caption.className = "photo-caption";
  caption.textContent = photo.caption;

  button.append(image, caption);
  slide.append(button);
  return slide;
}

function renderGallery() {
  const photos = SITE_CONFIG.photos.filter((photo) => photo.src);
  const list = photos.length ? photos : [
    {
      src: "photos/photo-01.svg",
      alt: "Фотография скоро появится",
      caption: "Фотографии скоро появятся"
    }
  ];

  slidesRoot.replaceChildren(...list.map(photoTemplate));

  if (typeof Swiper !== "function") {
    document.querySelector(".gallery-prev").hidden = true;
    document.querySelector(".gallery-next").hidden = true;
    return;
  }

  new Swiper(".gallery-swiper", {
    slidesPerView: 1,
    spaceBetween: 14,
    loop: false,
    watchOverflow: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    navigation: {
      nextEl: ".gallery-next",
      prevEl: ".gallery-prev"
    },
    breakpoints: {
      768: {
        slidesPerView: Math.min(2, list.length),
        spaceBetween: 18
      },
      1024: {
        slidesPerView: Math.min(3, list.length),
        spaceBetween: 20
      }
    }
  });
}

function openLightbox(photo) {
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxCaption.textContent = photo.caption;

  if (typeof lightbox.showModal === "function") {
    lightbox.showModal();
  }
}

function closeLightbox() {
  lightbox.close();
  lightboxImage.src = "";
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.open) {
    closeLightbox();
  }
});

applyDiskLinks();
renderGallery();
