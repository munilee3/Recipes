import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Drawer, IconButton, Collapse, TablePagination, Rating,
  TextField, Button, MenuItem
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [expandTime, setExpandTime] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    title: "",
    cuisine: "",
    ratingOp: ">=",
    rating: "",
    caloriesOp: "<=",
    calories: ""
  });

  useEffect(() => {
    setLoading(true);
    const fetchReciepies = async () => {
      try {
        const res = await axios.get(`https://recipes-krdj.onrender.com/api/recipes?page=${page + 1}&limit=${limit}`)
        setRecipes(res.data.data);
        setTotal(res.data.total);
        setLoading(false);
      } catch {
        setLoading(false);
        setRecipes(res.status)
      }
    }

    fetchReciepies();
  }, [page, limit]);

  const handleSearch = async () => {
    let query = [];
    if (filters.title) query.push(`title=${filters.title}`);
    if (filters.cuisine) query.push(`cuisine=${filters.cuisine}`);
    if (filters.rating) query.push(`rating=${filters.ratingOp}${filters.rating}`);
    if (filters.calories) query.push(`calories=${filters.caloriesOp}${filters.calories}`);
    setLoading(true);
    const res = await axios.get(
      `https://recipes-krdj.onrender.com/api/recipes/search?${query.join("&")}&page=${page + 1}&limit=${limit}`
    );
    setRecipes(res.data.data);
    setTotal(res.data.data.length);
    setPage(0);
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
        <TextField
          label="Title"
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        />
        <TextField
          label="Cuisine"
          value={filters.cuisine}
          onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
        />

        <TextField
          select
          label="Rating Op"
          value={filters.ratingOp}
          onChange={(e) => setFilters({ ...filters, ratingOp: e.target.value })}
          style={{ width: "90px" }}
        >
          {["=", ">=", "<=", ">", "<"].map((op) => (
            <MenuItem key={op} value={op}>{op}</MenuItem>
          ))}
        </TextField>

        <TextField
          type="number"
          label="Rating"
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          style={{ width: "100px" }}
        />

        <TextField
          select
          label="Calories Op"
          value={filters.caloriesOp}
          onChange={(e) => setFilters({ ...filters, caloriesOp: e.target.value })}
          style={{ width: "90px" }}
        >
          {["=", ">=", "<=", ">", "<"].map((op) => (
            <MenuItem key={op} value={op}>{op}</MenuItem>
          ))}
        </TextField>

        <TextField
          type="number"
          label="Calories"
          value={filters.calories}
          onChange={(e) => setFilters({ ...filters, calories: e.target.value })}
          style={{ width: "100px" }}
        />

        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Cuisine</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Total Time</TableCell>
            <TableCell>Serves</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              recipes.map((r) => (
                <TableRow
                  key={r._id}
                  onClick={() => setSelectedRecipe(r)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.cuisine}</TableCell>
                  <TableCell>
                    <Rating value={r.rating || 0} readOnly precision={0.5} />
                  </TableCell>
                  <TableCell>{r.total_time} mins</TableCell>
                  <TableCell>{r.serves}</TableCell>
                </TableRow>
              ))
            )
          }
        </TableBody>
      </Table>
      {!loading && recipes.length === 0 && (
            <div style={{ fontSize: "32px", fontWeight: "bold", marginTop: "20px", display: "flex", justifyContent: "center"}}>
              <h1>No results found</h1>
            </div>
          )}
      <br />

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) => setLimit(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 15, 25, 50]}
      />



      <Drawer open={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} anchor="right">
        {selectedRecipe && (
          <div style={{ padding: "20px", width: "400px" }}>
            <h2>{selectedRecipe.title}</h2>
            <h4>{selectedRecipe.cuisine}</h4>
            <p><b>Description:</b> {selectedRecipe.description}</p>
            <div>
              <b>Total Time:</b> {selectedRecipe.total_time} mins
              <IconButton onClick={() => setExpandTime(!expandTime)}>
                <ExpandMoreIcon />
              </IconButton>
              <Collapse in={expandTime}>
                <p>Prep Time: {selectedRecipe.prep_time} mins</p>
                <p>Cook Time: {selectedRecipe.cook_time} mins</p>
              </Collapse>
            </div>
            <h4>Ingredients</h4>
            <ul>
              {selectedRecipe.ingredients?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <h4>Instructions</h4>
            <ol>
              {selectedRecipe.instructions?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <h4>Nutrition</h4>
            <Table size="small">
              <TableBody>
                {Object.entries(selectedRecipe.nutrients).map(([k, v]) => (
                  <TableRow key={k}>
                    <TableCell>{k}</TableCell>
                    <TableCell>{v}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export default Recipes;