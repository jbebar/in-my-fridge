// Services

async function fetchRecipes() {
  const recipesHost = location.hostname === "localhost" ? "http://localhost:3000" : "https://jbebar.github.io/in-my-fridge";
  const d = await fetch(`${recipesHost}/recipes.json`).then((r) => r.json());
  return d.map((r) => {
    return {
      name: r.name,
      ingredients: r.ingredients,
    };
  });
}

// Components

function RecipeList(props) {
  const lines = props.names.map((n) => <RecipeItem key={n} name={n} />);
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
  const [recipes, setRecipes] = React.useState([]);
  const [knownIngredients, setKnwonIngredients] = React.useState([]);
  const [resetSearch, setResetSearch] = React.useState(false);
  const initRecipes = async () => {
    setRecipes(await fetchRecipes());
  };
  const initKnownIngredients = async () => {
    const recipes = await fetchRecipes();
    const allIngredients = recipes.map((r) => r.ingredients);
    setKnwonIngredients(allIngredients);
  };

  React.useEffect(() => {
    initRecipes();
    initKnownIngredients();
  }, [fetchRecipes, initKnownIngredients]);

  const onSearchChange = (evt) => {
    if (evt.target.value.length === 0) {
      setResetSearch(true);
    }
    const searchIngredients = evt.target.value.split(" ").filter((i) => i.length > 0);
    if (searchIngredients.length > 0) {
      console.log(searchIngredients);
      const matchingRecipes = recipes.filter((r) => arrayIncludes(r.ingredients, searchIngredients));
      setRecipes(matchingRecipes);
    }
  };

  React.useEffect(() => {
    if (resetSearch) {
      initRecipes();
      setResetSearch(false);
    }
  }, [resetSearch, setResetSearch, initRecipes]);

  const toRecipesNames = () => {
    return recipes.map((r) => r.name);
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
  for (let i = 0; i < containedArray.length; i++) {
    if (!containerArray.includes(containedArray[i])) {
      return false;
    }
  }
  return true;
}
