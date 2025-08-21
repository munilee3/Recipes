import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Recipes from './components/Recipes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/api/recipes" />} />
        <Route path="/api/recipes" element={<Recipes />} />

        <Route path="*" element={<Navigate to="/api/recipes" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
