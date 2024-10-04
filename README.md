# Strfry RPC

I was looking for some way to remotely control my strfry relay to issue `sync` and `scan` commands for example from another docker container so I cooked this up.

The server.c program creates a UNIX socket that listens for commands

When it reads some input on the socket it treats first part as a command to be eval'd and the second part is the name of a socket to send the results on

## Build and run the server

    gcc -o server server.c && ./server

I've included a client program in typescript that you can run with bun to test it out

## Run the client

    bun index.ts

The client assumes that strfry is in your PATH and that strfry-db exists in the current folder and has some kind 1 events to query.

## How it looks

    import { scan } from "./strfry.ts";

    let result = await scan({ kinds: [1] })
    console.log(result)

In the context of a docker network you can mount a shared volume that the server creates socket files in so the strfry container and the container your client runs in can both access the sockets.
