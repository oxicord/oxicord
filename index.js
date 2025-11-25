/**
 *  404: https://web.archive.org/web/20230324010551/https://discord.com/404
 * 2023: https://web.archive.org/web/20231231004523/https://discord.com/
 */

const chalk = require("chalk");
require("dotenv").config({ quiet: true });

console.reset = () => process.stdout.write(`${"\n".repeat(process.stdout.rows)}\x1B[H`);

const fastify = require("fastify")();

fastify.register(require("@fastify/static"), {
    root: `${__dirname}/public`,
    prefix: "/public",
    maxAge: 60 * 60 * 1000
});

fastify.register(require("@fastify/static"), {
    root: `${__dirname}/dist/assets`,
    prefix: "/assets",
    maxAge: 60 * 60 * 1000,
    decorateReply: false
});

fastify.register(require("@fastify/static"), {
    root: `${__dirname}/dist/img`,
    prefix: "/img",
    maxAge: 60 * 60 * 1000,
    decorateReply: false
});

fastify.register(require("@fastify/static"), {
    root: `${__dirname}/dist/videos`,
    prefix: "/videos",
    maxAge: 60 * 60 * 1000,
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

// SPA Routes - Serve index.html for these routes to let client-side router handle them
[
    "/app",
    "/login",
    "/register",
    "/channels",
    "/channels/*",
    "/store",
    "/nitro",
    "/invite/*",
    "/verify",
    "/reset"
].forEach(route => {
    fastify.get(route, (req, res) => {
        res.sendFile("index.html", `${__dirname}/dist`);
    });
});

// Serve root static files from dist
fastify.get("/sw.js", (req, res) => res.sendFile("sw.js", `${__dirname}/dist`));
fastify.get("/manifest.webmanifest", (req, res) => res.sendFile("manifest.webmanifest", `${__dirname}/dist`));
fastify.get(/^\/workbox-[a-zA-Z0-9]+\.js$/, (req, res) => {
    const filename = req.url.split('?')[0].slice(1);
    res.sendFile(filename, `${__dirname}/dist`);
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