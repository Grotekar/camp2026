# Лендинг детской выездной смены 2026

Статический лендинг для публикации избранных фотографий после детской выездной церковной смены. Работает без backend, CMS, базы данных, авторизации и сборщика.

## Структура

```text
index.html
style.css
script.js
config.example.js
photos/
```

Реальный файл `config.js` не хранится в git. Он нужен только для ссылки на Яндекс Диск.

## Важное про ссылку на Яндекс Диск

Переменная окружения помогает не публиковать ссылку в git, но не делает её секретной для посетителя сайта. Если кнопка в браузере ведёт на Яндекс Диск, итоговая ссылка всё равно будет видна в исходном коде страницы или сетевых запросах.

Для этого лендинга нормальная цель такая: не хранить ссылку в репозитории, но понимать, что опубликованная страница отдаёт её пользователю.

## Как открыть локально

1. Скопируйте `config.example.js` в `config.js`.
2. В `config.js` замените `diskUrl` на реальную ссылку Яндекс Диска.
3. Откройте `index.html` двойным кликом в браузере.

Интернет нужен только для загрузки шрифта Google Fonts и лёгкой CDN-библиотеки Swiper. Если Swiper не загрузится, галерея покажется обычной аккуратной сеткой.

## Как заменить фотографии

1. Сложите избранные изображения в папку `photos/`.
2. Желательно использовать оптимизированные `.jpg`, `.webp` или `.avif` шириной 1200-1800 px.
3. Откройте `script.js`.
4. В массиве `SITE_CONFIG.photos` замените пути, подписи и alt-тексты:

```js
{ src: "photos/my-photo-01.jpg", alt: "Описание фотографии", caption: "Подпись" }
```

Если фотографий мало, карусель всё равно будет работать. Если список случайно оставить пустым, сайт покажет аккуратную заглушку.

## Как заменить ссылку на Яндекс Диск

Локально:

1. Скопируйте `config.example.js` в `config.js`.
2. Вставьте ссылку:

```js
window.LANDING_CONFIG = {
  diskUrl: "https://disk.yandex.ru/i/ВАША-ССЫЛКА"
};
```

Файл `config.js` добавлен в `.gitignore`, поэтому не попадёт в репозиторий при обычном коммите.

## Как поменять название смены и даты

Основные тексты находятся в `index.html`. В начале hero-блока оставлен комментарий с местом, где удобно менять название, даты, заголовок и подзаголовок.

## Деплой на Cloudflare Pages

Актуальная логика Cloudflare Pages такая: для проекта без фреймворка build command можно оставить пустым, но в документации Cloudflare также прямо указано, что если preset не используется, можно поставить `exit 0` как build command. Root directory обычно не нужно указывать, если файлы лежат в корне репозитория.

### Вариант 1: через Git, без хранения ссылки в git

1. Загрузите проект в GitHub-репозиторий без файла `config.js`.
2. В Cloudflare откройте **Workers & Pages**.
3. Нажмите **Create application** или **Create**.
4. Выберите **Pages** и подключение к Git.
5. Выберите репозиторий.
6. В build settings укажите:
   - Framework preset: `None` или пустой выбор фреймворка.
   - Build command: команду ниже.
   - Build output directory: `.` или `/`, если интерфейс требует поле. Если поле не показывается, оставьте как есть.
   - Root directory: не заполнять, если проект лежит в корне репозитория.

Build command:

```sh
node -e "require('fs').writeFileSync('config.js','window.LANDING_CONFIG = { diskUrl: ' + JSON.stringify(process.env.YANDEX_DISK_URL || '') + ' };')"
```

7. После создания проекта откройте **Settings** -> **Environment variables**.
8. Добавьте переменную `YANDEX_DISK_URL` со ссылкой на Яндекс Диск.
9. Сделайте redeploy последнего deployment, чтобы `config.js` сгенерировался с новым значением.

Cloudflare в официальной документации пишет, что переменные окружения находятся в **Workers & Pages** -> ваш Pages project -> **Settings** -> **Environment variables**.

### Вариант 2: Direct Upload

Этот вариант проще, если не нужны автодеплои из Git:

1. Локально создайте `config.js` из `config.example.js`.
2. Проверьте сайт открытием `index.html`.
3. В Cloudflare откройте **Workers & Pages**.
4. Выберите **Create application** -> **Get started** -> **Drag and drop your files**.
5. Перетащите папку проекта или zip-архив.
6. Нажмите **Deploy site**.

Cloudflare поддерживает direct upload папки или zip-архива через drag and drop, но для такого проекта потом нельзя переключить этот же Pages-проект на Git integration. Если понадобится Git integration, создайте новый Pages-проект.

## Деплой на GitHub Pages

### Простой вариант без секретной ссылки

1. Загрузите файлы в GitHub-репозиторий.
2. Откройте **Settings** -> **Pages**.
3. В блоке **Build and deployment** выберите:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
4. Нажмите **Save**.

В этом варианте GitHub Pages не создаст `config.js` из переменной окружения. Значит, кнопки Яндекс Диска будут отключены, пока `config.js` не появится в опубликованных файлах.

### Вариант с секретом GitHub Actions

Если нужно не хранить ссылку в git, но публиковать её на GitHub Pages, используйте GitHub Actions:

1. В репозитории откройте **Settings** -> **Secrets and variables** -> **Actions**.
2. Добавьте secret `YANDEX_DISK_URL`.
3. Настройте workflow, который перед публикацией создаёт `config.js` из этого secret.

Важно: после публикации ссылка всё равно будет видна посетителям сайта, потому что это клиентская кнопка.

## QR-код

После публикации сайта можно создать QR-код на итоговую ссылку страницы и заменить блок `QR` в финальной секции на изображение QR-кода.

## Источники по Cloudflare Pages

- [Cloudflare Pages: Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages: Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
