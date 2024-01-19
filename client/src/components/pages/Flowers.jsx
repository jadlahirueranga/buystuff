import React, { useState } from "react";
import flowersData from "./flowersData";
import "bootstrap/dist/css/bootstrap.min.css"; 

function Flowers() {
  //page about flowers
  const [expandedFlowerId, setExpandedFlowerId] = useState(null);

  const handleToggleDescription = (flowerId) => {
    setExpandedFlowerId((prevId) => (prevId === flowerId ? null : flowerId));
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {flowersData.map((flower) => (
          <div key={flower.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                className="card-img-top flower"
                src={flower.imageUrl}
                alt={flower.name}
              />
              <div className="card-body">
                <h5 className="card-title">{flower.name}</h5>
                {expandedFlowerId === flower.id && (
                  <p className="card-text">{flower.description}</p>
                )}
                <button
                  className="btn btn-primary"
                  onClick={() => handleToggleDescription(flower.id)}
                >
                  {expandedFlowerId === flower.id ? "Show Less" : "Show More"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Flowers;
