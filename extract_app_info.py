import os
import ast

def extract_python_endpoints_and_functions(repo_path):
    endpoints, functions, classes = [], [], []
    for root, dirs, files in os.walk(repo_path):
        for file in files:
            if file.endswith('.py'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    code = f.read()
                try:
                    tree = ast.parse(code, filename=file)
                    for node in ast.walk(tree):
                        if isinstance(node, ast.FunctionDef):
                            functions.append(f"{file}: def {node.name}()")
                        if isinstance(node, ast.ClassDef):
                            classes.append(f"{file}: class {node.name}")
                        # Detect Flask/FastAPI routes (very simple heuristic)
                        for deco in getattr(node, 'decorator_list', []):
                            if isinstance(deco, ast.Call) and hasattr(deco.func, 'attr'):
                                if deco.func.attr in ['route', 'get', 'post', 'put', 'delete']:
                                    endpoints.append(f"{file}: @{deco.func.attr} {getattr(deco.args[0], 's', '')}")
                except Exception as e:
                    pass
    return endpoints, functions, classes

def extract_readme(repo_path):
    for name in ['README.md', 'readme.md']:
        p = os.path.join(repo_path, name)
        if os.path.exists(p):
            with open(p, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()
    return "No README found."

def main(repo_path):
    readme = extract_readme(repo_path)
    endpoints, functions, classes = extract_python_endpoints_and_functions(repo_path)
    summary = f"""
=== README ===
{readme[:2000]}

=== Endpoints Found ===
{chr(10).join(endpoints) or 'None'}

=== Function Definitions ===
{chr(10).join(functions) or 'None'}

=== Classes ===
{chr(10).join(classes) or 'None'}
"""
    # Save summary to file for LLM prompt
    with open("app_summary.txt", "w", encoding="utf-8") as f:
        f.write(summary)
    print("Summary saved to app_summary.txt")
    print(summary)

if __name__ == "__main__":
    main("/content/repo")  # Change path as needed