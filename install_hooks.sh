#!/bin/bash

# Налаштування локального гіту для використання директорії з хуками
git config core.hooksPath .githooks

# Перевірка та встановлення gitleaks
node src/check_secrets.js

echo "Pre-commit hook successfully installed."
