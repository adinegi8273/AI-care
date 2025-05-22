const http = require("http");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const querystring = require("querystring");
const { spawn } = require("child_process");


// MongoDB Schema & Model
const userSchema = new mongoose.Schema({ username: String, password: String });
const userModel = mongoose.model("Users", userSchema, "Users");

// Helper to serve HTML file
function sendHtmlFile(response, filePath) {
    fs.readFile(filePath, "utf8", (error, data) => {
        if (error) {
            response.statusCode = 500;
            response.setHeader("Content-Type", "text/plain");
            response.end("Internal Server Error");
        } else {
            response.setHeader("Content-Type", "text/html");
            response.end(data);
        }
    });
}

// Main server logic
function startServing(request, response) {
    console.log("Request received:", request.url);

    if (request.url === "/" && request.method === "GET") {
        sendHtmlFile(response, "new.html");
    }

    else if (request.url.startsWith("/login") && request.method === "POST") {
        let body = "";

        request.on("data", chunk => {
            body += chunk;
        });

        request.on("end", () => {
            const q = querystring.parse(body);
            const { username, password } = q;
            console.log(username);
            console.log(password);
            mongoose.connect("mongodb://localhost/db")
                .then(() => userModel.findOne({ username, password }))
                .then(user => {
                    if (user) {
                        console.log("Login successful");
                        sendHtmlFile(response, "new.html");
                    } else {
                        console.log("Invalid credentials");
                        response.end("Invalid credentials");
                    }
                })
                .catch(error => {
                    console.error("Login error:", error);
                    response.statusCode = 500;
                    response.end("Server error during login");
                })
                .finally(() => {
                    mongoose.disconnect();
                });
        });
    }

    else if (request.url.startsWith("/register") && request.method === "POST") {
        let body = "";

        request.on("data", chunk => {
            body += chunk;
        });

        request.on("end", () => {
            const q = querystring.parse(body);
            const { username, password } = q;

            mongoose.connect("mongodb://localhost/db")
                .then(() => {
                    const newUser = new userModel({ username, password });
                    return newUser.save();
                })
                .then(() => {
                    console.log("Registration successful");
                    sendHtmlFile(response, "new.html");
                })
                .catch(error => {
                    console.error("Registration error:", error);
                    response.statusCode = 500;
                    response.end("Server error during registration");
                })
                .finally(() => {
                    mongoose.disconnect();
                });
        });
    }
    else if (request.url.startsWith("/assets/")) {
            const filePath = path.join(__dirname, request.url);
            fs.readFile(filePath, (err, data) => {
            if (err) {
                response.statusCode = 404;
                response.end("Asset not found");
            }   else {
                const ext = path.extname(filePath);
                const contentType = {
                    ".css": "text/css"
                }[ext] || "application/octet-stream";

                response.setHeader("Content-Type", contentType);
                response.end(data);
            }
        });
    }
    else if (request.method === "GET" && request.url.endsWith(".html")) {
            const filePath = path.join(__dirname, request.url);

            fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                response.statusCode = 404;
                response.end("HTML file not found");
            } else {
                response.setHeader("Content-Type", "text/html");
                response.end(data);
            }
        });
    }
    else {
        response.statusCode = 404;
        response.end("Not Found");
    }
}

// Start the server
const server = http.createServer(startServing);

function startListener() {
    return new Promise((resolve) => {
        console.log("Initiating listener...");
        resolve();
    });
}

server.listen(7070, () => {
    startListener()
        .then(() => {
            console.log("Server is listening on port 7070");

            // Spawn a child process to run your app.py
            const pythonProcess = spawn("python", ["app.py"]);

            pythonProcess.stdout.on("data", (data) => {
                console.log(`app.py stdout: ${data}`);
            });

            pythonProcess.stderr.on("data", (data) => {
                console.error(`app.py stderr: ${data}`);
            });

            pythonProcess.on("close", (code) => {
                console.log(`app.py process exited with code ${code}`);
            });
        })
        .catch((error) => {
            console.error("Listener start error:", error);
        });
});