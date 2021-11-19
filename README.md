# Aidudu - Kanban-driven Project Management Web Application

## Members 
- Trinh Thu Hai
- Tran Le Hoang
- Tran Hai Son
- Le Duc Dung
- Hoang Tuan Anh Van
- Dang Quang Minh
- Pham Tuan Son
- Tran Trung Hieu
- Vu Hai Dang
- Pham Van Khoa


## Setup VSCode

Setup Python virtual environment and install dependencies to suppress import warnings in VSCode while working with backend:
```bash
cd backend/
python -m venv env
source env/bin/activate

pip3 install -r requirements_[YOUR_OS].txt

# -> then reload your vscode
```

Install extension Python Docstring Generator (optional)
- Change default docstring format from *Google* to *Sphinx*

## Setup on local machine

### Setup backend:
```bash
# start backend server and required services
docker-compose -f docker-compose.local.yml up
```

If this the first time you setup the backup, you need to run the migration command inside the backend container:
```bash
python3 manage.py makemigrations
python3 manage.py migrate
```

### Setup frontend: 
// TODO

```bash
# install dependencies (run once)
npm ci

# start frontend server
cd frontend/
npm run start
```


## FAQ
### How to run command inside Docker container
```bash
docker-compose -f docker-compose.[ENV].yml exec [COMMAND]
```

### How to create an admin user
```bash
python3 manage.py createsuperuser
```