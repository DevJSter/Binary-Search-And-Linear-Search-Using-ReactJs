// Import the CSS styles from "node.css"
import "./node.css";

// Define the Node component that takes 'props' as an argument
export default function Node(props) {
  return (
    // Render a div element with the 'node' class
    // The 'uid' attribute is set to 'props.value' (assuming this should be 'key' instead of 'uid')
    // The inline style sets the height of the div based on 'props.value'
    <div className="node" key={props.value} style={{ height: `${props.value * 7 + 15}px` }}>
      {props.value}
    </div>
  );
}
