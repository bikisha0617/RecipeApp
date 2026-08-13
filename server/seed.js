const db = require("./database");
const recipes = [
    {
        title: "Avocado Toast with Egg",
        author: "Aarav Sharma",
        time: "10 mins",
        image: "images/recipes/AvocadoBread.jpg",
        description: "A healthy and filling breakfast with creamy avocado, crispy toast, and a perfectly cooked egg.",
        servings: "2",
        difficulty: "Easy",
        ingredients: [
            "2 slices bread",
            "1 ripe avocado",
            "2 eggs",
            "Salt",
            "Black pepper",
            "Chilli flakes"
        ],
        instructions: [
            "Toast the bread until golden brown.",
            "Mash the avocado with salt and pepper.",
            "Cook the eggs to your preference.",
            "Spread avocado on the toast.",
            "Top with eggs and chilli flakes."
        ]
    },
    {
        title: "White Sauce Pasta",
        author: "Sophia Rossi",
        time: "30 mins",
        image: "images/recipes/pasta.jpg",
        description: "A creamy pasta with vegetables in a rich white sauce.",
        servings: "2",
        difficulty: "Medium",
        ingredients: [
            "200 g pasta",
            "2 tbsp butter",
            "2 tbsp flour",
            "2 cups milk",
            "1 cup mixed vegetables",
            "½ cup grated cheese",
            "Salt",
            "Black pepper",
            "Chilli flakes"
        ],
        instructions: [
            "Cook pasta according to package instructions.",
            "Melt butter in a pan.",
            "Whisk in flour and gradually add milk.",
            "Add cheese, salt, pepper, and herbs.",
            "Mix in cooked vegetables and pasta.",
            "Serve hot."
        ]
    },
    {
        title: "Veggie Wrap",
        author: "Maya Singh",
        time: "15 mins",
        image: "images/recipes/VeggieWrap.jpg",
        description: "A quick and healthy wrap filled with fresh vegetables.",
        servings: "2",
        difficulty: "Easy",
        ingredients: [
            "2 tortillas or chapatis",
            "1 cup shredded lettuce",
            "½ cup grated carrot",
            "½ cup sliced cucumber",
            "½ cup bell peppers",
            "2 tbsp hummus or mayonnaise",
            "Salt",
            "Black pepper"
        ],
        instructions: [
            "Place one tortilla on a flat surface.",
            "Spread hummus or mayonnaise on the tortilla.",
            "Add shredded lettuce, grated carrot, sliced cucumber, and bell peppers.",
            "Season with salt and black pepper.",
            "Fold the tortilla and cut in half."
        ]
    },
    {
        title: "Chicken Curry",
        author: "Kabir Khan",
        time: "40 mins",
        image: "images/recipes/ChickenCurry.jpg",
        description: "A rich and flavorful chicken curry made with aromatic spices.",
        servings: "4",
        difficulty: "Hard",
        ingredients: [
            "500g chicken",
            "2 onions",
            "3 tomatoes",
            "Garlic",
            "Ginger",
            "Curry powder",
            "Salt",
            "Oil"
        ],
        instructions: [
            "Heat oil in a pan.",
            "Cook onions until golden.",
            "Add garlic, ginger and tomatoes.",
            "Mix in curry powder.",
            "Add chicken.",
            "Cook for 30 minutes.",
            "Serve hot with rice."
        ]
    },
    {
        title: "Banana Pancakes",
        author: "Emma Collins",
        time: "20 mins",
        image: "images/recipes/BananaPancakes.jpg",
        description: "Soft, naturally sweet pancakes perfect for breakfast.",
        servings: "2",
        difficulty: "Easy",
        ingredients: [
            "2 ripe bananas",
            "½ cup flour",
            "2 eggs",
            "1 tsp baking powder",
            "1 tsp vanilla extract",
            "1 tbsp milk",
            "1 tsp sugar",
            "¼ tsp cinnamon",
            "Butter or oil",
            "Maple syrup or honey for serving"
        ],
        instructions: [
            "Mash the bananas in a bowl.",
            "In a separate bowl, mix the flour, baking powder, and sugar.",
            "Add the eggs, milk, and vanilla extract to the banana mixture.",
            "Gradually fold in the dry ingredients.",
            "Heat a non-stick pan and add a little butter or oil.",
            "Pour batter into the pan to form pancakes.",
            "Cook until golden brown on both sides.",
            "Serve with maple syrup or honey."
        ]
    },
    {
        title: "Vegetable Fried Rice",
        author: "Ethan Wong",
        time: "20 mins",
        image: "images/recipes/FriedRice.jpg",
        description: "Flavorful rice stir-fried with colorful vegetables.",
        servings: "2",
        difficulty: "Medium",
        ingredients: [
            "2 cups cooked rice",
            "1 cup mixed vegetables",
            "2 tbsp oil",
            "2 cloves garlic, minced",
            "2 tbsp soy sauce",
            "Salt",
            "Black pepper",
            "1 tsp sesame oil",
            "Spring onions for garnish"
        ],
        instructions: [
            "Heat oil and sauté garlic.",
            "Add mixed vegetables and cook until tender.",
            "Stir in soy sauce, salt, and pepper.",
            "Add cooked rice and mix well.",
            "Garnish with spring onions and drizzle with sesame oil."
        ]
    },
    {
        title: "Fresh Fruit Salad",
        author: "Sofia Martinez",
        time: "10 mins",
        image: "images/recipes/FruitSalad.jpg",
        description: "A refreshing mix of seasonal fruits, perfect for a healthy snack.",
        servings: "2",
        difficulty: "Easy",
        ingredients: [
            "1 cup apples, diced",
            "1 cup grapes, halved",
            "1 cup strawberries, chopped",
            "1 tbsp honey",
            "1 tbsp lemon juice"
        ],
        instructions: [
            "Dice the apples and halve the grapes and strawberries.",
            "In a large bowl, combine all the fruits.",
            "In a small bowl, whisk together the honey and lemon juice.",
            "Pour the dressing over the fruits and toss to coat.",
            "Chill for at least 30 minutes before serving."
        ]
    },
    {
        title: "Stir-Fry Noodles",
        author: "Chen Wei",
        time: "25 mins",
        image: "images/recipes/Noodles.jpg",
        description: "A delicious and easy-to-make stir-fry with tender noodles and colorful vegetables.",
        servings: "2",
        difficulty: "Medium",
        ingredients: [
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
        instructions: [
            "Heat oil and sauté garlic.",
            "Add mixed vegetables and cook until tender.",
            "Stir in soy sauce, oyster sauce, salt, and pepper.",
            "Add stir-fry noodles and mix well.",
            "Garnish with chilli flakes."
        ]
    },
    {
        title: "Chocolate Mug Cake",
        author: "Olivia Brown",
        time: "5 mins",
        image: "images/recipes/MugCake.jpg",
        description: "A quick and easy dessert that can be made in a microwave.",
        servings: "2",
        difficulty: "Easy",
        ingredients: [
            "4 tbsp flour",
            "2 tbsp cocoa powder",
            "2 tbsp sugar",
            "¼ tsp baking powder",
            "3 tbsp milk",
            "2 tbsp oil",
            "¼ tsp vanilla extract"
        ],
        instructions: [
            "Mix dry ingredients in a mug.",
            "Add milk, oil, and vanilla extract.",
            "Microwave for 1-2 minutes until set.",
            "Let cool for a few minutes before serving."
        ]
    },
    {
        title: "Paneer Butter Masala",
        author: "Ananya Gupta",
        time: "35 mins",
        image: "images/recipes/PaneerCurry.jpg",
        description: "Creamy tomato-based curry with soft paneer cubes.",
        servings: "2",
        difficulty: "Hard",
        ingredients: [
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
        instructions: [
            "Heat butter and sauté ginger-garlic paste.",
            "Add chopped tomatoes and cook until they soften.",
            "Stir in cumin and coriander powders.",
            "Add paneer cubes and cream.",
            "Simmer for 10-15 minutes until the curry thickens."
        ]
    },
    {
        title: "Grilled Chicken Salad",
        author: "Noah Bennett",
        time: "25 mins",
        image: "images/recipes/Salad.jpg",
        description: "A protein-rich salad with grilled chicken and fresh vegetables.",
        servings: "2",
        difficulty: "Medium",
        ingredients: [
            "2 chicken breasts",
            "4 cups mixed salad greens",
            "1 tomato, sliced",
            "1 cucumber, sliced",
            "2 tbsp olive oil",
            "1 tbsp lemon juice",
            "Salt",
            "Black pepper"
        ],
        instructions: [
            "Season and grill chicken until fully cooked.",
            "Combine salad greens, tomatoes, cucumber, olive oil, and lemon juice in a large bowl.",
            "Toss to coat evenly.",
            "Season with salt and black pepper to taste."
        ]
    },
    {
        title: "Vegetable Omelette",
        author: "Riya Patel",
        time: "25 mins",
        image: "images/recipes/Omlette.jpg",
        description: "A fluffy omelette filled with fresh vegetables.",
        servings: "1",
        difficulty: "Easy",
        ingredients: [
            "2 eggs",
            "¼ cup chopped onion",
            "¼ cup chopped tomato",
            "¼ cup chopped bell peppers",
            "1 tbsp oil or butter",
            "Salt",
            "Black pepper"
        ],
        instructions: [
            "Beat eggs with salt and pepper.",
            "Heat oil or butter in a pan.",
            "Pour in the egg mixture and cook until set.",
            "Fold the omelette in half and serve."
        ]
    }
];

// Create a temporary user for default recipes
db.run(
    `
    INSERT OR IGNORE INTO users
    (id, name, email, password)
    VALUES (1, 'Recipe App', 'default@recipeapp.com', '')
    `,
    function (err) {
        if (err) {
            console.error("Could not create default user:", err.message);
            return;
        }
        recipes.forEach((recipe, index) => {
            const recipeId = index + 1;
            db.run(
                `
                INSERT OR IGNORE INTO recipes
                (
                    id,
                    user_id,
                    title,
                    description,
                    category,
                    time,
                    servings,
                    difficulty,
                    image
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    recipeId,
                    1,
                    recipe.title,
                    recipe.description,
                    "",
                    recipe.time,
                    recipe.servings,
                    recipe.difficulty,
                    recipe.image
                ]
            );
            recipe.ingredients.forEach(ingredient => {
                db.run(
                    `
                    INSERT OR IGNORE INTO ingredients
                    (recipe_id, ingredient)
                    VALUES (?, ?)
                    `,
                    [recipeId, ingredient]
                );
            });
            recipe.instructions.forEach(instruction => {
                db.run(
                    `
                    INSERT OR IGNORE INTO instructions
                    (recipe_id, instruction)
                    VALUES (?, ?)
                    `,
                    [recipeId, instruction]
                );
            });
        });
        console.log("Default recipes added.");
    }
);