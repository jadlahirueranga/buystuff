import React, { useState } from "react";
import flowersData from "./flowersData";

function Quiz() 
//A quiz that helps to select flowers
{
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [occasion, setOccasion] = useState("");
  const [fragrance, setFragrance] = useState("");
  const [selectedFlowers, setSelectedFlowers] = useState(false);

  const handleResults = () => {
    const shuffleArray = (array) => {
      const shuffledArray = [...array];
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }
      return shuffledArray;
    };

    const matchingFlowers = flowersData.filter(
      (flower) =>
        flower.size === size &&
        flower.color === color &&
        flower.occasions.some((theoccasion) => theoccasion === occasion) &&
        (fragrance === "yes" ? flower.fragrance === fragrance : true)
    );

    const shuffledMatchingFlowers = shuffleArray(matchingFlowers);
    setSelectedFlowers(shuffledMatchingFlowers);
  };

  return (
    <div className="container mt-4">
      <h2>Flower Quiz</h2>
      <form>
        {/* Size */}
        <div>
          <p>What's the size of flowers you want?</p>
          <div className="form-check">
            <input
              type="radio"
              id="small"
              name="size"
              value="small"
              checked={size === "small"}
              onChange={() => setSize("small")}
              className="form-check-input"
            />
            <label htmlFor="small" className="form-check-label">
              Small
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              id="large"
              name="size"
              value="large"
              checked={size === "large"}
              onChange={() => setSize("large")}
              className="form-check-input"
            />
            <label htmlFor="large" className="form-check-label">
              Large
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              id="medium"
              name="size"
              value="medium"
              checked={size === "medium"}
              onChange={() => setSize("medium")}
              className="form-check-input"
            />
            <label htmlFor="medium" className="form-check-label">
              Medium
            </label>
          </div>
        </div>

        {/* Color */}
        <div>
          <p>What color do you prefer?</p>
          <div className="form-check">
            <input
              type="radio"
              id="dark"
              name="color"
              value="dark"
              checked={color === "dark"}
              onChange={() => setColor("dark")}
              className="form-check-input"
            />
            <label htmlFor="dark" className="form-check-label">
              Darker Colors
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              id="light"
              name="color"
              value="light"
              checked={color === "light"}
              onChange={() => setColor("light")}
              className="form-check-input"
            />
            <label htmlFor="light" className="form-check-label">
              Light Colors
            </label>
          </div>
        </div>

        {/* Occasion */}
        <div>
          <p>What's the occasion for the flowers?</p>
          <div className="form-check">
            <input
              type="radio"
              id="child-party"
              name="occasion"
              value="child party"
              checked={occasion === "child party"}
              onChange={() => setOccasion("child party")}
              className="form-check-input"
            />
            <label htmlFor="child-party" className="form-check-label">
              A Party for Children
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              id="regular-party"
              name="occasion"
              value="party"
              checked={occasion === "party"}
              onChange={() => setOccasion("party")}
              className="form-check-input"
            />
            <label htmlFor="regular-party" className="form-check-label">
              A Regular Party
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              id="formal-celebration"
              name="occasion"
              value="celebration"
              checked={occasion === "celebration"}
              onChange={() => setOccasion("celebration")}
              className="form-check-input"
            />
            <label htmlFor="formal-celebration" className="form-check-label">
              A Formal Celebration
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              id="religious-event"
              name="occasion"
              value="religious"
              checked={occasion === "religious"}
              onChange={() => setOccasion("religious")}
              className="form-check-input"
            />
            <label htmlFor="religious-event" className="form-check-label">
              A Religious Event
            </label>
          </div>
        </div>

        {/* Fragrance */}
        <div>
          <p>Do you prefer fragrant flowers?</p>
          <div className="form-check">
            <input
              type="radio"
              id="fragrance-yes"
              name="fragrance"
              value="yes"
              checked={fragrance === "yes"}
              onChange={() => setFragrance("yes")}
              className="form-check-input"
            />
            <label htmlFor="fragrance-yes" className="form-check-label">
              Yes
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              id="fragrance-no"
              name="fragrance"
              value="no"
              checked={fragrance === "no"}
              onChange={() => setFragrance("no")}
              className="form-check-input"
            />
            <label htmlFor="fragrance-no" className="form-check-label">
              No
            </label>
          </div>
        </div>

        {/* Button to show results */}
        <button type="button" onClick={handleResults} className="btn btn-primary mt-3">
          Show Results
        </button>

        {/* Display selected flowers if available */}
        {selectedFlowers.length > 0 && (
  <div className="mt-4">
    <h2 className="mb-3">Selected Flowers:</h2>
    <div className="row">
      {selectedFlowers.map((flower) => (
        <div key={flower.id} className="col-md-4 mb-4">
          <div className="card">
            <img className="card-img-top flower-img" src={flower.imageUrl} alt={flower.name} />
            <div className="card-body">
              <h5 className="card-title">{flower.name}</h5>
              <a href="/flowers" className="btn btn-primary">
                Learn More
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      </form>
    </div>
  );
}

export default Quiz;
