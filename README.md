# teya.gg
A simple web server with a set of tools, mainly focused on solving personal work tasks.

## Docker

```Run
make up
```

```Stop Docker Container
make down
```

## Localhost Development Mode (HMR)

create .env file in backend directory

```
DB_HOST=localhost
DB_USERNAME=test
DB_PASSWORD=test
DB_DATABASE=test
```

```Development
make db
make back
make front
make pbn
```

### Prod Branch

Front: teya.gg, localhost
Back: teya.gg/api/, localhost/api/

### Dev Branch
Front: teya.gg:8080, localhost:8080
Back: teya.gg:8080/api/, localhost:8080/api/

For ssl - 8443 is alternative 443 port (better port for cloudflare)

### Development
Front: localhost
Back: localhost/api/

Postgres: localhost:5435
---
Default Basic Auth: 123:123
For change basic auth, change .env file

## Server Setup Instructions

### Step 1: Preparing the Server
- Update the system:
  ```
  apt update
  apt upgrade -y
  ```
- Install necessary dependencies:
  ```
  apt install apt-transport-https ca-certificates curl software-properties-common gnupg2 -y
  ```

### Step 2: Installing Docker
- Add Docker GPG key:
  ```
  curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
  ```
- Add the Docker repository:
  ```
  add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
  ```
- Install Docker:
  ```
  apt update
  apt install docker-ce docker-ce-cli containerd.io -y
  ```
- Check Docker status:
  ```
  systemctl status docker
  ```

### Step 3: Installing Docker Compose
- Download Docker Compose (check the latest version on the official Docker website):
  ```
  curl -L "https://github.com/docker/compose/releases/download/v2.2.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  ```
- Make Docker Compose executable:
  ```
  chmod +x /usr/local/bin/docker-compose
  ```

### Step 4: Creating a Separate User for Docker
- Create a new user:
  ```
  adduser dockeruser
  ```
- Add the user to the Docker group:
  ```
  usermod -aG docker dockeruser
  ```

### Step 5: Switching to the New User and Verification
- Switch to the `dockeruser` and verify Docker and Docker Compose versions:
  ```
  su - dockeruser
  docker --version
  docker-compose --version
  ```
This instruction allows you to manage Docker on your Debian server securely, using a separate user `dockeruser`.

## Clone Repository, run docker-compose
Using root user add first user (if you want to use other user than dockeruser):
```
apt install git
apt install sudo
adduser teya
usermod -aG sudo teya
usermod -aG docker teya
su - teya
sudo apt-get -y install make
```

### Clone repository, run docker compose

#### Prod
```
cd && mkdir prod && cd prod
git clone https://github.com/eininu/teya.gg.git && cd teya.gg
make up
```

#### Dev
```
cd && mkdir dev && cd dev
git clone https://github.com/eininu/teya.gg.git && cd teya.gg
git checkout dev
make up
```

Check that everything is working:
```
docker ps -a
```

## GitHub Workflow Setup Instructions

1. Generate SSH key (from your local machine, not remote server):

! Set custom name for key

```
ssh-keygen
```

2. Save id_rsa key to secrets in GitHub repository settings named 'SSH_PRIVATE_KEY'
3. Add 'REMOTE_HOST' to secrets in GitHub repository settings with your server IP
4. Save id_rsa.pub key to ~/.ssh/authorized_keys on your server
```
nano ~/.ssh/authorized_keys
```

## Migrations
```
make migration-generate InitialCommit
```

```
make migration-up
```