const recipes = [
{
    id:1,
    title:"Avocado Toast with Egg",
    author:"Aarav Sharma",
    time:"10 mins",
    image:"images/recipes/AvocadoBread.jpg",
    favourite:false,
    description:"A healthy and filling breakfast with creamy avocado, crispy toast, and a perfectly cooked egg.",
    servings:"2",
    ingredients:[
        "2 slices bread",
        "1 ripe avocado",
        "2 eggs",
        "Salt",
        "Black pepper",
        "Chilli flakes"
    ],
    instructions:[
        "Toast the bread until golden brown.",
        "Mash the avocado with salt and pepper.",
        "Cook the eggs to your preference.",
        "Spread avocado on the toast.",
        "Top with eggs and chilli flakes."
    ],
    nutrition:[
        "Calories: 300",
        "Protein: 15g",
        "Carbohydrates: 25g",
        "Fat: 15g"
    ]
},   

{
    id:2,
    title:"White Sauce Pasta",
    author:"Sophia Rossi",
    time:"30 mins",
    image:"images/recipes/pasta.jpg",
    favourite:false,
    description:"A creamy pasta with vegetables in a rich white sauce.",
    servings:"2",
    ingredients:[
        "200 g pasta",
        "2 tbsp butter",
        "2 tbsp flour",
        "2 cups milk",
        "1 cup mixed vegetables (bell peppers, corn, broccoli)",
        "½ cup grated cheese",
        "Salt",
        "Black pepper",
        "Chilli flakes"
    ],
    instructions:[
        "Cook pasta according to package instructions.",
        "Melt butter in a pan.",
        "Whisk in flour and gradually add milk.",
        "Add cheese, salt, pepper, and herbs.",
        "Mix in cooked vegetables and pasta.",
        "Serve hot."
    ],
    nutrition:[
        "Calories: 400",
        "Protein: 12g",
        "Carbohydrates: 50g",
        "Fat: 18g"
    ]
},

{
    id:3,
    title:"Veggie Wrap",
    author:"Maya Singh",
    time:"15 mins",
    image:"images/recipes/VeggieWrap.jpg",
    favourite:false,
    description:"A quick and healthy wrap filled with fresh vegetables.",
    servings:"2",
    ingredients:[
        "2 tortillas or chapatis",
        "1 cup shredded lettuce",
        "½ cup grated carrot",
        "½ cup sliced cucumber",
        "½ cup bell peppers",
        "2 tbsp hummus or mayonnaise",
        "Salt",
        "Black pepper"
    ],
    instructions:[
        "Place one tortilla on a flat surface.",
        "Spread hummus or mayonnaise on the tortilla.",
        "Add shredded lettuce, grated carrot, sliced cucumber, and bell peppers.",
        "Season with salt and black pepper.",
        "Fold the tortilla and cut in half."
    ],
    nutrition:[
        "Calories: 250",
        "Protein: 8g",
        "Carbohydrates: 35g",
        "Fat: 10g"
    ]
},

{
    id:4,
    title:"Chicken Curry",
    author:"Kabir Khan",
    time:"40 mins",
    image:"images/recipes/ChickenCurry.jpg",
    favourite:false,
    description:"A rich and flavorful chicken curry made with aromatic spices.",
    servings:"4",
    ingredients:[
        "500g chicken",
        "2 onions",
        "3 tomatoes",
        "Garlic",
        "Ginger",
        "Curry powder",
        "Salt",
        "Oil"
    ],
    instructions:[
        "Heat oil in a pan.",
        "Cook onions until golden.",
        "Add garlic, ginger and tomatoes.",
        "Mix in curry powder.",
        "Add chicken.",
        "Cook for 30 minutes.",
        "Serve hot with rice."
    ],
    nutrition:[
        "Calories: 350",
        "Protein: 30g",
        "Carbohydrates: 10g",
        "Fat: 20g"
    ]
},

{
    id:5,
    title:"Banana Pancakes",
    author:"Emma Collins",
    time:"20 mins",
    image:"images/recipes/BananaPancakes.jpg",
    favourite:false,
    description:"Soft, naturally sweet pancakes perfect for breakfast.",
    servings:"2",
    ingredients:[
        "2 ripe bananas",
        "½ cup flour",
        "2 eggs",
        "1 tsp baking powder",
        "1 tsp vanilla extract",
        "1 tbsp milk",
        "1 tsp sugar",
        "¼ tsp cinnamon (optional)",
        "Butter or oil",
        "Maple syrup or honey for serving"
    ],
    instructions:[
        "Mash the bananas in a bowl.",
        "In a separate bowl, mix the flour, baking powder, and sugar.",
        "Add the eggs, milk, and vanilla extract to the banana mixture.",
        "Gradually fold in the dry ingredients.",
        "Heat a non-stick pan and add a little butter or oil.",
        "Pour batter into the pan to form pancakes.",
        "Cook until golden brown on both sides.",
        "Serve with maple syrup or honey."
    ],
    nutrition:[
        "Calories: 350",
        "Protein: 8g",
        "Carbohydrates: 60g",
        "Fat: 10g"
    ]
},

{
    id:6,
    title:"Vegetable Fried Rice",
    author:"Ethan Wong",
    time:"20 mins",
    image:"images/recipes/FriedRice.jpg",
    favourite:false,
    description:"Flavorful rice stir-fried with colorful vegetables.",
    servings:"2",
    ingredients:[
        "2 cups cooked rice",
        "1 cup mixed vegetables",
        "2 tbsp oil",
        "2 cloves garlic, minced",
        "2 tbsp soy sauce",
        "Salt",
        "Black pepper",
        "1 tsp sesame oil (optional)",
        "Spring onions for garnish"
    ],
    instructions:[
        "Heat oil and sauté garlic.",
        "Add mixed vegetables and cook until tender.",
        "Stir in soy sauce, salt, and pepper.",
        "Add cooked rice and mix well.",
        "Garnish with spring onions and drizzle with sesame oil."
    ],
    nutrition:[
        "Calories: 300",
        "Protein: 6g",
        "Carbohydrates: 55g",
        "Fat: 8g"
    ]
},

{
    id:7,
    title:"Fresh Fruit Salad",
    author:"Sofia Martinez",
    time:"10 mins",
    image:"images/recipes/FruitSalad.jpg",
    favourite:false,
    description:"A refreshing mix of seasonal fruits, perfect for a healthy snack.",
    servings:"2",
    ingredients:[
        "1 cup apples, diced",
        "1 cup grapes, halved",
        "1 cup strawberries, hewed",
        "1 tbsp honey",
        "1 tbsp lemon juice"
    ],
    instructions:[
        "Dice the apples and halve the grapes and strawberries.",
        "In a large bowl, combine all the fruits.",
        "In a small bowl, whisk together the honey and lemon juice.",
        "Pour the dressing over the fruits and toss to coat.",
        "Chill for at least 30 minutes before serving."
    ],
    nutrition:[
        "Calories: 150",
        "Protein: 1g",
        "Carbohydrates: 35g",
        "Fat: 5g"
    ]
},

{
    id:8,
    title:"Stir-Fry Noodles",
    author:"Chen Wei",
    time:"25 mins",
    image:"images/recipes/Noodles.jpg",
    favourite:false,
    description:"A delicious and easy-to-make stir-fry with tender noodles and colorful vegetables.",
    servings:"2",
    ingredients:[
        "200g stir-fry noodles",
        "1 cup mixed vegetables",
        "2 tbsp oil",
        "2 cloves garlic, minced",
        "2 tbsp soy sauce",
        "1 tbsp oyster sauce",
        "Salt",
        "Black pepper",
        "Chilli flakes"
    ],
    instructions:[
        "Heat oil and sauté garlic.",
        "Add mixed vegetables and cook until tender.",
        "Stir in soy sauce, oyster sauce, salt, and pepper.",
        "Add stir-fry noodles and mix well.",
        "Garnish with chilli flakes."
    ],
    nutrition:[
        "Calories: 350",
        "Protein: 10g",
        "Carbohydrates: 50g",
        "Fat: 18g"
    ]
},

{
    id:9,
    title:"Chocolate Mug Cake",
    author:"Olivia Brown",
    time:"5 mins",
    image:"images/recipes/MugCake.jpg",
    favourite:false,
    description:"A quick and easy dessert that can be made in a microwave.",
    servings:"2",
    ingredients:[
        "4 tbsp flour",
        "2 tbsp cocoa powder",
        "2 tbsp sugar",
        "¼ tsp baking powder",
        "3 tbsp milk",
        "2 tbsp oil",
        "¼ tsp vanilla extract"
    ],
    instructions:[
        "Mix dry ingredients in a mug.",
        "Add milk, oil, and vanilla extract.",
        "Microwave for 1-2 minutes until set.",
        "Let cool for a few minutes before serving."
    ],
    nutrition:[
        "Calories: 300",
        "Protein: 5g",
        "Carbohydrates: 45g",
        "Fat: 12g"
    ]
},

{
    id:10,
    title:"Paneer Butter Masala",
    author:"Ananya Gupta",
    time:"35 mins",
    image:"images/recipes/PaneerCurry.jpg",
    favourite:false,
    description:"Creamy tomato-based curry with soft paneer cubes.",
    servings:"2",
    ingredients:[
        "200g paneer, cubed",
        "1 cup tomatoes, chopped",
        "1 cup cream",
        "2 tbsp butter",
        "1 tbsp ginger-garlic paste",
        "1 tsp cumin powder",
        "1 tsp coriander powder",
        "Salt",
        "Black pepper"
    ],
    instructions:[
        "Heat butter and sauté ginger-garlic paste.",
        "Add chopped tomatoes and cook until they soften.",
        "Stir in cumin and coriander powders.",
        "Add paneer cubes and cream.",
        "Simmer for 10-15 minutes until the curry thickens."
    ],
    nutrition:[
        "Calories: 350",
        "Protein: 25g",
        "Carbohydrates: 10g",
        "Fat: 20g"
    ]
},

{
    id:11,
    title:"Grilled Chicken Salad",
    author:"Noah Bennett",
    time:"25 mins",
    image:"images/recipes/Salad.jpg",
    favourite:false,
    description:"A protein-rich salad with grilled chicken and fresh vegetables.",
    servings:"2",
    ingredients:[
        "2 chicken breasts",
        "4 cups mixed salad greens",
        "1 tomato, sliced",
        "1 cucumber, sliced",
        "2 tbsp olive oil",
        "1 tbsp lemon juice",
        "Salt",
        "Black pepper"
    ],
    instructions:[
        "Season and grill chicken until fully cooked.",
        "Combine salad greens, tomatoes, cucumber, olive oil, and lemon juice in a large bowl.",
        "Toss to coat evenly.",
        "Season with salt and black pepper to taste."
    ],
    nutrition:[
        "Calories: 350",
        "Protein: 25g",
        "Carbohydrates: 10g",
        "Fat: 20g"
    ]
},

{
    id:12,
    title:"Vegetable Omelette",
    author:"Riya Patel",
    time:"25 mins",
    image:"images/recipes/Omlette.jpg",
    favourite:false,
    description:"A fluffy omelette filled with fresh vegetables.",
    servings:"1",
    ingredients:[
        "2 eggs",
        "¼ cup chopped onion",
        "¼ cup chopped tomato",
        "¼ cup chopped bell peppers",
        "1 tbsp oil or butter",
        "Salt",
        "Black pepper"
    ],
    instructions:[
        "Beat eggs with salt and pepper.",
        "Heat oil or butter in a pan.",
        "Pour in the egg mixture and cook until set.",
        "Fold the omelette in half and serve."
    ],
    nutrition:[
        "Calories: 150",
        "Protein: 12g",
        "Carbohydrates: 3g",
        "Fat: 10g"
    ]
}
];