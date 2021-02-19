//https://deividfortuna.github.io/fipe/

const marcaDesejada = ``.replace(/\n/g,'|');
const modeloDesejado = ``.replace(/\n/g,'|');

// ---------------------------------------------------------------------------

const fetch = require("node-fetch");
const write = require('write');
const insertLine = require('insert-line');

let marcasObj = {};
let modelosObj = {};
let anosObj = {};

async function listarCarros() {
    console.clear();

    write.sync('listarCarros.txt', 'MARCA;MODELO;ANO', { newline: true });

    await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas')
        .then(function (res) {
            return res.json();
        }).then(function (marcas) {

            switch (marcaDesejada) {
                case '':
                    // Para selecioar todas as marcas:
                    marcasObj = marcas;
                    break;
                default:
                    // Para selecionar uma marca específica:
                    marcasObj = [];
                    marcasObj.push(marcas.filter(function (element) {
                        return element.nome.match(new RegExp(marcaDesejada,'i'));
                    }));
                    marcasObj = marcasObj[0];
                    break;

            }

            for (const key1 in marcasObj) {
                if (Object.hasOwnProperty.call(marcasObj, key1)) {
                    const element1 = marcasObj[key1];

                    (async () => {
                        await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas/' + element1.codigo + '/modelos')
                            .then(function (res) {
                                return res.json();
                            }).then(function (modelos) {

                                switch (modeloDesejado) {
                                    case '':
                                        // Para selecioar todas os modelos:
                                        modelosObj = modelos.modelos;
                                        break;
                                    default:
                                        // Para selecionar uma modelo específico:
                                        modelosObj = [];
                                        modelosObj.push(modelos.modelos.filter(function (element) {
                                            return element.nome.match(new RegExp(modeloDesejado,'i'));
                                        }));
                                        modelosObj = modelosObj[0];
                                        break;
                                }

                                for (const key2 in modelosObj) {
                                    if (Object.hasOwnProperty.call(modelosObj, key2)) {
                                        const element2 = modelosObj[key2];

                                        (async () => {
                                            await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas/' + element1.codigo + '/modelos/' + element2.codigo + '/anos')
                                                .then(function (res) {
                                                    return res.json();
                                                }).then(function (anos) {
                                                    anosObj = anos;

                                                    let time = new Date().getTime();
                                                    while ((new Date().getTime() - time) <= 4000) { }

                                                    for (const key3 in anosObj) {
                                                        if (Object.hasOwnProperty.call(anosObj, key3)) {
                                                            const element3 = anosObj[key3];

                                                            insertLine('./listarCarros.txt').appendSync(element1.nome + ';' + element2.nome + ';' + element3.nome);

                                                            console.log(element1.nome + ';' + element2.nome + ';' + element3.nome)

                                                        }
                                                    }
                                                }).catch(function (err) {
                                                    console.log(err)
                                                    insertLine('./listarCarros.txt').appendSync(element1.nome + ';' + element2.nome + ';' + 'ERRO');
                                                })
                                        })()
                                    }
                                }
                            }).catch(function (err) {
                                console.log(err)
                                insertLine('./listarCarros.txt').appendSync(element1.nome + ';' + 'ERRO');
                            })
                    })()

                }
            }
        }).catch(function (err) {
            console.log(err)
            insertLine('./listarCarros.txt').appendSync('ERRO');
        })
}

listarCarros();