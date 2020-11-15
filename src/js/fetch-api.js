import { refs } from './refs';
import API, { imageLimit } from './apiService';
import debounce from 'lodash.debounce';
import imageCardTpl from '../templates/image-card.hbs';

// import './infinite-scroll';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, info, error, defaultModules } from '@pnotify/core';

let hits = [];
let searchQuery;

refs.galleryEl.innerHTML = '';

refs.inputEl.addEventListener('input', debounce(onInputType, 500));

function onInputType(e) {
  e.preventDefault();
  const field = e.target;
  refs.galleryEl.innerHTML = '';
  hits = [];
  searchQuery = refs.inputEl.value;
  if (searchQuery == '') {
    refs.galleryEl.innerHTML = '';
    return;
  }
  API(searchQuery, 1)
    .then(renderContent)
    .catch(onFetchError)
    .finally(() => field.reset);
}

function renderContent(response) {
  const images = response.hits;
  hits.push(...images);
  renderImageCards(hits);
}

function renderImageCards(images) {
  refs.galleryEl.innerHTML = imageCardTpl(images);
}

function onFetchError() {
  alert({
    text: 'Something went wrong',
    maxTextHeight: null,
    sticker: false,
  });
}

const onEntry = entries => {
  console.log('searchQuery', searchQuery);
  entries.forEach(entry => {
    if (entry.isIntersecting && searchQuery !== '') {
      console.log(searchQuery);
      console.log('it is high time for new images');
      const page = Math.floor(hits.length / imageLimit) + 1;
      API(searchQuery, page).then(renderContent);
    }
  });
};

const options = {
  rootMargin: '150px',
};

const observer = new IntersectionObserver(onEntry, options);

observer.observe(refs.sentinelEl);
