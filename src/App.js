import Navigation from "./UI/navigation";
import NodeContainer from "./UI/nodeContainer";
import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

function App() {
  const [reset, setReset] = useState(false);
  const [algorithmExplain, setAlgorithmExplain] = useState(false);
  const [found, setFound] = useState(false);
  const [array, setArray] = useState([]);
  const [resultArr, setResultArr] = useState([]);
  const [index, setIndex] = useState(null);
  const [condition, setCondition] = useState(null);

  const generateArray = useCallback(() => {
    const temp = Array.from({ length: 40 }, () => Math.floor(Math.random() * 60) + 1);
    setArray([...new Set(temp)]);
    document.querySelector(".node_container").classList.remove("hidden");
  }, []);

  const binarySearch = useCallback((arr, searchEle) => {
    let left = 0, right = arr.length - 1;
    const steps = [];

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      steps.push(arr[mid]);

      if (arr[mid] === searchEle) return [true, mid, steps];
      arr[mid] < searchEle ? (left = mid + 1) : (right = mid - 1);
    }
    return [false, null, steps];
  }, []);

  const linearSearch = useCallback((arr, searchEle) => {
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      steps.push(arr[i]);
      if (arr[i] === searchEle) return [true, i, steps];
    }
    return [false, null, steps];
  }, []);

  const handleReset = useCallback(() => {
    setReset(true);
    setIndex(null);
    setCondition(null);
    document.querySelector(".analysis_div").classList.add("hidden");
    window.location.reload();
  }, []);

  const handleSearch = useCallback(
    ([, searchType]) => {
      const searchEle = searchType === "linear" ? array[19] : array[15];
      const [isFound, idx, steps] =
        searchType === "linear" ? linearSearch(array, searchEle) : binarySearch(array, searchEle);

      setFound(isFound);
      setResultArr(steps);
      setIndex(idx);

      if (isFound) {
        const halfLen = Math.floor(array.length / 2);
        const complexity =
          searchType === "linear"
            ? idx === 0
              ? "Best Case O(1)"
              : idx < halfLen
              ? "Average Case <= O(n/2)"
              : "Worst Case O(n)"
            : idx === halfLen
            ? "Best Case O(1)"
            : idx === 0 || idx === array.length - 1
            ? "Worst Case O(log n)"
            : "Average Case < O(log n)";

        setCondition(complexity);
      }

      document.querySelector(".analysis_div").classList.remove("hidden");
    },
    [array, binarySearch, linearSearch]
  );

  const highlightNodes = useCallback(() => {
    if (!found) return;

    resultArr.forEach((element, i) => {
      setTimeout(() => {
        const node = document.querySelector(`.node[uid="${element}"]`);
        if (node) {
          node.style.backgroundColor = "#f06595";
          node.style.border = "1px solid #9c36b5";
        }
      }, 200 * i);
    });

    const lastElement = resultArr[resultArr.length - 1];
    if (lastElement) {
      setTimeout(() => {
        const node = document.querySelector(`.node[uid="${lastElement}"]`);
        if (node) {
          node.style.backgroundColor = "#B0087F";
        }
      }, 200 * resultArr.length);
    }
  }, [found, resultArr]);

  useEffect(() => {
    highlightNodes();
  }, [highlightNodes]);

  useEffect(() => {
    if (reset) {
      document.querySelectorAll(".node").forEach((element) => {
        element.style.backgroundColor = "blueviolet";
      });
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
          onUpdate={generateArray}
          onExplainAlgorithm={setAlgorithmExplain}
        />
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