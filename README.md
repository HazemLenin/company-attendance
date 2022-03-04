# company-attendance
Attendance system for companies created in about 17 days
and about 12 hours to restore lost frontend files

## Technologies used
Django for the backend (with drf for api)
ReactJs for the frontend (with redux for global state management)

## Installation
First go to the backend file
```commandline
cd company_attendance_backend
```
Then install backend requirements from requirements.txt file
```commandline
pip install -r requirements.txt
```
Then we need to make migrations files and migrate them and the apps
```commandline
python manage.py makemigrations
python manage.py migrate
```
Creating super user for adminstration
```commandline
python manage.py createsuperuser
```
Don't forget to create 3 groups with ("managers", "receptionists", "employees") names in the same order, add superuser to managers group and finally create profile for the superuser from django admin panel
For the frontend go to frontend directory
```commandline
# from the repo root
cd company-attendance-frontend
```
Then install front end dependencies from package.json
```commandline
npm install
```
And Run the frontend locally
```commanline
npm start
```