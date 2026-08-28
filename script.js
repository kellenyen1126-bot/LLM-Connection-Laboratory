const askButton = document.getElementById("askButton");
const questionInput = document.getElementById("question");
const difficultyInput = document.getElementById("difficulty");
const lengthInput = document.getElementById("length");

const responseBox = document.getElementById("response");
const loading = document.getElementById("loading");


askButton.addEventListener("click", async function () {

    const question = questionInput.value.trim();
    const difficulty = difficultyInput.value;
    const length = lengthInput.value;

    // Check for empty input
    if (question === "") {
        responseBox.textContent =
            "Please enter a Python question first.";
        return;
    }

    // Disable button while waiting
    askButton.disabled = true;

    loading.style.display = "block";

    responseBox.textContent = "";

    try {

        const response = await fetch("/api/ask", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                question: question,
                difficulty: difficulty,
                length: length

            })

        });


        if (!response.ok) {
            throw new Error("API request failed.");
        }


        const data = await response.json();


        if (data.answer) {

            responseBox.textContent = data.answer;

        } else {

            responseBox.textContent =
                "The AI did not return an answer.";

        }


    } catch (error) {

        console.error(error);

        responseBox.textContent =
            "Sorry, something went wrong while contacting the AI.";

    }


    loading.style.display = "none";

    askButton.disabled = false;

});
