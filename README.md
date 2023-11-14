# teya.gg
A simple web server with a set of tools, mainly focused on solving personal work tasks.

## Docker

```Run
make up
```

```Stop Docker Container
make down
```

## Development Mode (HMR)

```Development
make front
make back
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
---
Default Basic Auth: 123:123
For change basic auth, change .env file
