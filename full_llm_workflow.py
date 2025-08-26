import subprocess

def run_ollama_with_prompt(prompt, model='llama3'):
    result = subprocess.run(
        ["ollama", "run", model, prompt],
        capture_output=True,
        text=True
    )
    print("===== LLM Output =====")
    print(result.stdout)
    return result.stdout

if __name__ == "__main__":
    with open("prompt_for_llm.txt") as f:
        prompt = f.read()
    run_ollama_with_prompt(prompt)