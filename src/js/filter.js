// import SlimSelect from 'slim-select'
// import 'slim-select/dist/slimselect.css'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getFilteredRecipes, getAreas, getIngredients } from './api';
import { debounce } from 'lodash';
import Gallery from './gallery';
import { handlerFilterForm } from './hendlers_filter';


// import { activeButton } from './categories';



const inputForm = document.querySelector(".filter-form-input");


const resetFormButton = document.querySelector(".filter-reset-btn")
const selectes = document.querySelectorAll(".filter-form-select");
const boxOption = document.querySelector(".filter-option-box");

const gallery = document.querySelector(".filter-gallery-list");


const selectTime = document.getElementById("searchTime");
const selectArea = document.getElementById("area-select");
const selectIngr = document.getElementById("ingredients-select");


startGallery();
inputForm.addEventListener('input', debounce(() => { handlerFilterForm() }, 3000));
resetFormButton.addEventListener("click", clearFilters)


async function createOptionsSelect() {
    try {
        for (const item of selectes) {
            const options = [];

            if (item === selectTime) {
                const minTime = 5;
                const maxTime = 120;
                const step = 5;

                for (let time = minTime; time <= maxTime; time += step) {
                    options.push(`<option class="filter-form-select-time" value="${time}">${time} хв</option>`);
                }

                const optionsMarkup = options.join('');
                selectTime.innerHTML = optionsMarkup;
            }
            if (item === selectArea) {
                const getOptionAreas = await getAreas();
                const optionAreas = getOptionAreas.map((area) => {
                    const { name, _id: idArea } = area;
                    return `<option class="filter-form-select-time" id="${idArea}" value="${name}">${name} </option>`;
                }).join('');

                selectArea.innerHTML = optionAreas;
            }

            if (item === selectIngr) {
                const getOptionIngr = await getIngredients();
                const optionIngr = getOptionIngr.map((area) => {
                    const { name, _id: idIngr } = area;
                    return `<option class="filter-form-select-time" id="${idIngr}" value="${name}">${name} </option>`;
                }).join('');

                selectIngr.innerHTML = optionIngr;
            }

        }
    } catch (error) {
        console.error(error);
    }
}

createOptionsSelect()

function clearFilters() {
    inputForm.value = "";

    // Скидання значень у селектах 
    selectes.forEach(select => {
        select.selectedIndex = 0;
    })
}



async function startGallery() {

    try {
        const recipes = await getFilteredRecipes();
        console.log(recipes);
        const { page, results, totalPage } = recipes;
        const marcup = Gallery.createMarkupCard({ results });
        Gallery.appendMarkupToGallery(gallery, marcup);
        // createMurcupGallery(recipes);
        if (page < totalPage) {
            // ПАГІНКАЦІЯ.classList.remove('is-hidden');
            // ПАГІНАЦІЯ.addEventListener('click', handlerLoad);
            //тут робимо видимою пагінацію і вішаємо на неї слухач
        }

    } catch (error) {
        console.error(error);

    }
}


export {
    clearFilters,

};