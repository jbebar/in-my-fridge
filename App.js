// Services

async function fetchRecipes() {
  const recipesUrl = location.hostname === "localhost" ? "http://localhost:3000/mock-recipes.json" : "https://www.macabine.bar/index.json";
  const d = await fetch(`${recipesUrl}`).then((r) => r.json());
  return d.map((r) => {
    return {
      name: r.title,
      ingredients: r.ingredients
    };
  });
}

// Components

function RecipeList(props) {
  const lines = props.names.map((n) => <RecipeItem key={n.name} name={n.name} ingredients={n.ingredients} />);
  const recipeTableStyle = {
    lineHeight: 2,
    width: "300px",
  };
  return (
    <div key="recipeList" style={recipeTableStyle}>
      {lines}
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
  return <div style={recipeStyle}>{props.name}</div>;
}

// Main component

function App() {
  const [matchingRecipes, setMatchingRecipes] = React.useState([]);
  const [allRecipes, setAllRecipes] = React.useState([]);
  const [knownIngredients, setKnownIngredients] = React.useState([]);

  React.useEffect(() => {
    const initState = async () => {
      const retrievedRecipes = await fetchRecipes();
      setKnownIngredients(retrievedRecipes.flatMap((r) => r.ingredients));
      setAllRecipes(retrievedRecipes);
      setMatchingRecipes(retrievedRecipes);
    };
    initState();
  }, [fetchRecipes, setKnownIngredients, setMatchingRecipes]);

  const onSearchChange = (evt) => {
    if (evt.target.value.length === 0) {
      setMatchingRecipes(allRecipes);
    }
    const searchIngredients = evt.target.value.split(" ").filter((i) => i.length > 0);
    if (searchIngredients.length > 0 && arrayIncludes(knownIngredients, searchIngredients)) {
      const matchingRecipes = allRecipes.filter((r) => arrayIncludes(r.ingredients, searchIngredients));
      setMatchingRecipes(matchingRecipes);
    }
  };

  const toRecipesNames = () => {
    return matchingRecipes.map((r) => {
      return { name: r.name, ingredients: r.ingredients };
    });
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
      <RecipeList names={toRecipesNames()} />
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
    if (!joinedContainer.includes(containedArray[i].toLowerCase())) {
      return false;
    }
  }
  return true;
}
