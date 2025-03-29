import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import LadderCreated from './pages/LadderCreated';
import LadderJoin from './pages/LadderJoin';
import Results from './pages/Results';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/created/:ladderId" element={<LadderCreated />} />
        <Route path="/:ladderId" element={<LadderJoin />} />
        <Route path="/results/:id" element={<Results />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
