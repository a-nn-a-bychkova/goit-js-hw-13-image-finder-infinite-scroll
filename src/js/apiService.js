export const imageLimit = 12;
const BASE_URL = 'https://pixabay.com';

function fetchImages(searchQuery, page) {
  return fetch(
    `${BASE_URL}/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=${imageLimit}&key=19110749-e340c63922b3f8a4d502270f7`,
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error();
  });
}

export default fetchImages;
