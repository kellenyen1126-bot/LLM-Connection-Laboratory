import streamlit as st
from groq import Groq

# -----------------------------
# Page configuration
# -----------------------------
st.set_page_config(
    page_title="AI Python Tutor",
    page_icon="🐍",
    layout="centered"
)

# -----------------------------
# Title and description
# -----------------------------
st.title("🐍 AI Python Tutor")

st.write(
    "Ask questions about Python and get explanations designed "
    "for your chosen difficulty level."
)

st.info(
    "⚠️ AI can make mistakes. Verify important information. "
    "Do not enter passwords, addresses, identification numbers, "
    "or other private information."
)

# -----------------------------
# Sidebar options
# -----------------------------
st.sidebar.header("Tutor Settings")

difficulty = st.sidebar.selectbox(
    "Difficulty Level",
    [
        "Beginner",
        "Intermediate",
        "Advanced"
    ]
)

response_length = st.sidebar.selectbox(
    "Response Length",
    [
        "Short",
        "Detailed"
    ]
)

language = st.sidebar.selectbox(
    "Response Language",
    [
        "English",
        "Chinese"
    ]
)

# -----------------------------
# Get API key
# -----------------------------
try:
    api_key = st.secrets["GROQ_API_KEY"]
except Exception:
    api_key = None

if not api_key:
    st.error(
        "API key is not configured. "
        "Please add GROQ_API_KEY to your Streamlit secrets."
    )
    st.stop()

# -----------------------------
# Create Groq client
# -----------------------------
client = Groq(api_key=api_key)

# -----------------------------
# User input
# -----------------------------
question = st.text_area(
    "Enter your Python question:",
    placeholder="Example: What is a for loop in Python?",
    height=150
)

# -----------------------------
# Ask button
# -----------------------------
if st.button("Ask AI Tutor", type="primary"):

    # Check empty input
    if not question.strip():
        st.warning("Please enter a question first.")
        st.stop()

    # -----------------------------
    # System instruction
    # -----------------------------
    system_prompt = f"""
You are an AI Python Tutor.

Your job is to help students understand Python programming.

The student's selected difficulty level is:
{difficulty}

The student's selected response length is:
{response_length}

The student's selected language is:
{language}

Rules:
1. Explain Python concepts clearly.
2. Match the explanation to the selected difficulty.
3. Use simple examples when appropriate.
4. Do not assume the student already understands advanced concepts.
5. If you provide code, explain what the important parts do.
6. Encourage the student to understand the code instead of simply copying it.
7. If the question is not related to Python, politely explain that you
   are designed mainly to help with Python.
8. Never ask the student for passwords, addresses, identification numbers,
   or other private information.
"""

    # -----------------------------
    # Send request to LLM
    # -----------------------------
    try:
        with st.spinner("AI Tutor is thinking..."):

            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": question
                    }
                ],
                temperature=0.4
            )

        # -----------------------------
        # Get response text
        # -----------------------------
        answer = response.choices[0].message.content

        # -----------------------------
        # Display response
        # -----------------------------
        st.subheader("🤖 AI Tutor Response")
        st.markdown(answer)

    # -----------------------------
    # Error handling
    # -----------------------------
    except Exception as error:

        st.error(
            "Sorry, something went wrong while contacting the AI service."
        )

        with st.expander("Technical information"):
            st.write(str(error))

# -----------------------------
# Footer
# -----------------------------
st.divider()

st.caption(
    "AI Python Tutor — Educational project using Streamlit and an LLM API."
)
