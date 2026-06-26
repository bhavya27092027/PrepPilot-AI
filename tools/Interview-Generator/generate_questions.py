import os
import json
import time
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

ROLE = "Software Engineer"

DOMAINS = [
    "Data Structures & Algorithms",
    "System Design",
    "Machine Learning"
]

DIFFICULTIES = [
    "Beginner",
    "Intermediate",
    "Advanced"
]

COMPANIES = [
    "Google",
    "Amazon",
    "Microsoft",
    "Meta",
    "Adobe",
    "Flipkart",
    "Uber",
    "Zomato",
    "General"
]

COUNT = 50

with open("prompt.txt","r",encoding="utf8") as f:
    template=f.read()

for domain in DOMAINS:

    folder=domain.lower().replace(" ","_").replace("&","and")

    os.makedirs(f"output/{folder}",exist_ok=True)

    for company in COMPANIES:

        for difficulty in DIFFICULTIES:

            prompt=template \
            .replace("{ROLE}",ROLE)\
            .replace("{DOMAIN}",domain)\
            .replace("{DIFFICULTY}",difficulty)\
            .replace("{COMPANY}",company)\
            .replace("{COUNT}",str(COUNT))

            print(company,domain,difficulty)

            try:

                response=model.generate_content(prompt)

                text=response.text

                filename=f"{company.lower()}_{folder}_{difficulty.lower()}.json"

                with open(f"output/{folder}/{filename}","w",encoding="utf8") as file:
                    file.write(text)

                print("Saved",filename)

            except Exception as e:
                print(e)

            time.sleep(15)  # Sleep for 15 seconds to avoid rate limiting