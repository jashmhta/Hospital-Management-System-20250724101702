#!/usr/bin/env python3
"""
Dependency Fixer - Fixes npm dependencies and permission issues
"""

import os
import subprocess
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DependencyFixer:
    def __init__(self, project_root: str = "."):
        self.project_root = Path(project_root)
        
    def fix_dependencies(self):
        """Fix all dependency and permission issues"""
        logger.info("🔧 STARTING DEPENDENCY AND PERMISSION FIX...")
        
        # Phase 1: Clean existing node_modules
        self.clean_node_modules()
        
        # Phase 2: Install dependencies properly
        self.install_dependencies()
        
        # Phase 3: Fix permissions
        self.fix_permissions()
        
        # Phase 4: Verify installation
        self.verify_installation()
        
        logger.info("🎯 DEPENDENCY FIX COMPLETE")
    
    def clean_node_modules(self):
        """Clean existing node_modules to ensure fresh install"""
        logger.info("1️⃣ CLEANING EXISTING NODE_MODULES...")
        
        node_modules_path = self.project_root / "node_modules"
        if node_modules_path.exists():
            try:
                # Remove node_modules directory
                subprocess.run(['rm', '-rf', str(node_modules_path)], 
                             check=True, cwd=self.project_root)
                logger.info("   ✅ Removed existing node_modules")
            except subprocess.CalledProcessError as e:
                logger.error(f"Error removing node_modules: {e}")
        
        # Also clean package-lock.json if it exists
        lock_file = self.project_root / "package-lock.json"
        if lock_file.exists():
            try:
                lock_file.unlink()
                logger.info("   ✅ Removed package-lock.json")
            except Exception as e:
                logger.error(f"Error removing package-lock.json: {e}")
    
    def install_dependencies(self):
        """Install dependencies with proper configuration"""
        logger.info("2️⃣ INSTALLING DEPENDENCIES...")
        
        try:
            # First, ensure npm is using the correct configuration
            subprocess.run(['npm', 'config', 'set', 'fund', 'false'], 
                         check=True, cwd=self.project_root)
            subprocess.run(['npm', 'config', 'set', 'audit', 'false'], 
                         check=True, cwd=self.project_root)
            
            # Install dependencies with specific flags for better compatibility
            install_cmd = [
                'npm', 'install',
                '--legacy-peer-deps',
                '--no-optional',
                '--prefer-offline',
                '--no-audit',
                '--no-fund'
            ]
            
            result = subprocess.run(install_cmd, 
                                  capture_output=True, 
                                  text=True, 
                                  timeout=300,
                                  cwd=self.project_root)
            
            if result.returncode == 0:
                logger.info("   ✅ Dependencies installed successfully")
            else:
                logger.error(f"npm install failed: {result.stderr}")
                # Try alternative installation method
                self.try_alternative_install()
                
        except subprocess.TimeoutExpired:
            logger.error("npm install timed out, trying alternative method")
            self.try_alternative_install()
        except Exception as e:
            logger.error(f"Error during npm install: {e}")
            self.try_alternative_install()
    
    def try_alternative_install(self):
        """Try alternative installation method"""
        logger.info("   🔄 Trying alternative installation method...")
        
        try:
            # Try installing core dependencies first
            core_deps = [
                'typescript@^5.8.3',
                'next@latest',
                '@types/node@^22',
                '@types/react@^19',
                'eslint@latest',
                'prettier@latest'
            ]
            
            for dep in core_deps:
                try:
                    subprocess.run(['npm', 'install', dep, '--save-dev'], 
                                 check=True, timeout=60, cwd=self.project_root)
                    logger.info(f"   ✅ Installed {dep}")
                except Exception as e:
                    logger.warning(f"   ⚠️ Failed to install {dep}: {e}")
            
        except Exception as e:
            logger.error(f"Alternative installation failed: {e}")
    
    def fix_permissions(self):
        """Fix file permissions for executables"""
        logger.info("3️⃣ FIXING FILE PERMISSIONS...")
        
        bin_dir = self.project_root / "node_modules" / ".bin"
        if bin_dir.exists():
            try:
                # Make all files in .bin directory executable
                subprocess.run(['chmod', '-R', '+x', str(bin_dir)], 
                             check=True, cwd=self.project_root)
                logger.info("   ✅ Fixed .bin directory permissions")
            except subprocess.CalledProcessError as e:
                logger.error(f"Error fixing permissions: {e}")
        
        # Also fix permissions for the entire node_modules if needed
        node_modules_dir = self.project_root / "node_modules"
        if node_modules_dir.exists():
            try:
                subprocess.run(['find', str(node_modules_dir), '-type', 'f', '-name', '*.js', '-exec', 'chmod', '+x', '{}', ';'], 
                             check=True, cwd=self.project_root)
                logger.info("   ✅ Fixed node_modules permissions")
            except subprocess.CalledProcessError as e:
                logger.warning(f"Warning fixing node_modules permissions: {e}")
    
    def verify_installation(self):
        """Verify that dependencies are properly installed"""
        logger.info("4️⃣ VERIFYING INSTALLATION...")
        
        # Check if TypeScript is available
        tsc_path = self.project_root / "node_modules" / ".bin" / "tsc"
        if tsc_path.exists():
            logger.info("   ✅ TypeScript compiler found")
            try:
                result = subprocess.run(['npx', 'tsc', '--version'], 
                                      capture_output=True, text=True, 
                                      timeout=30, cwd=self.project_root)
                if result.returncode == 0:
                    logger.info(f"   ✅ TypeScript version: {result.stdout.strip()}")
                else:
                    logger.warning(f"   ⚠️ TypeScript version check failed: {result.stderr}")
            except Exception as e:
                logger.warning(f"   ⚠️ Error checking TypeScript version: {e}")
        else:
            logger.error("   ❌ TypeScript compiler not found")
        
        # Check if Next.js is available
        next_path = self.project_root / "node_modules" / ".bin" / "next"
        if next_path.exists():
            logger.info("   ✅ Next.js found")
        else:
            logger.error("   ❌ Next.js not found")
        
        # Check if ESLint is available
        eslint_path = self.project_root / "node_modules" / ".bin" / "eslint"
        if eslint_path.exists():
            logger.info("   ✅ ESLint found")
        else:
            logger.error("   ❌ ESLint not found")

if __name__ == "__main__":
    fixer = DependencyFixer()
    fixer.fix_dependencies()
