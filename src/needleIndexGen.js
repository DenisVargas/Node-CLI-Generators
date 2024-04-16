#! /usr/bin/env node
const pug = require('pug');
const prettier = require('prettier');
const { program } = require("@caporal/core");
const { input, select, confirm } = require('@inquirer/prompts');
const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(__dirname, 'needleTemplate.pug'), 'utf8');

//Default values
let title = 'Experiencia inmersiva';
let seoDescription = 'Creado por Resonante';
let robotsPolicy = 'none';
let homeURL = 'https://resonante.one';
let googleAnalyticsID = 'UA-XXXXXXXXX-X';
let unityVersion = '2020.3.1f1';
let needleExporterVersion = '0.0.0';
let output = path.join(process.cwd(), '/out/index.html');

program
    .version('1.0.0')
    .help(`Hola! Que experiencia haremos hoy? 🍖`, { sectionName: "Welcome!" })
    .option('-t, --title <title>', title, {validator: program.STRING})
    .option('-d, --description <seoDescription>', seoDescription, { validator: program.STRING})
    .help(`Que descripcion quieres que tenga esta app en la web?`)
    .option('-o, --output <output>', output)
    .action(({ logger, options }) => {
        //Seteo output si es que existe como opcion
        if(options.output === undefined){
            logger.info(`\nSi no es especificado, por defecto el archivo se guardara en ${output}`);
        }
        if (options.output){
            output = options.output;
        }
        //Seto Title si es que existe como opcion
        if (options.title) {
            title = options.title;
        }
        //Seto SEO Description si es que existe como opcion
        if (options.description) {
            seoDescription = options.description;
        }
    });

program.run(process.argv.slice(2));

async function getAnswers(){
    //Signature for input = async function input(options: {message:string, default:string, transformer:(string, { isFinal: boolean }) => string, validate:string => boolean | string | Promise<string | boolean>}): Promise<string>;
    const resultTitle = await input({ message: 'Titulo de la pagina', default: title });
    const resultDescription = await input({ message: 'Descripción para SEO', default: seoDescription });
    const resultHomeURL = await input({ message: 'URL de la pagina principal', default: homeURL });
    const resultUnityVersion = await input({ message: 'Version de Unity', default: unityVersion });
    const resultNeedleExporterVersion = await input({ message: 'Version de Needle Engine Integration', default: needleExporterVersion });
    const resultGoogleAnalyticsID = await input({ message: 'ID de Google Analytics', default: googleAnalyticsID });
    //Signatura for select = await select({message:string, choices:Array<{ value: string, name?: string, description?: string, disabled?: boolean | string } | Separator>, pageSize:number, loop:boolean): Promise<string>});
    const resultRobotsPolicy = await select({ 
        message: 'Politica de robots',
        choices: [{value:'private'}, {value:'public'}],
    }).then((result) => { 
        console.log(result);
        return result === 'private' ? 'none' : 'index, follow';
    });

let summary = `

Titulo: ${resultTitle}
Descripcion para SEO: ${resultDescription}
URL de la pagina principal: ${resultHomeURL}
Version de Unity: ${resultUnityVersion}
Version de Needle Engine Integration: ${resultNeedleExporterVersion}
ID de Google Analytics: ${resultGoogleAnalyticsID}
Politica de robots: ${resultRobotsPolicy}`;

    //Signature of confirm = async function confirm(options: {message:string, default:boolean, transformer: (boolean) => string}): Promise<boolean>;
    const confirmation = await confirm({ message: `Resumen de los datos ingresados:\n${summary}\n\nEstos datos son correctos?`, default: true });
    if (confirmation) {
        
        let html = pug.render(template, {
            title: resultTitle,
            seoDescription: resultDescription,
            robotsPolicy: resultRobotsPolicy,
            homeURL: resultHomeURL,
            googleAnalyticsID: resultGoogleAnalyticsID,
            generators:`Unity ${unityVersion}, Needle Engine Integration ${needleExporterVersion}`,
            scriptSrc:`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsID}`,
            scriptContent:`window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${googleAnalyticsID}');`
        }, {pretty: true});

        const formattedHTML = await prettier.format(html, { parser: 'html' });

        //Escribir el archivo en output usando fs
        fs.writeFile(output, formattedHTML, function (err) {
            //TODO: Chequear que el output exista.
            if (err) return console.log(err);

            console.log(`Archivo ${output} creado!`);
        });
    } else {
        console.clear();
        console.log('Reiniciando...');
        getAnswers();
    }
}

getAnswers();
