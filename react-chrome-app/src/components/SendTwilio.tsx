
import { Button, Box, Typography, TextField, CircularProgress } from "@mui/material";
import { useState } from "react";

import { TWILIO_AUTH_TOKEN, TWILIO_SID, FROM_PHONE_NUMBER } from "../APIKeys";

export default function SendTwilio ({originalRecipe}: {originalRecipe: string}) {
   
    const phoneNumberRegex = /^[0-9]{10}$/;

    let [phone, setPhone] = useState<string>('');

    let [loading, setLoading] = useState<boolean>(false)

    let [showSendMessage, setShowSendMessage] = useState<boolean>(false)

    function isPhoneNumber(input: string): boolean {
        return phoneNumberRegex.test(input);
    }

    const sendMessage = (to: string, body: string) => {
        const accountSid = TWILIO_SID;
        const authToken = TWILIO_AUTH_TOKEN;
        const from = FROM_PHONE_NUMBER;
    
        const data = new FormData();
        data.append('To', to);
        data.append('From', from);
        data.append('Body', body);
    
        fetch('https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json', {
            method: 'post',
            body: data,
            headers: {
                'Authorization': 'Basic ' + btoa(accountSid + ':' + authToken),
            },
        }).then(response => {
            if (response.ok) {
                setShowSendMessage(true)
                setLoading(false)
            } else {
                console.log('Error sending text message: ' + response.status);
            }
        }).catch(error => {
            console.log('Error sending text message: ' + error);
        });
    };
    

    let handleSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
       
        setLoading(true)
        if (!isPhoneNumber(phone)){
            setPhone('')
            alert("Please enter a valid phone number")
            return;
        }

        // Assume number is Canadian
        // Adds +1
  
        console.log(`+1${phone}`)
        sendMessage(`+1${phone}`, originalRecipe);

    }


    return (

        !showSendMessage ? (
            <Box sx={{ mb: 7, color: 'white',display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            
                <Typography variant="body1">
                    Send as SMS to your phone
                </Typography>
                
                <Typography variant="body2">
                    Format: 1234567890
                </Typography>
    
                <form onSubmit={handleSend} style={{ color: 'white',display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <TextField 
                        value={phone}
                        type='tel' 
                        sx={{my: 2, input: { color: 'white' }, borderColor: 'white'}}
                        required
                        onChange={(e) => setPhone(e.target.value)}
    
                    />
                    <Button disabled={loading} sx={{textAlign: 'center', width: 100}} variant="contained" type="submit">
                        {
                            !loading ? (
                                'Send'
                            ): (
                                <CircularProgress size={25} sx={{color: 'white'}}/>
                            )
                        }
                    </Button>
                </form>
            </Box>
        ): (
            <Box sx={{ mb: 7, color: 'white',display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 5}}>
                <Typography sx={{my: 1}} variant="body1">
                    The recipe has been sent to you! Please note that there may be a delay of a few minutes.
                </Typography>
                <Typography sx={{my: 1}} variant="body1">
                    Have fun cooking!
                </Typography>
            </Box>
        )
        
        
    )
}