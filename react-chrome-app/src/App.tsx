import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import logo from './logo.svg';

import {Typography, Divider} from '@mui/material'

import { BrowserRouter } from 'react-router-dom';

import Header from './components/Header';
import Basket from './components/Basket';

function App() {

  let [ingredients, setIngredients] = useState<string[]>([])
  let [deletedItem, setDeletedItem]= useState<string>("")
  let [loading, setLoading] = useState(false)
  let [showRecipe, setShowRecipe] = useState(false)

  let parseIngredients = (ingredients: string[]) => {
    let message = "Give me a recipe that uses ";
    for (let i = 0; i < ingredients.length; i++) {
      if (i === ingredients.length - 1) {
        message += "and " + ingredients[i] + " ";
      } else if (i === ingredients.length - 2) {
        message += ingredients[i] + " ";
      } else {
        message += ingredients[i] + ", ";
      }
    }
    message += "with 1) a fancy recipe title, and 2) explain the steps to create it";
    return message;
  }

  let handleGenerateRecipe = () => {

    setLoading(true)


    if (ingredients.length === 0 ){
      alert("Make sure the list is not empty")
      setLoading(false)
      return;
    }

    setTimeout(() => {

      setLoading(false)
      setShowRecipe(true)
      console.log(parseIngredients(ingredients))

    },2000)


  }

  useEffect(() => {

    const existingIngredients = JSON.parse(localStorage.getItem('ingredients')!) as string[];

    if (existingIngredients === null){
      setIngredients([])
    } else {
      setIngredients(existingIngredients)
    }

  }, [])

  return (
    <BrowserRouter>

      <Box sx={{backgroundColor: '#e94a82', py: 1, borderRadius: 5, m: 2, mt: 3}}>

        <Typography variant="h5" sx={{textTransform: 'uppercase', textAlign: 'center', color: 'white', fontWeight: 800}}>
          Rad Kitchen
        </Typography>
      
      </Box>

      {
        !showRecipe ? (
          <Box>

            <Typography variant="body2" sx={{ textAlign: 'center', color: 'white', fontWeight: 600, my: 3, mx: 2}}>
              Explore the Radish website to locate the specific ingredients you need to create your desired recipe. Select <i>generate recipe</i> when ready.
            </Typography>

            <Header ingredients={ingredients} setIngredients={setIngredients} deletedItem={deletedItem}/>

            <Divider sx={{borderBottom: 'solid 1px white', my: 3}}/>

            <Basket 
              ingredients={ingredients} 
              setIngredients={setIngredients} 
              setDeletedItem={setDeletedItem} 
              handleGenerateRecipe={handleGenerateRecipe}
              loading={loading}
            />

          </Box>

        ): (
          <h1>recipe</h1>
        )
      }

      
    </BrowserRouter>
  );
}

export default App;
