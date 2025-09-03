/**
 *  404: https://web.archive.org/web/20230324010551/https://discord.com/404
 * 2023: https://web.archive.org/web/20231231004523/https://discord.com/
 */

const chalk = require("chalk");
require("dotenv").config({ quiet: true, path: ".env.local" });

console.reset = () => process.stdout.write(`${"\n".repeat(process.stdout.rows)}\x1B[H`);

const fastify = require("fastify")();

fastify.register(require("@fastify/static"), {
    root: `${__dirname}/public`,
    prefix: "/public",
    maxAge: 7 * 24 * 60 * 60 * 1000
});

fastify.register(require("@fastify/static"), {
    root: `${__dirname}/dist/assets`,
    prefix: "/assets",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    decorateReply: false
});

fastify.register(require("@fastify/view"), {
    engine: {
        ejs: require("ejs")
    },
    root: `${__dirname}/views`
});

fastify.get("/", (req, res) => {
    res.view("index.ejs", { env: process.env });
});

fastify.get("/app", (req, res) => {
    res.sendFile("index.html", `${__dirname}/dist`);
});

fastify.get("/robots.txt", (req, res) => {
    res.send([
        "User-agent: *",
        "Disallow: /"
    ].join("\n"));
});

fastify.setNotFoundHandler((req, res) => {
    res.view("not-found.ejs", { env: process.env });
});

fastify.listen({ port: process.env.PORT }).then((address) => {
    const package = require("./package.json");
    console.reset();
    console.log(`\n  ${chalk.green(`${package.name.toUpperCase()} v${package.version}`)} ${chalk.gray("ready in")} ${Math.floor(process.uptime() * 1000)} ms\n\n  ${chalk.green("➜")}  Local: ${chalk.cyan(address)}\n`);
}).catch((err) => {
    console.error(err);
    process.exit(1);
});