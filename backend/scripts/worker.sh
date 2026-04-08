#!/usr/bin/env bash
set -e
python - <<'PY2'
import socket, time
host, port = 'db', 5432
for attempt in range(60):
    sock = socket.socket()
    try:
        sock.connect((host, port))
        sock.close()
        break
    except OSError:
        time.sleep(2)
else:
    raise SystemExit('Database did not become available in time.')
PY2
python manage.py makemigrations accounts creators products orders payments landing_pages analytics_app notifications ai_tools audit feature_flags affiliates subscriptions teams recommendations
python manage.py migrate
celery -A config worker -l info
