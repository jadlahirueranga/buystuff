import React from "react";

function Item({name, type, image, description}){
    
    return (<div>
    <p>{name}</p>
    <p>{type}</p>
    <p><img src={image} alt={name} /></p>
    <p>{description}</p>
    </div>)
}

export default Item;