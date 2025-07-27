VENV_DIR=android_archive
PYTHON=$(VENV_DIR)/bin/python
PIP=$(VENV_DIR)/bin/pip

# ANSI colors
GREEN=\033[0;32m
BLUE=\033[1;34m
YELLOW=\033[1;33m
RESET=\033[0m

.PHONY: help venv activate deactivate clean start init

help:
	@echo ""
	@echo "$(BLUE)Available targets:$(RESET)"
	@echo "  $(YELLOW)make venv$(RESET)       - Create virtual environment in $(VENV_DIR)/"
	@echo "  $(YELLOW)make activate$(RESET)   - Print command to activate the venv"
	@echo "  $(YELLOW)make deactivate$(RESET) - Print command to deactivate (note: must run manually)"
	@echo "  $(YELLOW)make clean$(RESET)      - Remove virtual environment"
	@echo "  $(YELLOW)make start$(RESET)      - Start the python server"
	@echo "  $(YELLOW)make init$(RESET)        - Create archive-env.zsh for use in shell"
	@echo ""

venv:
	@python3 -m venv $(VENV_DIR)
	@echo "$(GREEN)✅ Virtual environment created in $(VENV_DIR)/$(RESET)"

activate:
	@echo "$(BLUE)Run this command to activate the venv:$(RESET)"
	@echo "$(YELLOW)source $(VENV_DIR)/bin/activate$(RESET)"

deactivate:
	@echo "$(BLUE)Run this command to deactivate the venv:$(RESET)"
	@echo "$(YELLOW)deactivate$(RESET)"

clean:
	@rm -rf $(VENV_DIR)
	@echo "$(GREEN)🗑️  Removed virtual environment$(RESET)"

start:
	python serve.py

init:
	@echo "export CUSTOM_ARCHIVE_ROOT=\"`pwd`\"" > archive-env.zsh
	@echo 'archive() {' >> archive-env.zsh
	@echo '  ts-node "$$CUSTOM_ARCHIVE_ROOT/scripts/archive.ts" "$$@"' >> archive-env.zsh
	@echo '}' >> archive-env.zsh
	@echo "$(GREEN)✅ Created archive-env.zsh — run: source archive-env.zsh$(RESET)"


