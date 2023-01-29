
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

import {Typography, Divider} from '@mui/material'

import { BrowserRouter } from 'react-router-dom';

import Header from './components/Header';
import Basket from './components/Basket';
import { API_KEY_COHERE, API_KEY_DALLE } from './APIKeys';
import { ListItem, List, } from '@mui/material';
import { ListItemText } from '@mui/material';

interface RecipeObject {
  ingredients: string[],
  title: string,
  directions: string[]
}

function App() {

  let [ingredients, setIngredients] = useState<string[]>([])
  let [deletedItem, setDeletedItem]= useState<string>("")
  let [loading, setLoading] = useState(false)
  let [showRecipe, setShowRecipe] = useState(false)

  let [foodImage, setFoodImage] = useState<string>('')

  let [recipeData, setRecipeData] = useState<RecipeObject>({ingredients: [], title: '', directions: []});

  let cohereReq = async (prompt: string) => {

    const modelSettings = JSON.stringify({
      model: "command-xlarge-20221108",
      prompt,
      max_tokens: 512,
      temperature: 0.9,
      k: 0,
      p: 0.75
    });
    
    let response = await fetch("https://api.cohere.ai/generate", {
      method: "POST",
      mode: "cors",
      headers: {
      Authorization: `Bearer ${API_KEY_COHERE}`,
      "Content-Type": "application/json",
      "Cohere-Version": "2021-11-08",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
      "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With"
      },
      body: modelSettings,
      redirect: "follow"
    });

    const res = await response.json();
    
    return res;
  };

  let generateImage = async (prompt: string) => {
    const apiKey = API_KEY_DALLE;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'image-alpha-001',
        prompt: prompt,
        num_images: 1,
        size:'256x256'
      })
    });
  
    const res = await response.json();
    return res.data;
  }

  let parseRecipe = (recipe: string) => {
    const lines = recipe.split("\n");
    let title = "";
    let ingredients = [];
    let directions = [];
    let currentSection = null;
    for (const line of lines) {
      if (currentSection === null) {
        if (line !== ''){
          title = line;
          currentSection = "ingredients";
        }
        
      } else if (line === "Ingredients:") {
        currentSection = "ingredients";
      } else if (line === "Instructions:" || line === "Directions:") {
        currentSection = "directions";
      } else if (currentSection === "ingredients") {
        if (line !== ''){
          ingredients.push(line);
        }
        
      } else if (currentSection === "directions") {
        if (line !== ''){
          directions.push(line);
        }
      }
    }
    return { title, ingredients, directions };
  }

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

    cohereReq(parseIngredients(ingredients))
    .then((data) => {
  
      let recipe = parseRecipe(data.generations[0].text)
      setRecipeData(recipe as RecipeObject)

      generateImage(recipe.title)
      .then((res) => {

        setFoodImage(res[0].url)
        setShowRecipe(true)        
        setLoading(false)

      })
      .catch((err) => console.log(err))
    })
    .catch((err) => {
      console.log(err)
    })

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
          <Box sx={{textAlign: 'center'}}>

            <Typography variant='h6' sx={{my: 3, color: 'white', fontWeight: 700}}>
              Suggested Recipe
            </Typography>

            <Box sx={{overflowY: 'auto', height: '80vh' }}>
          
            <img style={{borderRadius: 15}} 
              src={foodImage}
            />

              <Typography variant="h6" sx={{fontWeight: 700,color: 'white', textAlign: 'center', mt: 2}}>
                Ingredients
              </Typography>

              <List>
                {recipeData?.ingredients.map((element , i) => (
                  <ListItem key={i} sx={{p: 0}}>
                    <ListItemText primary={
                      <Typography sx={{color: 'white', textAlign: 'justify', mx: 2}}>
                        {element} 
                      </Typography>
                    }/>
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{borderBottom: 'solid 1px white', my: 2}}/>
              
              <Typography variant="h6" sx={{fontWeight: 700,color: 'white', textAlign: 'center'}}>
                Directions
              </Typography>

              <List sx={{mb: 3}}>
                {recipeData?.directions.map((element , i) => (
                  <ListItem key={i} sx={{p: 0}}>
                    <ListItemText primary={
                      <Typography sx={{color: 'white', textAlign: 'justify', mx: 2}}>
                        {element} 
                      </Typography>
                    }/>
                  </ListItem>
                ))}
              </List>

            </Box>
          </Box>
        )
      }

    </BrowserRouter>
  );
}

export default App;
