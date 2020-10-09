async function fetchRecipes() {
  const recipesHost = location.hostname === "localhost" ? "http://localhost:3000" : "https://jbebar.github.io/in-my-fridge";
  return await fetch(`${recipesHost}/recipes.json`)
    .then((r) => r.json())
    .then((d) => d.map((e) => e.name));
}

function RecipeList(props) {
  const lines = props.names.map((n) => <RecipeItem id={n} name={n} />);
  const recipeTableStyle = {
    lineHeight: 2,
    width: "300px",
    position: "absolute",
    top: "100px",
    left: "25%",
  };
  return <div style={recipeTableStyle}> {lines} </div>;
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
  return (
    <div id={props.name} style={recipeStyle}>
      {props.name}
    </div>
  );
}

function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useEffect(() => {
    const initRecipes = async () => {
      setRecipes(await fetchRecipes());
    };
    initRecipes();
  }, [fetchRecipes, setRecipes]);
  return <RecipeList names={recipes} />;
}

const rootContainer = document.querySelector("#root");
ReactDOM.render(<App />, rootContainer);
