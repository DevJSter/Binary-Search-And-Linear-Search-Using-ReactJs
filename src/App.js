import Navigation from "./UI/navigation";
import NodeContainer from "./UI/nodeContainer";
import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [reset, setReset] = useState(false);
  const [algorithmExplain, setAlgorithmExplain] = useState(false);
  const [found, setFound] = useState(false);
  const [array, setArray] = useState([]);
  const [resultArr, setResultArr] = useState([]);
  const [index, setIndex] = useState(null);
  const [condition, setCondition] = useState(null);
  const [userInput, setUserInput] = useState("");

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const parseUserInput = () => {
    const parsedArray = userInput
      .split(",")
      .map(Number)
      .filter((num) => !isNaN(num));
    setArray(parsedArray);
    document.querySelector(".node_container").classList.remove("hidden");
  };

  const binarySearch = (array, searchEle) => {
    let left = 0;
    let right = array.length - 1;
    const steps = [];

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midEle = array[mid];
      steps.push(midEle);

      if (midEle === searchEle) {
        return [true, mid, steps];
      } else if (searchEle < midEle) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return [false, null, steps];
  };

  const linearSearch = (array, searchEle) => {
    const steps = [];
    for (let i = 0; i < array.length; i++) {
      steps.push(array[i]);
      if (array[i] === searchEle) {
        return [true, i, steps];
      }
    }
    return [false, null, steps];
  };

  const handleReset = () => {
    setReset(true);
    setIndex(null);
    setCondition(null);
    setUserInput("");
    document.querySelector(".analysis_div").classList.add("hidden");
    window.location.reload();
  };

  const handleSearch = ([, searchType]) => {
    const arr = searchType === "binary" ? [...array].sort((a, b) => a - b) : array;
    const searchEle = arr[Math.floor(arr.length / 2)];
    const [isFound, idx, steps] =
      searchType === "linear"
        ? linearSearch(arr, searchEle)
        : binarySearch(arr, searchEle);

    setFound(isFound);
    setResultArr(steps);
    setIndex(idx);

    if (isFound) {
      let complexity;
      if (searchType === "linear") {
        complexity =
          idx === 0
            ? "Best Case O(1)"
            : idx < arr.length / 2
            ? "Average Case <= O(n/2)"
            : "Worst Case O(n)";
      } else {
        complexity =
          idx === Math.floor(arr.length / 2)
            ? "Best Case O(1)"
            : idx === 0 || idx === arr.length - 1
            ? "Worst Case O(log n)"
            : "Average Case < O(log n)";
      }
      setCondition(complexity);
    }

    document.querySelector(".analysis_div").classList.remove("hidden");
  };

  const highlightNodes = () => {
    if (!found) return;

    const lastElement = resultArr.pop();
    resultArr.forEach((element, i) => {
      setTimeout(() => {
        const node = document.querySelector(`.node[uid="${element}"]`);
        if (node) {
          node.style.backgroundColor = "#f06595";
          node.style.border = "1px solid #9c36b5";
        }
      }, 200 * i);
    });

    setTimeout(() => {
      const node = document.querySelector(`.node[uid="${lastElement}"]`);
      if (node) {
        node.style.backgroundColor = "#B0087F";
      }
    }, 200 * resultArr.length);
  };

  useEffect(highlightNodes, [found, resultArr]);

  useEffect(() => {
    document.querySelectorAll(".node").forEach((element) => {
      element.style.backgroundColor = "blueviolet";
    });
    if (reset) {
      setReset(false);
    }
  }, [reset]);

  return (
    <React.Fragment>
      <div className="analysis_div hidden">
        <div>Element found at index: {index}</div>
        <div>Time Complexity Analysis: {condition}</div>
      </div>
      <div className="container">
        <Navigation
          onReset={handleReset}
          onSearch={handleSearch}
          onUpdate={parseUserInput}
          onExplainAlgorithm={setAlgorithmExplain}
        />
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Enter comma-separated numbers"
        />
        <button onClick={parseUserInput}>Submit Array</button>
        <NodeContainer
          updatedArray={array.sort((a, b) => a - b)}
          state={true}
          isAlgorithmExplain={algorithmExplain}
        />
      </div>
    </React.Fragment>
  );
}

export default App;
