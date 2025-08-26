"""
Coverage Dataset Generator
Integrates the coverage analysis functionality into the Flask app
"""

import os
import re
import json
import math
import subprocess
import tempfile
import zipfile
import shutil
from pathlib import Path
from collections import defaultdict
from typing import List, Dict, Any, Optional
import pandas as pd
import requests
from urllib.parse import urlparse
import git

class CoverageDatasetGenerator:
    """
    Generates coverage datasets from repositories, zip files, or Docker Compose files
    """
    
    def __init__(self, temp_dir: str = None):
        self.temp_dir = temp_dir or tempfile.mkdtemp()
        self.repo_path = None
        
    def __del__(self):
        """Cleanup temporary files"""
        if self.temp_dir and os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def process_input(self, input_source: str, input_type: str) -> Dict[str, Any]:
        """
        Process different input types and generate coverage dataset
        
        Args:
            input_source: GitHub URL, zip file path, or Docker Compose content
            input_type: 'github', 'zip', or 'docker_compose'
            
        Returns:
            Dict containing dataset path and metadata
        """
        try:
            if input_type == 'github':
                self.repo_path = self._clone_github_repo(input_source)
            elif input_type == 'zip':
                self.repo_path = self._extract_zip_file(input_source)
            elif input_type == 'docker_compose':
                self.repo_path = self._process_docker_compose(input_source)
            else:
                raise ValueError(f"Unsupported input type: {input_type}")
            
            # Generate dataset
            dataset_path = self._generate_dataset()
            
            return {
                'success': True,
                'dataset_path': dataset_path,
                'repo_path': self.repo_path,
                'metadata': self._extract_metadata()
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'dataset_path': None,
                'repo_path': None,
                'metadata': {}
            }
    
    def _clone_github_repo(self, github_url: str) -> str:
        """Clone GitHub repository"""
        repo_name = github_url.split('/')[-1].replace('.git', '')
        repo_path = os.path.join(self.temp_dir, repo_name)
        
        try:
            git.Repo.clone_from(github_url, repo_path)
            return repo_path
        except Exception as e:
            raise Exception(f"Failed to clone repository: {str(e)}")
    
    def _extract_zip_file(self, zip_path: str) -> str:
        """Extract uploaded zip file"""
        extract_path = os.path.join(self.temp_dir, 'extracted')
        os.makedirs(extract_path, exist_ok=True)
        
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_path)
            
            # Find the main directory (handle nested structures)
            contents = os.listdir(extract_path)
            if len(contents) == 1 and os.path.isdir(os.path.join(extract_path, contents[0])):
                return os.path.join(extract_path, contents[0])
            return extract_path
            
        except Exception as e:
            raise Exception(f"Failed to extract zip file: {str(e)}")
    
    def _process_docker_compose(self, docker_compose_content: str) -> str:
        """Process Docker Compose content"""
        compose_path = os.path.join(self.temp_dir, 'docker-compose.yml')
        
        try:
            with open(compose_path, 'w') as f:
                f.write(docker_compose_content)
            
            # Create a simple project structure for analysis
            project_path = os.path.join(self.temp_dir, 'docker_project')
            os.makedirs(project_path, exist_ok=True)
            
            # Copy compose file to project
            shutil.copy2(compose_path, os.path.join(project_path, 'docker-compose.yml'))
            
            return project_path
            
        except Exception as e:
            raise Exception(f"Failed to process Docker Compose: {str(e)}")
    
    def _generate_dataset(self) -> str:
        """Generate coverage dataset using the analysis logic"""
        if not self.repo_path:
            raise Exception("No repository path available")
        
        repo = Path(self.repo_path)
        rows = []
        
        # Analyze Dockerfiles
        dockerfiles = list(repo.rglob("Dockerfile*"))
        for dpath in dockerfiles:
            row = self._analyze_dockerfile(dpath, repo)
            if row:
                rows.append(row)
        
        # Analyze dependency manifests
        manifests = self._find_manifests(repo)
        for mpath in manifests:
            row = self._analyze_manifest(mpath, repo)
            if row:
                rows.append(row)
        
        # Analyze code modules
        modules = self._analyze_modules(repo)
        rows.extend(modules)
        
        # Create dataset
        dataset_path = os.path.join(self.temp_dir, 'coverage_dataset.csv')
        self._write_dataset(rows, dataset_path)
        
        return dataset_path
    
    def _analyze_dockerfile(self, dpath: Path, repo: Path) -> Optional[List]:
        """Analyze a Dockerfile"""
        try:
            text = dpath.read_text(encoding='utf-8', errors='ignore')
            module = self._get_top_level_module(dpath, repo)
            name = f"Dockerfile:{dpath.relative_to(repo)}"
            
            # Calculate scores
            risk_score = self._calculate_docker_risk(text)
            complexity_score = self._calculate_complexity(text)
            priority = self._infer_priority(name, module)
            impact = self._infer_impact(name, module)
            status = self._infer_status(0, len(text.splitlines()))  # No tests for Dockerfile
            
            return [name, module, priority, round(risk_score, 2), 
                   round(complexity_score, 2), status, impact]
        except Exception:
            return None
    
    def _analyze_manifest(self, mpath: Path, repo: Path) -> Optional[List]:
        """Analyze a dependency manifest"""
        try:
            text = mpath.read_text(encoding='utf-8', errors='ignore')
            module = self._get_top_level_module(mpath, repo)
            name = f"Deps:{mpath.relative_to(repo)}"
            
            # Calculate scores
            risk_score = self._calculate_dependency_risk(text)
            complexity_score = self._calculate_complexity(text)
            priority = self._infer_priority(name, module)
            impact = self._infer_impact(name, module)
            status = self._infer_status(0, len(text.splitlines()))
            
            return [name, module, priority, round(risk_score, 2), 
                   round(complexity_score, 2), status, impact]
        except Exception:
            return None
    
    def _analyze_modules(self, repo: Path) -> List[List]:
        """Analyze code modules"""
        modules = []
        top_levels = [p for p in repo.iterdir() if p.is_dir() and not p.name.startswith('.')]
        
        for mod in top_levels:
            try:
                files = list(mod.rglob("*.*"))
                total_sloc = sum(self._count_sloc(f) for f in files)
                
                name = f"Module:{mod.name}"
                module = mod.name
                risk_score = self._calculate_module_risk(mod)
                complexity_score = self._calculate_complexity_from_files(files)
                priority = self._infer_priority(name, module)
                impact = self._infer_impact(name, module)
                status = self._infer_status(0, total_sloc)
                
                modules.append([name, module, priority, round(risk_score, 2), 
                              round(complexity_score, 2), status, impact])
            except Exception:
                continue
        
        return modules
    
    def _find_manifests(self, repo: Path) -> List[Path]:
        """Find dependency manifest files"""
        manifest_patterns = [
            "requirements.txt", "package.json", "yarn.lock", "pnpm-lock.yaml",
            "poetry.lock", "pyproject.toml", "go.mod", "pom.xml"
        ]
        
        manifests = []
        for pattern in manifest_patterns:
            manifests.extend(repo.rglob(pattern))
        
        return manifests
    
    def _get_top_level_module(self, path: Path, repo: Path) -> str:
        """Get top-level module name"""
        try:
            rel = path.relative_to(repo)
            parts = rel.parts
            return parts[0] if parts else "root"
        except Exception:
            return "root"
    
    def _calculate_docker_risk(self, text: str) -> float:
        """Calculate Docker risk score"""
        risk_patterns = [
            (r"FROM .*:latest", 5),
            (r"^USER root", 4),
            (r"curl .*\|.*sh", 5),
            (r"ADD ", 2),
        ]
        
        risk_score = 0
        for pattern, weight in risk_patterns:
            if re.search(pattern, text, flags=re.MULTILINE):
                risk_score += weight
        
        return min(5.0, 1.0 + math.log(1.0 + risk_score + 1e-6, 2))
    
    def _calculate_dependency_risk(self, text: str) -> float:
        """Calculate dependency risk score"""
        # Simple heuristic based on file size and content
        lines = text.splitlines()
        return min(5.0, 1.0 + len(lines) / 100.0)
    
    def _calculate_module_risk(self, module_path: Path) -> float:
        """Calculate module risk score"""
        # Simple heuristic based on file count and types
        files = list(module_path.rglob("*.*"))
        return min(5.0, 1.0 + len(files) / 50.0)
    
    def _calculate_complexity(self, text: str) -> float:
        """Calculate complexity score"""
        sloc = len([line for line in text.splitlines() if line.strip()])
        return min(5.0, 1.0 + math.log(1 + sloc, 5))
    
    def _calculate_complexity_from_files(self, files: List[Path]) -> float:
        """Calculate complexity from multiple files"""
        total_sloc = sum(self._count_sloc(f) for f in files)
        return min(5.0, 1.0 + math.log(1 + total_sloc, 5))
    
    def _count_sloc(self, file_path: Path) -> int:
        """Count source lines of code"""
        try:
            text = file_path.read_text(encoding='utf-8', errors='ignore')
            return len([line for line in text.splitlines() if line.strip()])
        except Exception:
            return 0
    
    def _infer_priority(self, name: str, module: str) -> str:
        """Infer priority level"""
        text = f"{name} {module}".lower()
        priority_keywords = {
            "high": ["auth", "payment", "security", "infra", "gateway"],
            "medium": ["admin", "product", "order", "catalog"],
            "low": ["ui", "docs", "styles", "examples"]
        }
        
        for level, keywords in priority_keywords.items():
            if any(kw in text for kw in keywords):
                return level
        return "medium"
    
    def _infer_impact(self, name: str, module: str) -> str:
        """Infer business impact"""
        text = f"{name} {module}".lower()
        impact_keywords = {
            "Critical": ["payment", "auth", "security", "secrets"],
            "High": ["checkout", "orders", "infra", "gateway"],
            "Medium": ["product", "catalog", "search", "email"],
            "Low": ["docs", "ui", "theme"]
        }
        
        for level, keywords in impact_keywords.items():
            if any(kw in text for kw in keywords):
                return level
        return "Medium"
    
    def _infer_status(self, tests_count: int, sloc: int) -> str:
        """Infer test coverage status"""
        if tests_count == 0:
            return "uncovered"
        ratio = tests_count / max(10, sloc/50)
        if ratio >= 1.0:
            return "covered"
        if ratio >= 0.3:
            return "partial"
        return "uncovered"
    
    def _write_dataset(self, rows: List[List], output_path: str):
        """Write dataset to CSV"""
        import csv
        
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(["name", "module", "priority", "risk_score", 
                           "complexity_score", "status", "business_impact"])
            writer.writerows(rows)
    
    def _extract_metadata(self) -> Dict[str, Any]:
        """Extract repository metadata"""
        if not self.repo_path:
            return {}
        
        try:
            repo = Path(self.repo_path)
            metadata = {
                'total_files': len(list(repo.rglob("*.*"))),
                'dockerfiles': len(list(repo.rglob("Dockerfile*"))),
                'manifests': len(self._find_manifests(repo)),
                'modules': len([p for p in repo.iterdir() if p.is_dir() and not p.name.startswith('.')])
            }
            return metadata
        except Exception:
            return {}
