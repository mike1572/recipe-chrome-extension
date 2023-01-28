
import { useEffect, useState } from 'react';


import {
    Typography
} from '@mui/material'

import { useLocation } from 'react-router-dom'

export default function Header() {

    let location= useLocation()
    const [url, setUrl] = useState< undefined | string>('');

    // async function getCurrentTab() {
    //     let queryOptions = { active: true, lastFocusedWindow: true };
    //     // `tab` will either be a `tabs.Tab` instance or `undefined`.
    //     let [tab] = await chrome.tabs.query(queryOptions);
    //     console.log(tab)
    //     return tab;
    // }
  
    useEffect(() => {
        // chrome.runtime.onMessage.addListener((request) => {
        //     setUrl(request.url);
        // });

        console.log(location.pathname)

        
    }, [location.pathname]);

    
    return (
        <Typography>
            {location.pathname}
        </Typography>
    )
}