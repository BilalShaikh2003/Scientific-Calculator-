class Calculator {
    constructor() {
        this.display = document.getElementById('result');
        this.expressionDisplay = document.getElementById('expression');
        this.currentInput = '0';
        this.expression = '';
        this.lastResult = 0;
        this.shiftMode = false;
        this.angleMode = 'DEG';
        this.memory = 0;
        this.shouldResetDisplay = false;
        this.lastOperator = null;
        this.lastOperand = null;
        this.parenthesesCount = 0;
        
        this.init();
    }

    init() {
        this.updateDisplay();
        this.updateModeIndicators();
        
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    updateDisplay() {
        this.display.textContent = this.currentInput;
        this.expressionDisplay.textContent = this.expression;
        
        document.querySelector('.display').classList.remove('error');
    }

    updateModeIndicators() {
        document.getElementById('deg').style.display = this.angleMode === 'DEG' ? 'inline' : 'none';
        document.getElementById('rad').style.display = this.angleMode === 'RAD' ? 'inline' : 'none';
        document.getElementById('grad').style.display = this.angleMode === 'GRAD' ? 'inline' : 'none';
    }

    showError(message = 'Error') {
        this.currentInput = message;
        this.expression = '';
        document.querySelector('.display').classList.add('error');
        this.updateDisplay();
        this.shouldResetDisplay = true;
    }

    clear() {
        this.currentInput = '0';
        this.expression = '';
        this.shouldResetDisplay = false;
        this.parenthesesCount = 0;
        this.updateDisplay();
    }

    delete() {
        if (this.shouldResetDisplay) {
            this.clear();
            return;
        }

        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }

    number(digit) {
        if (this.shouldResetDisplay || this.currentInput === '0') {
            this.currentInput = digit;
            this.shouldResetDisplay = false;
        } else {
            this.currentInput += digit;
        }
        this.updateDisplay();
    }

    decimal() {
        if (this.shouldResetDisplay) {
            this.currentInput = '0.';
            this.shouldResetDisplay = false;
        } else if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }

    operator(op) {
        if (this.expression && !this.shouldResetDisplay) {
            this.equals();
        }
        
        this.expression = this.currentInput + ' ' + (op === '*' ? '×' : op === '/' ? '÷' : op) + ' ';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    equals() {
        try {
            let expr = this.expression + this.currentInput;
            
            
            expr = expr.replace(/×/g, '*').replace(/÷/g, '/');
            
            
            expr = this.preprocessExpression(expr);
            
            let result = eval(expr);
            
            if (!isFinite(result)) {
                this.showError('Math Error');
                return;
            }
            
            this.lastResult = result;
            this.currentInput = this.formatResult(result);
            this.expression = '';
            this.shouldResetDisplay = true;
            this.updateDisplay();
        } catch (error) {
            this.showError('Math Error');
        }
    }

    preprocessExpression(expr) {
        expr = expr.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, '($1 * Math.pow(10, $2))');
        
        expr = expr.replace(/(\d)\(/g, '$1*(');
        expr = expr.replace(/\)(\d)/g, ')*$1');
        
        return expr;
    }

    formatResult(num) {
        if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
            return num.toExponential(8);
        }
        return parseFloat(num.toPrecision(12)).toString();
    }

    sin() {
        let value = parseFloat(this.currentInput);
        let result = Math.sin(this.toRadians(value));
        this.currentInput = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    cos() {
        let value = parseFloat(this.currentInput);
        let result = Math.cos(this.toRadians(value));
        this.currentInput = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    tan() {
        let value = parseFloat(this.currentInput);
        let result = Math.tan(this.toRadians(value));
        this.currentInput = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    toRadians(degrees) {
        if (this.angleMode === 'DEG') {
            return degrees * Math.PI / 180;
        } else if (this.angleMode === 'GRAD') {
            return degrees * Math.PI / 200;
        }
        return degrees; 
    }

    log() {
        let value = parseFloat(this.currentInput);
        if (value <= 0) {
            this.showError('Math Error');
            return;
        }
        let result = Math.log10(value);
        this.currentInput = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    ln() {
        let value = parseFloat(this.currentInput);
        if (value <= 0) {
            this.showError('Math Error');
            return;
        }
        let result = Math.log(value);
        this.currentInput = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    square() {
        let value = parseFloat(this.currentInput);
        let result = Math.pow(value, 2);
        this.currentInput = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    sqrt() {
        let value = parseFloat(this.currentInput);
        if (value < 0) {
            this.showError('Math Error');
            return;
        }
        let result = Math.sqrt(value);
        this.currentInput = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    power() {
        this.expression = this.currentInput + ' ^ ';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    reciprocal() {
        let value = parseFloat(this.currentInput);
        if (value === 0) {
            this.showError('Math Error');
            return;
        }
        let result = 1 / value;
        this.currentInput = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    
    pi() {
        this.currentInput = this.formatResult(Math.PI);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }
    
    ans() {
        this.currentInput = this.formatResult(this.lastResult);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }
    exp() {
        this.currentInput += 'E';
        this.updateDisplay();
    }
    negate() {
        if (this.currentInput !== '0') {
            if (this.currentInput.startsWith('-')) {
                this.currentInput = this.currentInput.substring(1);
            } else {
                this.currentInput = '-' + this.currentInput;
            }
            this.updateDisplay();
        }
    }

    openParen() {
        if (this.shouldResetDisplay || this.currentInput === '0') {
            this.expression += '(';
            this.currentInput = '';
        } else {
            this.expression += this.currentInput + '*(';
            this.currentInput = '';
        }
        this.parenthesesCount++;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }
    shift() {
        this.shiftMode = !this.shiftMode;
        document.querySelector('.calculator').classList.toggle('shift-mode', this.shiftMode);
    }
    closeParen() {
        if (this.parenthesesCount > 0 && this.currentInput !== '') {
            this.expression += this.currentInput + ')';
            this.parenthesesCount--;
            this.shouldResetDisplay = true;
            this.updateDisplay();
        }
    }


    
    handleKeyboard(event) {
        const key = event.key;
        
        switch (key) {
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
                this.number(key);
                break;
            case '.':
                this.decimal();
                break;
            case '+': case '-': case '*': case '/':
                this.operator(key);
                break;
            case 'Enter': case '=':
                event.preventDefault();
                this.equals();
                break;
            case 'Escape': case 'c': case 'C':
                this.clear();
                break;
            case 'Backspace':
                this.delete();
                break;
            case '(':
                this.openParen();
                break;
            case ')':
                this.closeParen();
                break;
        }
    }
    mode() {
        if (this.angleMode === 'DEG') {
            this.angleMode = 'RAD';
        } else if (this.angleMode === 'RAD') {
            this.angleMode = 'GRAD';
        } else {
            this.angleMode = 'DEG';
        }
        this.updateModeIndicators();
    }
}

const calculator = new Calculator();