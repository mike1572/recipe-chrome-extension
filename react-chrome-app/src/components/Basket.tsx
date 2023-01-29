

import {
    Typography,
    Box,
    List, 
    ListItem,
    ListItemText,
    IconButton,
    Button
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete.js';
import { CircularProgress } from '@mui/material';

interface BasketProps {
    ingredients: string[],
    setIngredients: React.Dispatch<React.SetStateAction<string[]>>,
    setDeletedItem: React.Dispatch<React.SetStateAction<string>>,
    handleGenerateRecipe: () => void,
    loading: boolean
}

export default function Basket ({ingredients, setIngredients, setDeletedItem, handleGenerateRecipe, loading}: BasketProps) {


    const handleDelete = (ingredient: string) => {

        console.log(ingredient)
        setDeletedItem(ingredient)
        const existingIngredients = JSON.parse(localStorage.getItem('ingredients')!) as string[];
        let items = existingIngredients.filter(item => item !== ingredient)
        localStorage.setItem("ingredients", JSON.stringify(items));
        setIngredients(ingredients.filter(item => item !== ingredient))
    }

    return (

        <Box sx={{textAlign: 'center'}}>
            
            <Typography sx={{textTransform: 'uppercase', textAlign: 'center', color: 'white', fontWeight: 800}}>
                Ingredient List
            </Typography>

            <List>

                {
                    ingredients.map((ingredient,i) => (
                        <ListItem
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(ingredient)}>
                                    <DeleteIcon sx={{color: 'white'}} />
                                </IconButton>
                            }
                            >
                            <ListItemText
                                sx={{color: 'white', textAlign: 'center'}}
                                primary={ingredient}
                            />
                        </ListItem>
                    ))
                }
            </List>


            <Button disabled={loading} sx={{textAlign: 'center', width: 200}} variant="contained" onClick={() => handleGenerateRecipe()}>

                {
                    !loading ? (
                        'Generate Recipe'
                    ): (
                        <CircularProgress size={25} sx={{color: 'white'}}/>
                    )
                }

            
            </Button>
        </Box>

   
    )
}