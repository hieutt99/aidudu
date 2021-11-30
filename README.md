# Aidudu - Kanban-driven Project Management Web Application

## Team Members 
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

## How to contribute?
Please read our [CONTRIBUTING](https://github.com/hieutt99/aidudu/blob/develop/CONTRIBUTING.md) document.

## Setup VSCode for developing

Setup Python virtual environment and install dependencies to suppress import warnings in VSCode while working with backend:
```bash
cd backend/
python -m venv env
source env/bin/activate

pip3 install -r requirements_[YOUR_OS].txt
```
Then reload your vscode and select env/bin/python as the main Python interpreter for vscode

Install extension Python Docstring Generator (optional)
- Change default docstring format from *Google* to *Sphinx*

## Setup on local machine

### Setup backend:
```bash
# start backend server and required services
docker-compose up
```

If this the first time you setup the backend, you need to run the migrate command inside the backend container:
```bash
docker-compose exec backend python3 manage.py migrate
```

### Setup frontend: 
Prerequisite: `nodejs` and `npm` installed.

**1. Set up local developing environment (VSCode, ...)**
```bash
cd frontend/

# install dependencies (run once)
# Note: should not try to resolve any vulnerabilities
npm i
```

In case you do not use docker, run this command to start frontend server (port 3000) <br>
Then open [http://localhost:3000](http://localhost:3000) to view it in the browser. You should first register an account in login page.
```bash
# start frontend (in case you do not use docker)
npm run start
```

**2. Set up docker enviroment for developing**
```bash
cd frontend/

# start frontend server (port 3000)
docker-compose up
```

---

## Setup on production server (draft)
The backend server will run on port 8000 and the frontend server will run on port 3000. Please make sure these ports are available on your server.

```bash
# Start all the required services
docker-compose -f docker-compose.prod.yml up -d
```

If this the first time you setup the production server, you need to run the migrate command inside the backend container:
```
docker-compose exec -f docker-compose.prod.yml backend python3 manage.py migrate
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


### How to migrate database
```bash
python3 manage.py migrate
```

### How to make database migration
Note: do not run this command if you're not permitted by the team leader. Otherwise, all PR include migrations changes will be rejected.
```bash
python3 manage.py makemigrations
```

### Enable Docker Buildkit on your machine
Some old versions of Docker may require setting enviroment variable `DOCKER_BUILDKIT` to 1.

```bash
DOCKER_BUILDKIT=1 docker-compose build
```