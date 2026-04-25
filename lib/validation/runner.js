// Code validation runner for testing user submissions
export async function runValidation(code, challenge) {
  const startTime = Date.now();
  const results = [];
  let passed = true;

  const { category, validationTests, starterCode } = challenge;

  if (category === "html" || category === "css") {
    const testResults = await runHTMLCSSValidation(code, validationTests);
    results.push(...testResults);
  } else if (category === "javascript") {
    const testResults = await runJavaScriptValidation(code, validationTests);
    results.push(...testResults);
  } else if (category === "react") {
    const testResults = await runReactValidation(code, validationTests);
    results.push(...testResults);
  }

  const failedTests = results.filter((r) => !r.passed);
  passed = failedTests.length === 0;
  const timeTaken = Date.now() - startTime;

  return {
    passed,
    score: 0, // Will be calculated by scorer
    results,
    timeTaken,
  };
}

async function runHTMLCSSValidation(code, validationTests) {
  const results = [];
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  try {
    const loadPromise = new Promise((resolve, reject) => {
      iframe.onload = resolve;
      iframe.onerror = reject;
    });

    iframe.srcdoc = code;
    await loadPromise;

    for (const test of validationTests) {
      try {
        const testFn = new Function("doc", test.testFn);
        const testPassed = testFn(iframe.contentDocument);
        results.push({
          description: test.description,
          passed: testPassed,
          error: null,
        });
      } catch (error) {
        results.push({
          description: test.description,
          passed: false,
          error: error.message,
        });
      }
    }
  } catch (error) {
    results.push({
      description: "Failed to load code in iframe",
      passed: false,
      error: error.message,
    });
  } finally {
    document.body.removeChild(iframe);
  }

  return results;
}

async function runJavaScriptValidation(code, validationTests) {
  const results = [];

  try {
    // Create sandboxed function from user code
    const { execSync } = require('child_process');
    const userFn = new Function(code);
    userFn();

    // Get the global scope to access user-defined functions/variables
    const userScope = {};

    // Execute code in a controlled scope
    const sandbox = new Function(`
      ${code}
      return this;
    `);
    const scope = sandbox();

    for (const test of validationTests) {
      try {
        const testFn = new Function("scope", test.testFn);
        const testPassed = testFn(scope);
        results.push({
          description: test.description,
          passed: testPassed,
          error: null,
        });
      } catch (error) {
        results.push({
          description: test.description,
          passed: false,
          error: error.message,
        });
      }
    }
  } catch (error) {
    results.push({
      description: "Failed to execute JavaScript code",
      passed: false,
      error: error.message,
    });
  }

  return results;
}

async function runReactValidation(code, validationTests) {
  const results = [];
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  try {
    const loadPromise = new Promise((resolve, reject) => {
      iframe.onload = resolve;
      iframe.onerror = reject;
    });

    const reactCode = `
      <!DOCTYPE html>
      <html>
      <head>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          ${code}
        </script>
      </body>
      </html>
    `;

    iframe.srcdoc = reactCode;
    await loadPromise;

    // Wait a bit for React to render
    await new Promise((resolve) => setTimeout(resolve, 500));

    for (const test of validationTests) {
      try {
        const testFn = new Function("doc", test.testFn);
        const testPassed = testFn(iframe.contentDocument);
        results.push({
          description: test.description,
          passed: testPassed,
          error: null,
        });
      } catch (error) {
        results.push({
          description: test.description,
          passed: false,
          error: error.message,
        });
      }
    }
  } catch (error) {
    results.push({
      description: "Failed to load React code in iframe",
      passed: false,
      error: error.message,
    });
  } finally {
    document.body.removeChild(iframe);
  }

  return results;
}
