// ============== States ================
let prodCards = document.getElementById("prodCards")
let searchInp = document.getElementById("searchInp")
let searchBtn = document.getElementById("searchBtn")

// ============== Map Recipe Cards ================

function renderCards(recipes) {
    
    prodCards.innerHTML = ""
    recipes.map(recipe => {
        
        prodCards.innerHTML +=
        `
        <div class="prodCardsDiv col-span-4 bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl overflow-hidden hover:scale-[1.01] transition-all duration-300 shadow-lg cursor-pointer">

            <!-- Image -->
            <div class="relative w-full h-[230px] overflow-hidden">
                <img src="${recipe.strMealThumb}" 
                class="object-cover w-full h-full transition duration-300 hover:scale-105">

                <!-- Fade gradient -->
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>

                <!-- Category badge -->
                <span class="absolute top-3 left-3 flex items-center gap-1 bg-black/40 text-white text-[12px] px-3 py-1 rounded-full backdrop-blur-sm">
                    <i class="fa-solid fa-utensils text-[11px]"></i> 
                    ${recipe.strCategory}
                </span>
            </div>

            <!-- Content -->
            <div class="px-5 py-4 text-white space-y-3">

                <!-- Title -->
                <p class="font-semibold text-[20px] leading-tight">${recipe.strMeal}</p>

                <!-- Area badge -->
                <span class="inline-flex items-center gap-1 bg-white/20 text-white text-[13px] px-2 py-1 rounded-lg">
                    <i class="fa-solid fa-globe text-[12px]"></i>
                    ${recipe.strArea}
                </span>

                <!-- Short description -->
                <p class="text-[13px] opacity-90 line-clamp-2 pl-1">
                    <i class="fa-solid fa-align-left text-[11px] opacity-80"></i>
                    ${recipe.strInstructions.slice(0, 120)}...
                </p>

                <!-- Youtube Button -->
                <a href="${recipe.strYoutube}" target="_blank"
                class="inline-flex items-center gap-2 mt-2 bg-white/20 hover:bg-white/30 transition text-white text-[14px] px-4 py-2 rounded-lg backdrop-blur-sm">
                <i class="fa-brands fa-youtube text-red-700 text-[18px]"></i>
                Watch Video
                </a>

            </div>
        </div>
        `

    });
    
    // Save last recipes
    localStorage.setItem("lastRecipes" , JSON.stringify(recipes) || [])
    
}

// ============== Load Last Recipes ================

let lastRecipes = JSON.parse( localStorage.getItem("lastRecipes") || "[]" )

if (lastRecipes.length > 0) {
    searchInp.value = localStorage.getItem("lastSearch") || "";
    renderCards(lastRecipes);
}
else {
    // Default 6 meals
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
    .then(res => res.json())
    .then(data => renderCards(data.meals.slice(0, 6)));
}

// ============== Search Function ================

function handleSearch() {
    
    const userQuery = searchInp.value.trim();
    if (!userQuery) return;

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userQuery}`)
    .then(res => res.json())
    .then(data => {

        if (!data.meals) {
            prodCards.innerHTML = `
            <div class="flex flex-row justify-center col-span-12 my-10">
                <p class='text-white text-xl'>No recipes found!</p>
            </div>
            `;
            return;
        }

        renderCards(data.meals);
        localStorage.setItem("lastSearch", userQuery)

    })
    .catch(err => console.log(err));
                
}

// ============== Event Listeners ================

searchBtn.addEventListener('click', handleSearch);
searchInp.addEventListener('keydown', (e) => {

    if(e.key === 'Enter') handleSearch()

});
