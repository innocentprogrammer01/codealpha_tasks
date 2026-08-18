const expression = document.getElementById("expression");
const result = document.getElementById("result");

let input = "";

// Update Display
function updateDisplay() {
    expression.textContent = input;

    if (input === "") {
        result.textContent = "0";
    } else {
        result.textContent = input;
    }
}

// Calculate Result
function calculate() {
    try {
        let exp = input
            .replace(/×/g, "*")
            .replace(/÷/g, "/");

        let answer = eval(exp);

        if (answer === Infinity || isNaN(answer)) {
            result.textContent = "Error";
            input = "";
            return;
        }

        result.textContent = answer;
        expression.textContent = input;
        input = answer.toString();

    } catch {
        result.textContent = "Error";
        input = "";
    }
}

// Button Click Events
document.querySelectorAll(".buttons button").forEach(button => {

    button.addEventListener("click", () => {

        const value = button.textContent;

        switch (value) {

            case "AC":
                input = "";
                updateDisplay();
                break;

            case "DEL":
                input = input.slice(0, -1);
                updateDisplay();
                break;

            case "=":
                calculate();
                break;

            case "%":
                try {
                    input = (eval(input) / 100).toString();
                    updateDisplay();
                } catch {
                    result.textContent = "Error";
                    input = "";
                }
                break;

            default:
                input += value;
                updateDisplay();
        }

    });

});

// Keyboard Support
document.addEventListener("keydown", (e) => {

    const key = e.key;

    if ((key >= "0" && key <= "9") || key === ".") {
        input += key;
        updateDisplay();
    }

    if (key === "+") {
        input += "+";
        updateDisplay();
    }

    if (key === "-") {
        input += "-";
        updateDisplay();
    }

    if (key === "*") {
        input += "*";
        updateDisplay();
    }

    if (key === "/") {
        input += "/";
        updateDisplay();
    }

    if (key === "Enter") {
        e.preventDefault();
        calculate();
    }

    if (key === "Backspace") {
        input = input.slice(0, -1);
        updateDisplay();
    }

    if (key === "Escape") {
        input = "";
        updateDisplay();
    }

});