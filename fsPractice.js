const fs = require("fs");

const indexContent = `<!DOCTYPE html>
  
  <html lang="en">
  
    <head>
    
        <meta charset="UTF-8">
        
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <link rel="stylesheet" href="./css/style.css">
        
        <title>Document</title>
    
    </head>
    
    <body>
    
        <h1>Welcome</h1>
        
        <script src="./js/script.js"></script>
    
    </body>
    
  </html>`;

const cssContent = `h1 {
    text-align:center;
  }`;

const jsContent = `alert("Welcome");`;

const fontendScaffold = () => {
  try {
    // Create a folder
    fs.mkdirSync("frontend-scaffold");

    // create a html file inside the folder
    fs.writeFileSync("./frontend-scaffold/index.html", indexContent);

    // Create css folder
    fs.mkdirSync("frontend-scaffold/css");

    // create css file inside the folder
    fs.writeFileSync("./frontend-scaffold/css/style.css", cssContent);

    // Create javascript folder
    fs.mkdirSync("frontend-scaffold/js");

    // create javaScript file inside the folder
    fs.writeFileSync("./frontend-scaffold/js/script.js", jsContent);

    // create an images folder
    fs.mkdirSync("frontend-scaffold/images");

    console.log("Frontend scaffold created successfully!");
  } catch (error) {
    console.error(error);
  }
};

fontendScaffold();
