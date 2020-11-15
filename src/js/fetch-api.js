import API, { imageLimit } from './apiService';
import debounce from 'lodash.debounce';
import imageCardTpl from '../templates/image-card.hbs';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, info, error, defaultModules } from '@pnotify/core';

const inputEl = document.querySelector('input[name="query"]');
const galleryEl = document.querySelector('.js-gallery-container');
const loadMoreButtonEl = document.querySelector('.load-more-button');
let hits = [];
let searchQuery;

galleryEl.innerHTML = '';

inputEl.addEventListener('input', debounce(onInputType, 500));
loadMoreButtonEl.addEventListener('click', onButtonClick);

function onInputType(e) {
  e.preventDefault();
  const field = e.target;
  galleryEl.innerHTML = '';
  hits = [];
  searchQuery = inputEl.value;
  if (searchQuery == '') {
    galleryEl.innerHTML = '';
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
  if (images.length === imageLimit) {
    loadMoreButtonEl.classList.remove('hidden');
  } else {
    loadMoreButtonEl.classList.add('hidden');
  }
}

function renderImageCards(images) {
  galleryEl.innerHTML = imageCardTpl(images);
}

function onFetchError() {
  alert({
    text: 'Something went wrong',
    maxTextHeight: null,
    sticker: false,
  });
}

function onButtonClick(e) {
  const page = Math.floor(hits.length / imageLimit) + 1;
  e.preventDefault();
  const coordinateY = document.documentElement.scrollTop;
  API(searchQuery, page)
    .then(renderContent)
    .then(() => {
      window.scrollTo({
        top: coordinateY,
        left: 0,
        behavior: 'smooth',
      });
    })
    .catch(onFetchError);
}
