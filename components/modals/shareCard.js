import React from 'react'
import Popup from 'reactjs-popup';
import supabase from "../../utils/supabaseClient"

//import styles from '../styles/card.module.css'
import 'reactjs-popup/dist/index.css';

const ShareModal = ({ open, setOpen, cardId }) => {
  const executeCloudFunction = async () => {
    try {
      const data = await fetch("https://nntsubixtqccokiqltlt.functions.supabase.co/generate-image", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${supabase.auth.session().access_token}`
        },
        body: JSON.stringify({
          id: cardId
        })
      })
        .then(resp => resp.json())
        .then(data => {
          return data
        })

      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  // Popup styling
  const contentStyle = { 
    width: "330px",
    background: 'rgba(255, 255,255, 1)', 
    border: 'none',
    borderRadius: '15px',
    padding: '20px 30px 20px 30px'
  };
  const overlayStyle = { 
    background: 'rgba(100,58,8,0.3)', 
    backdropFilter: 'blur(5px)'
  };

  return (
    <Popup 
      className="modal" 
      open={open} 
      closeOnDocumentClick closeOnEscape 
      onClose={() => setOpen(false)}
      overlayStyle={overlayStyle}
      contentStyle={contentStyle}
    >
      <button onClick={executeCloudFunction}>
        Execute function
      </button>
    </Popup>
  )
}

export default ShareModal 
