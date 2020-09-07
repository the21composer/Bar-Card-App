py -m venv venv
cmd /k "venv\Scripts\activate & python -m pip install --upgrade pip & pip install flask & pip install mongoengine & set FLASK_APP=..\app.py & flask run --port=5000"
pause
