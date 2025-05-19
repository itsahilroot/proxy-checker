const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");

// Home page
app.get("/", (req, res) => {
    res.render("index");
});

// AJAX POST handler
app.post("/ajax-test", async (req, res) => {
    const { proxy, url } = req.body;

    let [host, port, user, pass] = ["", "", null, null];
    if (proxy.includes("@")) {
        const [auth, ip] = proxy.split("@");
        [user, pass] = auth.split(":");
        [host, port] = ip.split(":");
    } else {
        [host, port] = proxy.split(":");
    }

    try {
        const start = Date.now();

        const response = await axios.get(url, {
            proxy: {
                host,
                port: parseInt(port),
                protocol: "http",
                ...(user && pass ? { auth: { username: user, password: pass } } : {})
            },
            timeout: 10000,
        });

        const elapsed = Date.now() - start;

const sanitizeHtml = (html) => {
    return html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
};

// Inside your app.post('/ajax-test', ...) before `res.json`
const cleanedHtml = typeof response.data === "string"
    ? sanitizeHtml(response.data)
    : JSON.stringify(response.data);

res.json({
    status: response.status,
    time: elapsed,
    html: cleanedHtml,
});


    } catch (error) {
        res.json({
            status: error.response?.status || "Connection Failed",
            time: "-",
            html: error.message,
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Proxy Tester running at http://localhost:${port}`);
});
