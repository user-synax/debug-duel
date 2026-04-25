require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const Challenge = require("../models/Challenge");

const challenges = [
  // HTML Challenges (7)
  {
    title: "Missing Form Label",
    category: "html",
    difficulty: "easy",
    description: "The input field has no associated label, causing an accessibility failure. Users with screen readers won't know what this field is for.",
    starterCode: `<form>
  <input type="text" name="username" placeholder="Enter username">
  <button type="submit">Submit</button>
</form>`,
    solutionCode: `<form>
  <label for="username">Username</label>
  <input type="text" id="username" name="username" placeholder="Enter username">
  <button type="submit">Submit</button>
</form>`,
    validationTests: [
      {
        description: "Input should have an associated label",
        testFn: `return document.querySelector('label') !== null && document.querySelector('label').getAttribute('for') === document.querySelector('input').id;`,
      },
      {
        description: "Label should be visible",
        testFn: `return document.querySelector('label').textContent.trim().length > 0;`,
      },
    ],
    hints: [
      "Use the label element with a for attribute that matches the input's id",
      "The label should come before the input in the DOM order",
    ],
    tags: ["accessibility", "forms", "labels"],
    isActive: true,
  },
  {
    title: "Broken Table Structure",
    category: "html",
    difficulty: "medium",
    description: "A td element is placed outside of a tr, which breaks the table rendering and causes invalid HTML.",
    starterCode: `<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
  </tr>
  <td>John</td>
  <td>25</td>
</table>`,
    solutionCode: `<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
  </tr>
  <tr>
    <td>John</td>
    <td>25</td>
  </tr>
</table>`,
    validationTests: [
      {
        description: "All td elements should be inside tr elements",
        testFn: `const tds = document.querySelectorAll('td'); let allValid = true; tds.forEach(td => { if (td.parentElement.tagName !== 'TR') allValid = false; }); return allValid;`,
      },
      {
        description: "Table should have proper structure",
        testFn: `return document.querySelector('table').children.length === 2;`,
      },
    ],
    hints: [
      "Table cells (td) must always be wrapped in table rows (tr)",
      "Check the nesting of your table elements",
    ],
    tags: ["tables", "html-structure", "validation"],
    isActive: true,
  },
  {
    title: "Self-Closing Tag Error",
    category: "html",
    difficulty: "easy",
    description: "A div element is incorrectly self-closed, which causes all content after it to not render properly.",
    starterCode: `<div class="container" />
  <p>This content won't show up</p>
  <p>Neither will this</p>`,
    solutionCode: `<div class="container">
  <p>This content will show up</p>
  <p>And this too</p>
</div>`,
    validationTests: [
      {
        description: "Div should not be self-closed",
        testFn: `return document.querySelector('.container').innerHTML.trim().length > 0;`,
      },
      {
        description: "All paragraphs should be visible",
        testFn: `return document.querySelectorAll('p').length === 2;`,
      },
    ],
    hints: [
      "Div elements are not self-closing in HTML5",
      "Use opening and closing tags for container elements",
    ],
    tags: ["html5", "tags", "rendering"],
    isActive: true,
  },
  {
    title: "Wrong Input Type",
    category: "html",
    difficulty: "easy",
    description: "An email input field has type='text', so browser validation for email format doesn't work.",
    starterCode: `<form>
  <label for="email">Email</label>
  <input type="text" id="email" name="email" placeholder="your@email.com">
  <button type="submit">Submit</button>
</form>`,
    solutionCode: `<form>
  <label for="email">Email</label>
  <input type="email" id="email" name="email" placeholder="your@email.com">
  <button type="submit">Submit</button>
</form>`,
    validationTests: [
      {
        description: "Email input should have type='email'",
        testFn: `return document.querySelector('#email').type === 'email';`,
      },
      {
        description: "Input should validate email format",
        testFn: `const input = document.querySelector('#email'); input.value = 'invalid-email'; return !input.checkValidity();`,
      },
    ],
    hints: [
      "Use type='email' for email fields to enable browser validation",
      "Other useful types: tel, url, number, date",
    ],
    tags: ["forms", "validation", "input-types"],
    isActive: true,
  },
  {
    title: "Missing Alt Text",
    category: "html",
    difficulty: "easy",
    description: "An image element is missing the alt attribute, which is required for accessibility and SEO.",
    starterCode: `<div class="profile">
  <img src="profile.jpg" width="100" height="100">
  <h2>John Doe</h2>
</div>`,
    solutionCode: `<div class="profile">
  <img src="profile.jpg" width="100" height="100" alt="Profile photo of John Doe">
  <h2>John Doe</h2>
</div>`,
    validationTests: [
      {
        description: "Image should have alt attribute",
        testFn: `return document.querySelector('img').hasAttribute('alt');`,
      },
      {
        description: "Alt text should not be empty",
        testFn: `return document.querySelector('img').alt.length > 0;`,
      },
    ],
    hints: [
      "Always provide alt text for images",
      "Use empty alt='' for decorative images",
    ],
    tags: ["accessibility", "images", "seo"],
    isActive: true,
  },
  {
    title: "Form Action Missing",
    category: "html",
    difficulty: "medium",
    description: "A form has no action or method attribute, so when submitted it goes nowhere or uses the wrong defaults.",
    starterCode: `<form>
  <label for="search">Search</label>
  <input type="text" id="search" name="q">
  <button type="submit">Search</button>
</form>`,
    solutionCode: `<form action="/search" method="GET">
  <label for="search">Search</label>
  <input type="text" id="search" name="q">
  <button type="submit">Search</button>
</form>`,
    validationTests: [
      {
        description: "Form should have action attribute",
        testFn: `return document.querySelector('form').hasAttribute('action');`,
      },
      {
        description: "Form should have method attribute",
        testFn: `return document.querySelector('form').hasAttribute('method');`,
      },
    ],
    hints: [
      "Add action to specify where the form submits",
      "Add method to specify GET or POST",
    ],
    tags: ["forms", "submission", "attributes"],
    isActive: true,
  },
  {
    title: "Unclosed Element",
    category: "html",
    difficulty: "easy",
    description: "A strong tag is not properly closed, which breaks the layout of all content that follows it.",
    starterCode: `<div class="content">
  <p>This is <strong>important text</p>
  <p>This paragraph is now bold too</p>
  <p>And this one</p>
</div>`,
    solutionCode: `<div class="content">
  <p>This is <strong>important text</strong></p>
  <p>This paragraph is normal</p>
  <p>And this one too</p>
</div>`,
    validationTests: [
      {
        description: "Strong tag should be properly closed",
        testFn: `return document.querySelector('strong').nextElementSibling.tagName === 'P';`,
      },
      {
        description: "Second paragraph should not be bold",
        testFn: `return document.querySelectorAll('p')[1].querySelector('strong') === null;`,
      },
    ],
    hints: [
      "Always close your inline tags like strong, em, a",
      "Check that every opening tag has a matching closing tag",
    ],
    tags: ["html-structure", "tags", "nesting"],
    isActive: true,
  },
  // CSS Challenges (8)
  {
    title: "Flexbox Centering Fail",
    category: "css",
    difficulty: "medium",
    description: "Flexbox items are not centered because flex-direction is not set properly. The items are stuck at the top.",
    starterCode: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.item {
  padding: 20px;
  background: #333;
}`,
    solutionCode: `.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.item {
  padding: 20px;
  background: #333;
}`,
    validationTests: [
      {
        description: "Container should have flex-direction column",
        testFn: `return getComputedStyle(document.querySelector('.container')).flexDirection === 'column';`,
      },
      {
        description: "Items should be vertically centered",
        testFn: `const container = document.querySelector('.container'); const item = document.querySelector('.item'); const containerRect = container.getBoundingClientRect(); const itemRect = item.getBoundingClientRect(); return Math.abs((containerRect.top + containerRect.height/2) - (itemRect.top + itemRect.height/2)) < 5;`,
      },
    ],
    hints: [
      "Add flex-direction: column when centering vertically stacked items",
      "Or use flex-direction: row for horizontal layouts",
    ],
    tags: ["flexbox", "centering", "layout"],
    isActive: true,
  },
  {
    title: "Z-index Not Working",
    category: "css",
    difficulty: "medium",
    description: "Z-index is set on an element but it's not working because the element doesn't have a positioned ancestor.",
    starterCode: `.parent {
  background: red;
  height: 100px;
}

.child {
  z-index: 10;
  background: blue;
  height: 50px;
  position: relative;
}

.sibling {
  z-index: 5;
  background: green;
  height: 50px;
  position: relative;
}`,
    solutionCode: `.parent {
  background: red;
  height: 100px;
  position: relative;
}

.child {
  z-index: 10;
  background: blue;
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
}

.sibling {
  z-index: 5;
  background: green;
  height: 50px;
  position: relative;
}`,
    validationTests: [
      {
        description: "Parent should have position",
        testFn: `return getComputedStyle(document.querySelector('.parent')).position !== 'static';`,
      },
      {
        description: "Child should be positioned",
        testFn: `return getComputedStyle(document.querySelector('.child')).position === 'absolute';`,
      },
    ],
    hints: [
      "Z-index only works on positioned elements (relative, absolute, fixed, sticky)",
      "The parent needs position: relative for absolute children to stack correctly",
    ],
    tags: ["z-index", "positioning", "stacking-context"],
    isActive: true,
  },
  {
    title: "Mobile Nav Hidden",
    category: "css",
    difficulty: "medium",
    description: "The mobile navigation disappears because the media query uses the wrong breakpoint unit (em instead of px).",
    starterCode: `.nav {
  display: flex;
  gap: 20px;
}

@media (max-width: 48em) {
  .nav {
    display: none;
  }
  
  .mobile-menu {
    display: block;
  }
}`,
    solutionCode: `.nav {
  display: flex;
  gap: 20px;
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
  
  .mobile-menu {
    display: block;
  }
}`,
    validationTests: [
      {
        description: "Media query should use px unit",
        testFn: `const style = document.querySelector('style').textContent; return style.includes('768px');`,
      },
      {
        description: "Mobile menu should be hidden on desktop",
        testFn: `return window.innerWidth > 768;`,
      },
    ],
    hints: [
      "Use consistent units in media queries (px or rem, not mix)",
      "Common breakpoints: 768px for tablet, 1024px for desktop",
    ],
    tags: ["media-queries", "responsive", "mobile"],
    isActive: true,
  },
  {
    title: "Overflow Clipping",
    category: "css",
    difficulty: "hard",
    description: "An absolutely positioned child is being clipped by its parent's overflow:hidden, even though it should be visible outside the parent.",
    starterCode: `.parent {
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 200px;
  background: #f0f0f0;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: #ff0000;
}`,
    solutionCode: `.parent {
  position: relative;
  overflow: visible;
  width: 200px;
  height: 200px;
  background: #f0f0f0;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: #ff0000;
}`,
    validationTests: [
      {
        description: "Parent should not clip overflow",
        testFn: `return getComputedStyle(document.querySelector('.parent')).overflow === 'visible';`,
      },
      {
        description: "Child should be visible outside parent",
        testFn: `const parent = document.querySelector('.parent'); const child = document.querySelector('.child'); const parentRect = parent.getBoundingClientRect(); const childRect = child.getBoundingClientRect(); return childRect.width > parentRect.width;`,
      },
    ],
    hints: [
      "Remove overflow:hidden if you want children to be visible outside the parent",
      "Or use overflow:visible explicitly",
    ],
    tags: ["overflow", "positioning", "clipping"],
    isActive: true,
  },
  {
    title: "Grid Column Span",
    category: "css",
    difficulty: "medium",
    description: "Grid column span value is wrong, causing the layout to break and items to overlap.",
    starterCode: `.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.item {
  grid-column: span 2;
}

.full-width {
  grid-column: span 3;
}`,
    solutionCode: `.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.item {
  grid-column: span 1;
}

.full-width {
  grid-column: span 3;
}`,
    validationTests: [
      {
        description: "Regular items should span 1 column",
        testFn: `return getComputedStyle(document.querySelector('.item')).gridColumn === '1 / span 1';`,
      },
      {
        description: "Full width items should span all columns",
        testFn: `return getComputedStyle(document.querySelector('.full-width')).gridColumn === '1 / span 3';`,
      },
    ],
    hints: [
      "Grid column span starts at 1, not 0",
      "Use grid-column: span N to span N columns",
    ],
    tags: ["css-grid", "layout", "span"],
    isActive: true,
  },
  {
    title: "Sticky Header Broken",
    category: "css",
    difficulty: "hard",
    description: "Position sticky is not working because a parent element has overflow: auto, which creates a new stacking context.",
    starterCode: `.container {
  overflow: auto;
  height: 100vh;
}

.header {
  position: sticky;
  top: 0;
  background: white;
  padding: 20px;
}

.content {
  height: 2000px;
}`,
    solutionCode: `.container {
  height: 100vh;
}

.header {
  position: sticky;
  top: 0;
  background: white;
  padding: 20px;
  z-index: 10;
}

.content {
  height: 2000px;
}`,
    validationTests: [
      {
        description: "Container should not have overflow",
        testFn: `return getComputedStyle(document.querySelector('.container')).overflow === 'visible';`,
      },
      {
        description: "Header should have z-index",
        testFn: `return getComputedStyle(document.querySelector('.header')).zIndex !== 'auto';`,
      },
    ],
    hints: [
      "Position sticky doesn't work with overflow on parent elements",
      "Remove overflow or use position: fixed instead",
    ],
    tags: ["position", "sticky", "overflow"],
    isActive: true,
  },
  {
    title: "Button Hover State Gone",
    category: "css",
    difficulty: "medium",
    description: "Button hover state is not working because of CSS specificity conflict - a more specific selector is overriding it.",
    starterCode: `.button {
  background: blue;
  color: white;
  padding: 10px 20px;
}

.button:hover {
  background: darkblue;
}

.container .button {
  background: blue;
}`,
    solutionCode: `.button {
  background: blue;
  color: white;
  padding: 10px 20px;
}

.container .button {
  background: blue;
}

.container .button:hover {
  background: darkblue;
}`,
    validationTests: [
      {
        description: "Button should have hover state",
        testFn: `const style = document.querySelector('style').textContent; return style.includes('.button:hover') || style.includes('.container .button:hover');`,
      },
      {
        description: "Hover selector should be more specific",
        testFn: `const style = document.querySelector('style').textContent; return style.includes('.container .button:hover');`,
      },
    ],
    hints: [
      "Increase specificity of the hover selector to match the base selector",
      "Or use !important (not recommended) or restructure your CSS",
    ],
    tags: ["css-specificity", "hover", "selectors"],
    isActive: true,
  },
  {
    title: "Image Not Responsive",
    category: "css",
    difficulty: "easy",
    description: "Image is not responsive on mobile because it's missing max-width: 100%, causing it to overflow the container.",
    starterCode: `.container {
  width: 100%;
  max-width: 600px;
}

img {
  width: 800px;
  height: auto;
}`,
    solutionCode: `.container {
  width: 100%;
  max-width: 600px;
}

img {
  max-width: 100%;
  height: auto;
}`,
    validationTests: [
      {
        description: "Image should have max-width 100%",
        testFn: `return getComputedStyle(document.querySelector('img')).maxWidth === '100%';`,
      },
      {
        description: "Image should not overflow container",
        testFn: `const container = document.querySelector('.container'); const img = document.querySelector('img'); return img.offsetWidth <= container.offsetWidth;`,
      },
    ],
    hints: [
      "Always add max-width: 100% to images for responsive design",
      "Also add height: auto to maintain aspect ratio",
    ],
    tags: ["responsive", "images", "mobile"],
    isActive: true,
  },
  // JavaScript Challenges (8)
  {
    title: "Async Await Missing",
    category: "javascript",
    difficulty: "medium",
    description: "An async function is called without await, so the code continues before the promise resolves, causing undefined behavior.",
    starterCode: `async function getUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

function displayUser() {
  const user = getUser(1);
  console.log(user.name); // undefined
}

displayUser();`,
    solutionCode: `async function getUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

async function displayUser() {
  const user = await getUser(1);
  console.log(user.name);
}

displayUser();`,
    validationTests: [
      {
        description: "displayUser should be async",
        testFn: `return typeof displayUser === 'function' && displayUser.constructor.name === 'AsyncFunction';`,
      },
      {
        description: "getUser should be awaited",
        testFn: `const code = displayUser.toString(); return code.includes('await getUser');`,
      },
    ],
    hints: [
      "Make the calling function async to use await",
      "Or use .then() instead of await",
    ],
    tags: ["async", "await", "promises"],
    isActive: true,
  },
  {
    title: "Closure Bug",
    category: "javascript",
    difficulty: "hard",
    description: "Using var in a loop creates a closure bug where all callbacks reference the same variable value.",
    starterCode: `for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i); // All print 5
  }, 100);
}`,
    solutionCode: `for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}`,
    validationTests: [
      {
        description: "Should use let instead of var",
        testFn: `const code = arguments.callee.toString(); return code.includes('let i');`,
      },
      {
        description: "Should not use var in loop",
        testFn: `const code = arguments.callee.toString(); return !code.includes('var i');`,
      },
    ],
    hints: [
      "Use let or const instead of var in loops",
      "Or use IIFE to create a new scope for each iteration",
    ],
    tags: ["closures", "var", "scope"],
    isActive: true,
  },
  {
    title: "Array Mutation Bug",
    category: "javascript",
    difficulty: "medium",
    description: "Array.filter returns a new array but the result is not stored, so the original array remains unchanged.",
    starterCode: `const numbers = [1, 2, 3, 4, 5];

numbers.filter(n => n % 2 === 0);

console.log(numbers); // Still [1, 2, 3, 4, 5]`,
    solutionCode: `const numbers = [1, 2, 3, 4, 5];

const evenNumbers = numbers.filter(n => n % 2 === 0);

console.log(evenNumbers); // [2, 4]`,
    validationTests: [
      {
        description: "Filter result should be stored",
        testFn: `const code = arguments.callee.toString(); return code.includes('const evenNumbers') || code.includes('let evenNumbers');`,
      },
      {
        description: "Should use the filtered result",
        testFn: `const code = arguments.callee.toString(); return code.includes('evenNumbers');`,
      },
    ],
    hints: [
      "Array methods like filter, map, reduce return new arrays",
      "Store the result in a variable to use it",
    ],
    tags: ["arrays", "filter", "mutation"],
    isActive: true,
  },
  {
    title: "Event Listener Not Removed",
    category: "javascript",
    difficulty: "hard",
    description: "Event listeners are added on every render but never removed, causing memory leaks and duplicate handlers.",
    starterCode: `function setupButton() {
  const button = document.getElementById('myButton');
  button.addEventListener('click', handleClick);
}

function handleClick() {
  console.log('Clicked');
}

setupButton();
setupButton(); // Adds duplicate listener`,
    solutionCode: `function setupButton() {
  const button = document.getElementById('myButton');
  button.removeEventListener('click', handleClick);
  button.addEventListener('click', handleClick);
}

function handleClick() {
  console.log('Clicked');
}

setupButton();
setupButton();`,
    validationTests: [
      {
        description: "Should remove event listener before adding",
        testFn: `const code = arguments.callee.toString(); return code.includes('removeEventListener');`,
      },
      {
        description: "Should reference the same function",
        testFn: `const code = arguments.callee.toString(); return code.includes('handleClick');`,
      },
    ],
    hints: [
      "Remove event listeners before adding new ones",
      "Store the handler function reference to remove it later",
    ],
    tags: ["events", "memory-leak", "listeners"],
    isActive: true,
  },
  {
    title: "Undefined Property Access",
    category: "javascript",
    difficulty: "easy",
    description: "Optional chaining is missing, so accessing a property on a potentially null object causes a crash.",
    starterCode: `const user = getUser();

console.log(user.name); // Crashes if user is null`,
    solutionCode: `const user = getUser();

console.log(user?.name); // Safe`,
    validationTests: [
      {
        description: "Should use optional chaining",
        testFn: `const code = arguments.callee.toString(); return code.includes('user?.name');`,
      },
      {
        description: "Should not access property directly",
        testFn: `const code = arguments.callee.toString(); return !code.includes('user.name');`,
      },
    ],
    hints: [
      "Use optional chaining (?.) to safely access nested properties",
      "Or check for null/undefined before accessing",
    ],
    tags: ["optional-chaining", "null", "safety"],
    isActive: true,
  },
  {
    title: "setTimeout Reference Bug",
    category: "javascript",
    difficulty: "medium",
    description: "The 'this' context is lost inside setTimeout because arrow functions or bind is not used.",
    starterCode: `const obj = {
  value: 42,
  showValue: function() {
    setTimeout(function() {
      console.log(this.value); // undefined
    }, 100);
  }
};

obj.showValue();`,
    solutionCode: `const obj = {
  value: 42,
  showValue: function() {
    setTimeout(() => {
      console.log(this.value);
    }, 100);
  }
};

obj.showValue();`,
    validationTests: [
      {
        description: "Should use arrow function",
        testFn: `const code = arguments.callee.toString(); return code.includes('setTimeout(() =>');`,
      },
      {
        description: "Should preserve this context",
        testFn: `const code = arguments.callee.toString(); return code.includes('this.value');`,
      },
    ],
    hints: [
      "Use arrow functions to preserve 'this' context",
      "Or use .bind(this) on the callback",
    ],
    tags: ["this", "settimeout", "arrow-functions"],
    isActive: true,
  },
  {
    title: "Promise Chain Broken",
    category: "javascript",
    difficulty: "medium",
    description: "Missing return in a .then() chain breaks the promise chain, causing subsequent handlers to receive undefined.",
    starterCode: `fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    processData(data); // Missing return
  })
  .then(result => {
    console.log(result); // undefined
  });`,
    solutionCode: `fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    return processData(data);
  })
  .then(result => {
    console.log(result);
  });`,
    validationTests: [
      {
        description: "Should return the processed data",
        testFn: `const code = arguments.callee.toString(); return code.includes('return processData');`,
      },
      {
        description: "Promise chain should be complete",
        testFn: `const code = arguments.callee.toString(); return code.match(/\.then/g).length >= 2;`,
      },
    ],
    hints: [
      "Always return values in .then() to continue the chain",
      "Or use async/await for cleaner code",
    ],
    tags: ["promises", "chaining", "then"],
    isActive: true,
  },
  {
    title: "LocalStorage Parse Error",
    category: "javascript",
    difficulty: "easy",
    description: "JSON.parse is called on undefined from localStorage, which throws an error and crashes the app.",
    starterCode: `const data = JSON.parse(localStorage.getItem('user'));

console.log(data.name);`,
    solutionCode: `const stored = localStorage.getItem('user');
const data = stored ? JSON.parse(stored) : null;

console.log(data?.name);`,
    validationTests: [
      {
        description: "Should check for null before parsing",
        testFn: `const code = arguments.callee.toString(); return code.includes('stored ?') || code.includes('if (stored)');`,
      },
      {
        description: "Should handle undefined safely",
        testFn: `const code = arguments.callee.toString(); return code.includes('data?.name');`,
      },
    ],
    hints: [
      "Check if localStorage value exists before parsing",
      "Use try/catch around JSON.parse for safety",
    ],
    tags: ["localstorage", "json", "error-handling"],
    isActive: true,
  },
  // React Challenges (7)
  {
    title: "State Not Updating",
    category: "react",
    difficulty: "medium",
    description: "setState is called with the same object reference (mutation), so React doesn't detect the change and doesn't re-render.",
    starterCode: `const [user, setUser] = useState({ name: 'John', age: 25 });

function updateAge() {
  user.age = 26;
  setUser(user); // Won't trigger re-render
}`,
    solutionCode: `const [user, setUser] = useState({ name: 'John', age: 25 });

function updateAge() {
  setUser({ ...user, age: 26 });
}`,
    validationTests: [
      {
        description: "Should use object spread",
        testFn: `const code = arguments.callee.toString(); return code.includes('{ ...user');`,
      },
      {
        description: "Should not mutate state directly",
        testFn: `const code = arguments.callee.toString(); return !code.includes('user.age =');`,
      },
    ],
    hints: [
      "Always create a new object reference when updating state",
      "Use object spread (...) or create a new object",
    ],
    tags: ["react", "state", "mutation"],
    isActive: true,
  },
  {
    title: "useEffect Infinite Loop",
    category: "react",
    difficulty: "medium",
    description: "useEffect is missing its dependency array, so it runs on every render, causing an infinite loop.",
    starterCode: `useEffect(() => {
  fetchData();
}); // Runs on every render`,
    solutionCode: `useEffect(() => {
  fetchData();
}, []); // Runs only on mount`,
    validationTests: [
      {
        description: "useEffect should have dependency array",
        testFn: `const code = arguments.callee.toString(); return code.includes('useEffect(() => {');`,
      },
      {
        description: "Should include empty array for mount-only",
        testFn: `const code = arguments.callee.toString(); return code.includes('}, []);`,
      },
    ],
    hints: [
      "Always include a dependency array in useEffect",
      "Use [] for mount-only, or list dependencies for reactive effects",
    ],
    tags: ["react", "useeffect", "hooks"],
    isActive: true,
  },
  {
    title: "Key Prop Missing",
    category: "react",
    difficulty: "easy",
    description: "List is rendered without key prop, causing React warnings and potential bugs when items are reordered.",
    starterCode: `const items = ['Apple', 'Banana', 'Orange'];

return (
  <ul>
    {items.map(item => <li>{item}</li>)}
  </ul>
);`,
    solutionCode: `const items = ['Apple', 'Banana', 'Orange'];

return (
  <ul>
    {items.map((item, index) => <li key={index}>{item}</li>)}
  </ul>
);`,
    validationTests: [
      {
        description: "List items should have key prop",
        testFn: `const code = arguments.callee.toString(); return code.includes('key=');`,
      },
      {
        description: "Should use index or unique id as key",
        testFn: `const code = arguments.callee.toString(); return code.includes('key={index}') || code.includes('key={item.id}');`,
      },
    ],
    hints: [
      "Always add a key prop when rendering lists",
      "Use unique IDs when available, or index as fallback",
    ],
    tags: ["react", "lists", "keys"],
    isActive: true,
  },
  {
    title: "Stale Closure in useEffect",
    category: "react",
    difficulty: "hard",
    description: "useEffect captures an old state value in its closure, so it always uses the initial value instead of the current one.",
    starterCode: `const [count, setCount] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    console.log(count); // Always 0
  }, 1000);
  
  return () => clearInterval(interval);
}, []);`,
    solutionCode: `const [count, setCount] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
  
  return () => clearInterval(interval);
}, []);`,
    validationTests: [
      {
        description: "Should use functional state update",
        testFn: `const code = arguments.callee.toString(); return code.includes('setCount(prev');`,
      },
      {
        description: "Should not reference count in interval",
        testFn: `const code = arguments.callee.toString(); return !code.includes('console.log(count)');`,
      },
    ],
    hints: [
      "Use functional state updates (prev => prev + 1) to get current value",
      "Or add the state to the dependency array",
    ],
    tags: ["react", "useeffect", "closures"],
    isActive: true,
  },
  {
    title: "Prop Drilling Type Error",
    category: "react",
    difficulty: "easy",
    description: "A prop is passed as a string instead of a number, causing type errors in calculations.",
    starterCode: `function Counter({ max }) {
  return <div>Max: {max}</div>;
}

<Counter max="10" /> // max is "10" not 10`,
    solutionCode: `function Counter({ max }) {
  return <div>Max: {max}</div>;
}

<Counter max={10} />`,
    validationTests: [
      {
        description: "Should pass number with curly braces",
        testFn: `const code = arguments.callee.toString(); return code.includes('max={10}');`,
      },
      {
        description: "Should not pass as string",
        testFn: `const code = arguments.callee.toString(); return !code.includes('max="10"');`,
      },
    ],
    hints: [
      "Use curly braces {} to pass JavaScript values as props",
      "Strings are passed with quotes, numbers with curly braces",
    ],
    tags: ["react", "props", "types"],
    isActive: true,
  },
  {
    title: "Conditional Hook",
    category: "react",
    difficulty: "medium",
    description: "A hook is called inside an if statement, violating the Rules of Hooks and causing bugs.",
    starterCode: `function Component({ isAdmin }) {
  if (isAdmin) {
    const [data, setData] = useState(null);
  }
  
  return <div>Hello</div>;
}`,
    solutionCode: `function Component({ isAdmin }) {
  const [data, setData] = useState(null);
  
  if (isAdmin) {
    // Use data here
  }
  
  return <div>Hello</div>;
}`,
    validationTests: [
      {
        description: "Hooks should be called at top level",
        testFn: `const code = arguments.callee.toString(); return code.includes('const [data, setData] = useState(null);') && !code.includes('if (isAdmin) {\\n    const [data');`,
      },
      {
        description: "Should not have hooks inside conditionals",
        testFn: `const code = arguments.callee.toString(); return !code.match(/if\\s*\\([^)]+\\)\\s*{\\s*const\\s+\\[/);`,
      },
    ],
    hints: [
      "Always call hooks at the top level of your component",
      "Never call hooks inside conditions, loops, or nested functions",
    ],
    tags: ["react", "hooks", "rules-of-hooks"],
    isActive: true,
  },
  {
    title: "Component Not Re-rendering",
    category: "react",
    difficulty: "medium",
    description: "Object spread is missing when updating state, so the reference doesn't change and React doesn't re-render.",
    starterCode: `const [user, setUser] = useState({ name: 'John' });

function updateName() {
  user.name = 'Jane';
  setUser(user); // Same reference
}`,
    solutionCode: `const [user, setUser] = useState({ name: 'John' });

function updateName() {
  setUser({ ...user, name: 'Jane' }); // New reference
}`,
    validationTests: [
      {
        description: "Should use object spread",
        testFn: `const code = arguments.callee.toString(); return code.includes('{ ...user');`,
      },
      {
        description: "Should create new object",
        testFn: `const code = arguments.callee.toString(); return code.includes('setUser({');`,
      },
    ],
    hints: [
      "React only re-renders when state reference changes",
      "Use object spread to create a new object reference",
    ],
    tags: ["react", "state", "re-render"],
    isActive: true,
  },
];

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if challenges already exist
    const existingCount = await Challenge.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing challenges. Skipping seed.`);
      process.exit(0);
    }

    // Insert challenges
    await Challenge.insertMany(challenges);
    console.log(`Successfully seeded ${challenges.length} challenges`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding challenges:", error);
    process.exit(1);
  }
}

seed();
