const heading = widget.shadowRoot.getElementById("heading");
const firstStateValueElement = widget.shadowRoot.getElementById("firstStateValue");
const secondStateValueElement = widget.shadowRoot.getElementById("secondStateValue");
const level = widget.props.level;

heading.textContent = widget.props.text;

// Use setup data if available
if (widget.constructor.data && widget.constructor.data.headingColor) {
  heading.style.color = widget.constructor.data.headingColor;
} else {
  heading.style.color = "#333";
}

// Use state data if available
if (widget.state && widget.state.stateValueWithDefault) {
  firstStateValueElement.textContent = widget.state.stateValueWithDefault;
}
if (widget.state && widget.state.stateValueEmpty) {
  secondStateValueElement.textContent = widget.state.stateValueEmpty;
} else {
  secondStateValueElement.textContent = "State value empty";
}

// Dynamically change heading level
const parent = heading.parentNode;
const newHeading = document.createElement("h" + level);
newHeading.id = "heading";
newHeading.textContent = heading.textContent;
newHeading.style.color = heading.style.color;

// replace dom elements
widget.shadowRoot.replaceChild(newHeading, heading);
widget.shadowRoot.replaceChild(firstStateValueElement, firstStateValueElement);
widget.shadowRoot.replaceChild(secondStateValueElement, secondStateValueElement);