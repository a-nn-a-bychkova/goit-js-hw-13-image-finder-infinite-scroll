import InfiniteScroll from 'infinite-scroll';
import { refs } from './refs';
import { BASE_URL } from './apiService';

const infScroll = new InfiniteScroll(refs.galleryEl, {
  append: false,
  responseType: 'text',
  history: false,
  path() {
    return `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=yellow+flower&page=${this.pageIndex}&per_page=12&key=19110749-e340c63922b3f8a4d502270f7`;
  },
});

console.log(infScroll);
