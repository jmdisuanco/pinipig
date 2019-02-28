# Pinipig

<img src="_images/logo.png" alt="Pinipig" widht="124" height="80"/>

![](https://img.shields.io/github/issues/jmdisuanco/pinipig.svg)
![](https://img.shields.io/github/license/jmdisuanco/pinipig.svg) ![](https://img.shields.io/twitter/url/https/github.com/jmdisuanco/pinipig.svg?style=social)
![](https://img.shields.io/github/commit-activity/y/jmdisuanco/pinipig.svg)

A performant web framework that's easy for developers!

Happy Developers... Happy servers...

## Benchmark

Environment

| Model                                     | Cores | Ram        |
| ----------------------------------------- | ----- | ---------- |
| Intel(R) Core(TM) i7-2720QM CPU @ 2.20GHz | 8     | 4294967296 |

Results

| Framework | Req/Sec   |
| --------- | --------- |
| pinipig   | 41,315.2  |
| bare      | 25,473.6  |
| fastify   | 22,743.2  |
| express   | 10,233.21 |
| hapi      | 10,389.21 |

Benchmarker tool used can be found here [node-framework-benchmarker](https://github.com/jmdisuanco/node-framework-benchmarker)

Detailed Benchmark report [here](_media/report.json)

results obtained using below configuration

```
{
  "port": 5000,
  "url": "http://localhost",
  "connections": 100,
  "pipelining": 10,
  "duration": 5

}
```

## What's in version 1.3.0

- Routes
- Async Hooks
  - before
  - after
- Inbuilt File upload
- CORS
- preflight handling
- Async Functional Flow
- WebSockets
- ORM
- CRUD
- Authentication Module
- a lot faster than previous version

## What's next

- Pub/Sub
