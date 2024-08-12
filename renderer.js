document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    const showHistoryButton = document.getElementById('show-history');
    const modal = document.getElementById('history-modal');
    const span = document.getElementsByClassName('close')[0];
    const historyContent = document.getElementById('history-content');
    const usernameDisplay = document.getElementById('username-display');
  
    let currentInput = '';
    let operator = '';
    let firstOperand = '';
    let ans = 0;
    const history = [];
    let invMode = false;
    let angleMode = 'Deg'; // Default to Degrees
  
    // Display username on calculator page
    if (usernameDisplay) {
      const username = localStorage.getItem('username');
      if (username) {
        usernameDisplay.textContent = `User: ${username}`;
      }
    }
  
    // Calculator functionality
    buttons.forEach(button => {
      button.addEventListener('click', (event) => {
        const value = event.target.dataset.value;
  
        switch (value) {
          case 'C':
            clearDisplay();
            break;
          case 'back':
            deleteLastCharacter();
            break;
          case '=':
            calculateResult();
            break;
          case '+/-':
            toggleSign();
            break;
          case 'Rad':
          case 'Deg':
            toggleAngleMode(value);
            break;
          case 'Inv':
            toggleInvMode();
            break;
          case 'Ans':
            useAns();
            break;
          case 'π':
            appendToCurrentInput(Math.PI);
            break;
          case 'e':
            appendToCurrentInput(Math.E);
            break;
          case 'sin':
          case 'cos':
          case 'tan':
          case 'log':
          case 'sqrt':
          case 'ln':
          case 'EXP':
          case '!':
            handleScientificOperation(value);
            break;
          default:
            handleInput(value);
        }
      });
    });
  
    function clearDisplay() {
      currentInput = '';
      operator = '';
      firstOperand = '';
      updateDisplay();
    }
  
    function deleteLastCharacter() {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
    }
  
    function calculateResult() {
      if (operator && firstOperand && currentInput) {
        const result = performCalculation(parseFloat(firstOperand), parseFloat(currentInput), operator);
        displayResult(result);
        saveToHistory(`${firstOperand} ${operator} ${currentInput} = ${result}`);
        resetForNextCalculation(result);
      }
    }
  
    function toggleSign() {
      if (currentInput) {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
      }
    }
  
    function toggleAngleMode(mode) {
      angleMode = mode;
      display.value = angleMode;
    }
  
    function toggleInvMode() {
      invMode = !invMode;
      display.value = invMode ? 'Inv' : '';
    }
  
    function useAns() {
      appendToCurrentInput(ans);
    }
  
    function handleScientificOperation(value) {
      if (currentInput) {
        const result = performScientificCalculation(parseFloat(currentInput), value);
        displayResult(result);
        saveToHistory(`${value}(${currentInput}) = ${result}`);
        resetForNextCalculation(result);
      }
    }
  
    function handleInput(value) {
      if (['+', '-', '*', '/', '^', '%'].includes(value)) {
        if (currentInput) {
          if (operator) {
            firstOperand = performCalculation(parseFloat(firstOperand), parseFloat(currentInput), operator).toString();
            display.value = `${firstOperand} ${value} `;
          } else {
            firstOperand = currentInput;
            display.value = `${firstOperand} ${value} `;
          }
          operator = value;
          currentInput = '';
        }
      } else {
        appendToCurrentInput(value);
      }
    }
  
    function appendToCurrentInput(value) {
      currentInput += value.toString();
      updateDisplay();
    }
  
    function performCalculation(a, b, operator) {
      switch (operator) {
        case '+':
          return a + b;
        case '-':
          return a - b;
        case '*':
          return a * b;
        case '/':
          return a / b;
        case '^':
          return Math.pow(a, b);
        case '%':
          return a % b;
        default:
          return '';
      }
    }
  
    function performScientificCalculation(value, operator) {
      switch (operator) {
        case 'sin':
          return invMode ? Math.asin(value) : (angleMode === 'Deg' ? Math.sin(value * Math.PI / 180) : Math.sin(value));
        case 'cos':
          return invMode ? Math.acos(value) : (angleMode === 'Deg' ? Math.cos(value * Math.PI / 180) : Math.cos(value));
        case 'tan':
          return invMode ? Math.atan(value) : (angleMode === 'Deg' ? Math.tan(value * Math.PI / 180) : Math.tan(value));
        case 'log':
          return invMode ? Math.pow(10, value) : Math.log10(value);
        case 'sqrt':
          return invMode ? Math.pow(value, 2) : Math.sqrt(value);
        case 'ln':
          return invMode ? Math.exp(value) : Math.log(value);
        case '!':
          return factorial(value);
        case 'EXP':
          return value * Math.pow(10, value);
        default:
          return '';
      }
    }
  
    function factorial(n) {
      if (n === 0 || n === 1) return 1;
      return n * factorial(n - 1);
    }
  
    function displayResult(result) {
      ans = result;
      currentInput = result.toString();
      updateDisplay();
    }
  
    function resetForNextCalculation(result) {
      firstOperand = '';
      operator = '';
      currentInput = result.toString();
    }
  
    function saveToHistory(entry) {
      history.push(entry);
    }
  
    function updateDisplay() {
      display.value = currentInput || '0';
    }
  
    // History modal functionality
    showHistoryButton.onclick = function () {
      historyContent.innerHTML = history.join('<br>');
      modal.style.display = 'block';
    };
  
    span.onclick = function () {
      modal.style.display = 'none';
    };
  
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };
  });
  