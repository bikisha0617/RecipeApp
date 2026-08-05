const cards = document.querySelectorAll(".category-card");

cards.forEach(card => {
    card.addEventListener("click", function(e){
        e.preventDefault();
        alert("Category page coming soon!");
    });
});