# teya.gg
A simple web server with a set of tools, mainly focused on solving personal work tasks.

## Docker

```Run
make up
```

```Stop Docker Container
make down
```

### Prod Branch

Front: teya.gg, localhost
Back: teya.gg/api/, localhost/api/

### Dev Branch
Front: teya.gg:81, localhost:81
Back: teya.gg:81/api/, localhost:81/api/

For ssl - 8443 is alternative 443 port (better port for cloudflare)

---
Default Basic Auth: 123:123
For change basic auth, change .env file
