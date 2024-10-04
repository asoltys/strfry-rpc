import { createServer, connect } from "net";
import { randomUUID } from "crypto";

let exec = async (cmd: any) =>
  new Promise((resolve, reject) => {
    let c = `strfry ${cmd} 2>/dev/null`;
    let id = randomUUID();
    const resultSocketPath = `result_${id}`;

    const resultServer = createServer((socket) => {
      let resultBuffer = "";

      let results: any[] = [];
      socket.on("data", (data) => {
        resultBuffer += data.toString();

        let parts = resultBuffer.split("\n");

        for (let i = 0; i < parts.length - 1; i++) {
          try {
            let parsedObject = JSON.parse(parts[i]);
            results.push(parsedObject);
          } catch (e: any) {
            console.error("Error parsing JSON:", e.message);
          }
        }

        resultBuffer = parts[parts.length - 1];
      });

      socket.on("end", () => {
        socket.write("DONE");
        resolve(results);
        socket.end();

        resultServer.close();
      });
    });

    resultServer.listen(resultSocketPath, () => {
      const controlClient = connect("rpc", () => {
        const message = `${resultSocketPath} ${c}\n`;
        controlClient.write(message);
        controlClient.end();
      });

      controlClient.on("error", (e) =>
        reject(`Control socket error: ${e.message}`),
      );
    });

    resultServer.on("error", (e) =>
      reject(`Result server error: ${e.message}`),
    );
  });

export let scan = (f: object) => exec(`scan '${JSON.stringify(f)}'\n`)
