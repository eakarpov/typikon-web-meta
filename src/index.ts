import express, {Response, Request} from "express";
import dotenv from "dotenv";
import {getMeta} from "./meta";
import * as path from "path";
import cors, {CorsOptions, CorsRequest} from "cors";

dotenv.config({ path: path.resolve(
    __dirname,
        process.env.NODE_ENV === "production" ? "../.env.production" : "../.env.development"
    )
});

const app = express();

const allowlist = [`https://${process.env.TYPIKON_WEB}`, `https://www.${process.env.TYPIKON_WEB}`];

const corsOptionsDelegate = function (req: cors.CorsRequest, callback: (err: Error | null, options?: CorsOptions) => void) {
    let corsOptions;
    if (allowlist.indexOf(req.headers.origin || "") !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(process.env.NODE_ENV === "production" ? corsOptionsDelegate : {}));

app.get('/meta', async (req: Request, res: Response) => {
    const [meta, error] = await getMeta();
    if (error) {
        res.sendStatus(400);
    } else {
        res.send(meta)
    }
});

app.listen(process.env.PORT);
