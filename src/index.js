const BASE_URL = 'https://api.themoviedb.org/3/';
const ENDPOINT = 'trending/movie/day';
const API_KEY = '14d14d317e7936ec61c7763e22ff83f6';
const trendingListEl = document.querySelector('.js-list');
const target = document.querySelector('.js-guard');

let currentPage = 1;
let options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

getTrending()
  .then(data => {
    trendingListEl.insertAdjacentHTML('beforeend', createMarkup(data.results));
    observer.observe(target);
  })
  .catch(err => console.log(err));

function getTrending(page = 1) {
  return fetch(`${BASE_URL}${ENDPOINT}?api_key=${API_KEY}&page=${page}`).then(
    resp => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }

      return resp.json();
    }
  );
}

function createMarkup(arr) {
  return arr
    .map(({ title, poster_path }) => {
      return `<li class="item">
        <img src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="${title}">
        <div class="info-wrap">
          <h2 class="title">${title}</h2>
        </div>
      </li>`;
    })
    .join('');
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      getTrending(currentPage)
        .then(data => {
          trendingListEl.insertAdjacentHTML(
            'beforeend',
            createMarkup(data.results)
          );
          if (data.page === data.total_pages) {
            observer.unobserve(target);
          }
        })
        .catch(err => console.log(err));
    }
  });
}
