# portfolio 

A simple local DA valuation tool for thinking about the value of your ideas.

To run:

```bash
$ cd web
$ python3 server.py 
```

To develop: 

```
=>> fswatch client/*.ts | each { |x| bun build client/index.ts > web/index.js }
# in another tab
=>> python3 server.py
# then load localhost:8080 in the browser.
```



