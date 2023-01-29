
import { useEffect, useState } from 'react';

import {
    Typography, FormGroup , FormControlLabel , Checkbox 
} from '@mui/material'

import { useLocation } from 'react-router-dom'

interface BasketProps {
    ingredients: string[],
    setIngredients: React.Dispatch<React.SetStateAction<string[]>>,
    deletedItem: string;
}

export default function Header ({ingredients, setIngredients, deletedItem}: BasketProps) {

    let location= useLocation()

    const [item, setItem] = useState('')

    const [checked, setChecked] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {


        if (event.target.checked){

            if (localStorage.getItem("ingredients") === null) {
                
                localStorage.setItem("ingredients", JSON.stringify([item]));
            
            } else {

                const existingIngredients = JSON.parse(localStorage.getItem('ingredients')!) as string[];
                existingIngredients.push(item)
                localStorage.setItem("ingredients", JSON.stringify(existingIngredients));
            }

            setIngredients(ingredients.concat(item))

        
        } 
        
        setChecked(event.target.checked);

    };

    function convertToTitleCase(str: string): string {
        return str.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }

    useEffect(() => {

        if (deletedItem === item){
            setChecked(false)
        }
    }, [deletedItem])
     
    useEffect(() => {

        var path = location.pathname.split( '/' );
        let thing = convertToTitleCase(path[path.length -1])
        setItem(thing);
        const existingIngredients = JSON.parse(localStorage.getItem('ingredients')!) as string[];
        let items = existingIngredients.filter(ingredient => ingredient === thing)
        if (items.length === 1) {
            setChecked(true)
        }
        
    }, [location.pathname]);

    
    return (
        <FormGroup sx={{display: 'flex', alignItems: 'center',justifyItems: 'center', m: 1, textAlign: 'center', color: 'white'}}>
            <FormControlLabel control={
                <Checkbox 
                    sx={{color: 'white', 
                    '&.Mui-disabled': {
                        color: 'lightgray',
                      },
                    }}
                    checked={checked}
                    onChange={handleChange}
                    disabled={checked}
                />
            } 
            label={
                <Typography 
                    sx={{
                        '&.Mui-disabled': {
                            color: 'lightgray',
                        },
                    }}
                >{item}</Typography> 
            }
            />
        </FormGroup>
    )
}