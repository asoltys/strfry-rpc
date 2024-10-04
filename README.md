# Strfry RPC

The server.c program creates a UNIX socket that listens for commands

When it reads some input on the socket it treats first part as a command to be eval'd and the second part is the name of a socket to send the results on


## Build and run the server

    gcc -o server server.c && ./server

I've included a client program in typescript that you can run with bun to test it out

## Run the client

    bun index.ts
