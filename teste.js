const fetch = require("node-fetch");

fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas/59/modelos/5940/anos')
    .then(function(res){
        return res.json();
    }).then(function(anos){
        for (const key in anos) {
            if (Object.hasOwnProperty.call(anos, key)) {
                const element = anos[key];
                console.log(element.codigo,'aaaaaa')
                
            }
        }
    })