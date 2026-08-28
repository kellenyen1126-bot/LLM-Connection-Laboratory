"""
OpenAI Function Calling Example
--------------------------------
This shows the core pattern for using OpenAI's function/tool calling:
1. Define a real Python function
2. Describe it to the model in JSON schema format
3. Let the model decide when to call it
4. Run the function yourself and send the result back
5. Get a final natural-language answer

Install dependency first:
    pip install openai

Set your API key as an environment variable before running:
    export OPENAI_API_KEY="your-key-here"
"""

import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


# 1. A real function that does something useful
def get_weather(city: str) -> dict:
    """Fake weather lookup — replace with a real API call if you want."""
    fake_data = {
        "Taipei": {"temp_c": 31, "condition": "Humid, partly cloudy"},
        "Hsinchu": {"temp_c": 30, "condition": "Sunny"},
        "Tokyo": {"temp_c": 27, "condition": "Rainy"},
    }
    return fake_data.get(city, {"temp_c": None, "condition": "Unknown city"})


# 2. Describe the function to the model (JSON schema)
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather for a given city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "The city name, e.g. Taipei",
                    }
                },
                "required": ["city"],
            },
        },
    }
]


def run_conversation(user_message: str):
    messages = [{"role": "user", "content": user_message}]

    # 3. First call: let the model decide whether to use a tool
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        tools=tools,
    )

    response_message = response.choices[0].message
    messages.append(response_message)

    tool_calls = response_message.tool_calls

    if tool_calls:
        # 4. Run the actual function(s) the model asked for
        for tool_call in tool_calls:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)

            if function_name == "get_weather":
                result = get_weather(**function_args)
            else:
                result = {"error": f"Unknown function: {function_name}"}

            # Send the function result back to the model
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(result),
                }
            )

        # 5. Second call: model turns the result into a natural language answer
        final_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
        )
        return final_response.choices[0].message.content

    # No tool was needed — just return the direct answer
    return response_message.content


if __name__ == "__main__":
    answer = run_conversation("What's the weather like in Taipei right now?")
    print(answer)
