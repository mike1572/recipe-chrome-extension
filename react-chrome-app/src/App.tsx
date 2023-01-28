import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import logo from './logo.svg';


import { BrowserRouter } from 'react-router-dom';

import Header from './components/Header';

function App() {

  return (
    <BrowserRouter>
  
      <Box sx={{backgroundColor: 'red'}}>
        <header>
          hikk
        </header>
      </Box>
      <Header/>
    </BrowserRouter>
  );
}

export default App;
