import React, { useEffect, useState } from "react";


function Logout()
{
    const [auth, setAuth] = useState({});

    useEffect(() => {
        const logingOut = async () => {
          try {
            const response = await fetch('/logout', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                }
                
              });
            if (response.ok) {
              const data = await response.json();
              setAuth(data);
            }
          } catch (error) {
            console.error("Error loging out", error);
          }
        };
    
        logingOut();
      }, []);
      
      return (
      <div>Logging out...{(typeof auth !=='undefined') ? <>auth.username</>:<></>}</div>);
    
}

export default Logout;
