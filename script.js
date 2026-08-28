const API_KEY = "YOUR_GEMINI_API_KEY";

const askButton = document.getElementById("askButton");
const questionInput = document.getElementById("question");
const difficultyInput = document.getElementById("difficulty");
const lengthInput = document.getElementById("length");
const loading = document.getElementById("loading");
const responseBox = document.getElementById("response");

askButton.addEventListener("click", askAI);

async function askAI(){

    const question = questionInput.value.trim();

    if(question === ""){
        responseBox.innerHTML = "Please enter a question.";
        return;
    }

    loading.style.display = "block";
    responseBox.innerHTML = "";
    askButton.disabled = true;

    const prompt = `
You are an AI Python Tutor.

Difficulty: ${difficultyInput.value}
Response Length: ${lengthInput.value}

Teach Python only.

Student Question:
${question}
`;

    try{

        const url =
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

        const res = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                contents:[
                    {
                        parts:[
                            {text:prompt}
                        ]
                    }
                ]
            })
        });

        const data = await res.json();

        if(data.error){
            throw new Error(data.error.message);
        }

        const answer =
        data.candidates[0].content.parts[0].text;

        responseBox.innerHTML = answer;

    }catch(error){

        responseBox.innerHTML =
        "❌ Error: " + error.message;

    }

    loading.style.display = "none";
    askButton.disabled = false;
}
