import requests
import time
import .env
# Insert your Hugging Face token here
HF_API_TOKEN = "YOUR_HF_API_TOKEN"

# Choose a free, instruct-capable model (Mixtral, Zephyr, etc)
MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1"

def ask_huggingface(prompt, model=MODEL):
    url = f"https://api-inference.huggingface.co/models/{model}"
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    payload = {"inputs": prompt}
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 503:
        # Model is loading, wait and retry
        print("Model is loading, waiting 30 seconds...")
        time.sleep(30)
        response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        print(f"Error: {response.status_code} {response.text}")
        return None
    # The output may be a list of dicts with 'generated_text'
    output = response.json()
    if isinstance(output, list):
        return output[0].get("generated_text", "")
    if isinstance(output, dict) and "generated_text" in output:
        return output["generated_text"]
    return output

def main():
    with open("app_summary.txt", "r", encoding="utf-8") as f:
        summary = f.read()
    prompt = f"""
You are a world-class security auditor and QA lead.

Given the following application summary, do these tasks:
1. Infer and describe the full workflow of the application.
2. List all possible and likely security vulnerabilities (static, business logic, config, supply chain, etc).
3. Generate an exhaustive set of test cases for every endpoint, workflow, and module—including:
   - Functional tests
   - Security tests (auth, injection, access control, etc)
   - Edge cases
   - Any areas where coverage is missing or weak

Be exhaustive, practical, and reference specific endpoints/functions/classes by name.

=== APPLICATION SUMMARY START ===
{summary}
=== APPLICATION SUMMARY END ===
"""
    print("Sending prompt to Hugging Face API...")
    answer = ask_huggingface(prompt)
    print("\n=== LLM RESPONSE ===\n")
    print(answer)
    with open("llm_review.txt", "w", encoding="utf-8") as f:
        f.write(str(answer))

if __name__ == "__main__":
    main()