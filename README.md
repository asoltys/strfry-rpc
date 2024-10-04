# Strfry RPC

I was looking for some way to remotely control my strfry relay to issue `sync` and `scan` commands for example from another docker container so I cooked this up.

The server.c program creates a UNIX socket that listens for commands

When it reads some input on the socket it treats the first word as the name of another socket file to be used for sending the command output. The remaining input is eval'd.

## Build and run the server

    gcc -o server server.c && ./server

## Pipe an expression to the socket

    { nc -lU result & pid=$!; echo "result expr 3 + 4" | nc -U rpc; wait $pid; } 2> /dev/null
    7

I've included a client program in typescript that you can run with [Bun](https://bun.sh/) 

    import { scan } from "./strfry.ts";

    let result = await scan({ kinds: [1] })
    console.log(result)

## Run it

    bun demo.ts

## Output

    [
      {
        content: "good morning",
        created_at: 1728073424,
        id: "da786d3bdefd2e2e27b466f8586fd30b4d1a0b49bc18d45ca392fd93d926ecb0",
        kind: 1,
        pubkey: "c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5",
        sig: "c586d58af974a4624d216f820c20c6934a65c59c076ba3fd09bd097dd38f39678040503034c9cac32930062620311de2ec635bc01c04e55feea171bce966afb7",
        tags: [
          [ "t", "gm" ]
        ],
      }
    ]

It assumes that strfry is in your PATH and that strfry-db exists in the current folder and has some kind 1 events to query.

In the context of a docker network you can mount a shared volume that the server creates socket files in so the strfry container and the container your client runs in can both access the sockets.
