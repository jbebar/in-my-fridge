// Services

async function fetchRecipes() {
  const recipesUrl = location.hostname === "localhost" ? "http://localhost:3000/mock-recipes.json" : "https://www.macabine.bar/index.json";
  const d = await fetch(`${recipesUrl}`).then((r) => r.json());
  return d.map((r) => {
    return {
      name: r.title,
      ingredients: r.ingredients,
    };
  });
}

// Components

function Recipes(props) {
  return (
    <div
      key="recipeList"
      style={{
        lineHeight: 2,
        width: "300px",
      }}
    >
      {props.recipes.map((r) => (
        <RecipeItem key={r.name} name={r.name} ingredients={r.ingredients} matchingIngredients={props.matchingIngredients} />
      ))}
    </div>
  );
}

function RecipeItem(props) {
  const recipeStyle = {
    fontSize: 18,
    border: "2px solid",
    margin: "10px",
    fontFamily: "cursive",
    borderRadius: "5px",
    textAlign: "center",
  };
  const ingredientStyle = (ingredient) => {
    return {
      fontSize: 15,
      color: props.matchingIngredients.includes(ingredient) ? "LimeGreen" : "Grey",
      fontFamily: "cursive",
      textAlign: "center",
    };
  };
  return arrayIncludes(props.ingredients, props.matchingIngredients) ? (
    <div style={recipeStyle}>
      <div>{props.name}</div>
      <ul>
        {props.ingredients.map((i) => (
          <li key={i} style={ingredientStyle(i)}>
            {i}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}

// Main component

function App() {
  const [allRecipes, setAllRecipes] = React.useState([]);
  const [knownIngredients, setKnownIngredients] = React.useState([]);
  const [matchingIngredients, setMatchingIngredients] = React.useState([]);

  React.useEffect(() => {
    const initState = async () => {
      const retrievedRecipes = await fetchRecipes();
      setAllRecipes(
        retrievedRecipes.map((r) => {
          return { name: r.name, ingredients: r.ingredients.map((i) => i.toLowerCase()) };
        })
      );
    };
    initState();
  }, [fetchRecipes]);

  React.useEffect(() => {
    setKnownIngredients(allRecipes.flatMap((r) => r.ingredients));
  }, [allRecipes, setKnownIngredients]);

  const onSearchChange = (evt) => {
    const searchIngredients = evt.target.value
      .split(" ")
      .filter((i) => i.length > 0)
      .map((s) => s.toLowerCase());
    setMatchingIngredients(searchIngredients.map((s) => knownIngredients.find((k) => k.includes(s))));
  };

  const searchContainerStyle = {
    position: "absolute",
    top: "100px",
    left: "25%",
  };

  return (
    <div style={searchContainerStyle}>
      <label style={{ display: "block" }} htmlFor="ingredientsInput">
        In my fridge I have...
      </label>
      <input type="text" id="ingredientsInput" name="ingredientsInput" onChange={onSearchChange} />
      <Recipes recipes={allRecipes} matchingIngredients={matchingIngredients} />
    </div>
  );
}

const rootContainer = document.querySelector("#root");
ReactDOM.render(<App />, rootContainer);

// Arrays utilities

function arrayIncludes(containerArray, containedArray) {
  if (containerArray.length === 0) {
    return false;
  }
  const joinedContainer = containerArray.join().toLowerCase();
  for (let i = 0; i < containedArray.length; i++) {
    if (containedArray[i] !== undefined && !joinedContainer.includes(containedArray[i].toLowerCase())) {
      return false;
    }
  }
  return true;
}
