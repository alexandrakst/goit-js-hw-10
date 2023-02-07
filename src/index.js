import './css/styles.css';
import countriesAPI from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(evt) {
  evt.preventDefault();

  const searchQuery = evt.target.value.trim();

  if (searchQuery === '') {
    clearInterface();
    return;
  }

  countriesAPI.fetchCountries(searchQuery).then(country => {
    if (country.length >= 11) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
      refs.countryListEl.innerHTML = '';
      return;
    }

    if (country.length >= 2) {
      showCountriesList(country);
      refs.countryInfoEl.innerHTML = '';
      return;
    }

    if (country.length === 1) {
      showCountryInfo(country[0]);
      refs.countryListEl.innerHTML = '';
      return;
    }

    if (country.status === 404) {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearInterface();
    }
  });
}

function showCountryInfo(country) {
  const language = Object.values(country.languages);

  const markup = `<h2><img src='${country.flags.svg}' alt='flag' width='30' class='country-flag'/>${country.name.common}</h2>
    <p><strong>Capital:</strong> ${country.capital}</p>
    <p><strong>Population:</strong> ${country.population}</p>
    <p><strong>Languages:</strong> ${language}</p>
    `;

  refs.countryInfoEl.innerHTML = markup;
}

function showCountriesList(country) {
  const list = country
    .map(
      name =>
        `<li class='list-element'>
    <p><img src='${name.flags.svg}' alt='country-flag' width='30' class='flag'/> ${name.name.common}<p>
    </li>`
    )
    .join('');

  refs.countryListEl.innerHTML = list;
}

function clearInterface() {
  refs.countryInfoEl.innerHTML = '';
  refs.countryListEl.innerHTML = '';
}
