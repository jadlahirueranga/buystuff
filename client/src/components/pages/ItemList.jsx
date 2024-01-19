import React from "react";
import Item from "./Item";



function ItemList({filters})
{
  const [items, setItems] = useState([{}]);

  useEffect(() =>
  {
    fetch("/items/{filters.type}/{filters.max}/{filters.min}/{filters.sort}/{filters.page}").then(
      response => response.json()
    ).then(
      data =>
      {
        setItems(data);
      }
    );
  }, []);
    
    return (<div></div>);
}

export default ItemList;