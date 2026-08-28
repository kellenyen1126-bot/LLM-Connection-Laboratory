const askButton = document.getElementById("askButton");
const questionInput = document.getElementById("question");
const difficultyInput = document.getElementById("difficulty");
const lengthInput = document.getElementById("length");
const loading = document.getElementById("loading");
const responseBox = document.getElementById("response");

askButton.addEventListener("click", askAI);

async function askAI() {
    const question = questionInput.value.trim();
    if (question === "") {
        responseBox.innerHTML = "Please enter a question.";
        return;
    }

    loading.style.display = "block";
    responseBox.innerHTML = "";
    askButton.disabled = true;

    try {
        const res = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: question,
                difficulty: difficultyInput.value,
                length: lengthInput.value
            })
        });

        const data = await res.json();

        if (data.error) {
            throw new Error(data.error);
        }

        responseBox.innerHTML = data.answer;
    } catch (error) {
        responseBox.innerHTML = "❌ Error: " + error.message;
    }

    loading.style.display = "none";
    askButton.disabled = false;
}
