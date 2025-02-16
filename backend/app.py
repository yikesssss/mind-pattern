import logging
from fastapi import FastAPI
from pydantic import BaseModel
from google import genai
import os

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()

API_KEY = ""
client = genai.Client(api_key=API_KEY)

class ThoughtRequest(BaseModel):
    text: str 


def analyze_thought(text):
    logging.debug(f"Received text: {text}")
    try:
        chat = client.chats.create(model="gemini-2.0-flash")
        response = chat.send_message(f"""
        Analyze the following thought pattern and determine if it matches a cognitive distortion 
        (e.g., catastrophizing, black-and-white thinking, overgeneralization, personalization, etc.). 
        Then, provide a short reframing prompt to help the user rethink their thought in a healthier way.

        User Input: "{text}"

        Response format: 
        Thought Pattern: [Type]  
        Reframing Prompt: [Reframe Suggestion]
        """)

        return response.text
    except Exception as e:
        logging.error(f"Error in Gemini API: {e}")
        return "Error processing the request"

@app.post("/analyze")
async def analyze_usr_thought(request: ThoughtRequest):
    result = analyze_thought(request.text)
    return {"response": result}
