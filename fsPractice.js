//To create a folder named "Frontend-scaffold"

const fs = require("fs");

fs.mkdir("frontend-scaffold",function(err){
        if(err){console.log(err);}

        // To create an index.html file inside frontend-scaffold
        fs.open("./frontend-scaffold/index.html", 'w',(err)=>{
                if(err){
                    console.log(err);
                }
            
                console.log("Index.html created successfully");
            })

        // To create css folder inside frontend-scaffold

        fs.mkdir("./frontend-scaffold/css",function(err){
                if(err){
                    console.log(err);
                }

                const content = "h1{text-align:center}";

        //To create style.css inside CSS Folder inisde rontend-scaffold

                fs.writeFile("./frontend-scaffold/css/style.css",content,function(err){
                            if(err){
                                console.log(err);
                            }

                             console.log("style.css created successfully");
                        })
                
                            console.log("Css folder created successfully");
                        })


        // To create a folder named js folder

        fs.mkdir("./frontend-scaffold/js",function(err){
            if(err){
                console.log(err);
            }
        
            console.log("js folder created successfully");

            // To create script.js inside js folder
    
            const contain = "alert(welcome)";
    
            fs.writeFile("./frontend-scaffold/js/script.js",contain,function(err){
                    if(err){
                        console.log(err);
                    }
                
                    console.log("script.js created successfully");
                })
        })


        // To create images folder

        fs.mkdir("./frontend-scaffold/images",function(err){
            if(err){
                console.log(err);
            }

            fs.open("./frontend-scaffold/images/.gitkeep","w",function(err){
                if(err){
                    console.log(err);
                }
            
                console.log("empty images file created successfully")
            })

            console.log("images folder created successfully");
        })
    
        console.log(" Frontend-Scaffold Folder created successfully");
    })