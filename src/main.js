import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { fetchImages } from './js/pixabay-api';
import { refs } from './js/refs';
import { renderImages } from './js/render-functions';
import iconError from './img/error.svg';
import { showLoader, hideLoader } from './js/loader';
import { scrollShow, scrollToTop } from './js/scroll-to-top';


let page = 1;
let isLoading = false;
let currentQuery = '';
let totalHits = 0;
export const per_page = 15;


refs.form.addEventListener('submit', event => {
    event.preventDefault();

  const query = refs.inputQuery.value.trim();
  if (!query) {
     iziToast.warning({
      title: 'Caution',
      message: 'The form cannot be empty! Please check and fill it out.',
      position: 'topRight',
      maxWidth: 300,
     });
      refs.inputQuery.value = '';
      return;
    }
    currentQuery = query;
    page = 1;
    refs.gallery.innerHTML = '';
    loadImages();
    refs.inputQuery.value = '';
});

const loadImages = async () => {
  if (isLoading) {
    return;
  }
  isLoading = true;
  showLoader();
  try { const data = await fetchImages(currentQuery, page, per_page)
      const images = data.hits;
      totalHits = data.totalHits;
      if (images.length === 0) {
        iziToast.error({
          message:
            ' Sorry, there are no images matching your search query.Please try again!',
          messageColor: '#FAFAFB',
          position: 'topRight',
          backgroundColor: '#EF4040',
          borderColor: '#FFBEBE',
          maxWidth: 432,
          class: 'custom-toast',
          theme: 'dark',
          iconUrl: iconError,
        });
        return;
      } 
        renderImages(images);
        const card = document.querySelector('.gallery-item');
        const cardsHeight = card.getBoundingClientRect().height;
        if (page >1 ) {
          window.scrollBy({
          top: cardsHeight * 2,
          left: 0,
          behavior: 'smooth'
        });
        } 
        const totalPages = Math.ceil(totalHits / per_page);;
        if (page >= totalPages) {
          iziToast.info({
            title: 'End of results',
            message: "We're sorry, but you've reached the end of search results.",
            position: 'bottomRight',
            backgroundColor: '#ff3d00',
            messageColor: '#FAFAFB',
          });
          refs.btnLoad.style.display = 'none';
        } else {
          refs.btnLoad.style.display = "block";
          page += 1;
        }
 } catch (error)  {
      console.error('Error:', error);
      iziToast.error({
        title: 'error',
        message: error.message || 'Something went wrong. Please try again.',
        
      });
    }
    finally {
      isLoading = false;
      hideLoader();
    }
};

refs.btnLoad.addEventListener('click', loadImages)
window.addEventListener('scroll', scrollShow);
refs.btnScrollUp.addEventListener('click', scrollToTop);

/*
const loadScroll = () => {
    if (isLoading) {
        return;
    }
  const scrollPosition = window.scrollY + window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;
  if (scrollPosition >= pageHeight - 350 && (page - 1) * 21 < totalHits) {
    loadImages();
  }
};
window.addEventListener('scroll', loadScroll);
*/