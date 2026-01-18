import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ToastProvider from './components/feedback/ToastProvider';

import Home from './pages/Home';
import LadderCreated from './pages/LadderCreated';
import LadderJoin from './pages/LadderJoin';
import Results from './pages/Results';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/created/:ladderId" element={<LadderCreated />} />
            <Route path="/join/:ladderId" element={<LadderJoin />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
