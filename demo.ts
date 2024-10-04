import { scan } from "./index.ts";

let result = await scan({ kinds: [1] })
console.log(result)
