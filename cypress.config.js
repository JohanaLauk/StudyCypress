const { defineConfig } = require("cypress");

module.exports = defineConfig({
  //allowCypressEnv: false,

  //(antes de ejecutar el js) Settings > Project settings > Resolved configuration > env 
  env: {  //cuenta real
    username: 'johana.e.lauk@gmail.com',
    password: 'jLcypress',
    apiUrl: 'https://conduit-api.bondaracademy.com/api'
  },

  
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  

  e2e: {
    //baseUrl: 'https://playground.bondaracademy.com/',
    baseUrl: 'https://conduit.bondaracademy.com/',


    setupNodeEvents(on, config) {
      //se usa para los reportes 
      //https://www.npmjs.com/package/cypress-mochawesome-reporter
      require('cypress-mochawesome-reporter/plugin')(on);

      // implement node event listeners here
      //esta es una forma de configurar variables de entorno
      //esto se usa en package.json:
      config.env.username = process.env.USER_NAME,
      config.env.password = process.env.PASSWORD
      return config;
    },

    retries: {
      openMode: 1,  //Se usa cuando abrís Cypress con la interfaz gráfica (ventana donde elegís el navegador y hacés clic en un test). Ejemplo: npx cypress open | rpm run cy_run_qa
      runMode: 1    //Se usa cuando ejecutás Cypress sin interfaz (no aparece ninguna ventana). npx cypress run. O en un pipeline de CI/CD como GitHub Actions, GitLab CI, Azure DevOps, Jenkins, etc.
    }
  },

  viewportWidth: 1280,
  viewportHeight: 720
});


/*
FORMAS DE CONFIGURAR VARIABLES DE ENTORNO

(1) configurar en cypress.config.js:
env: {  //cuenta real
    username: 'johana.e.lauk@gmail.com',
    password: 'jLcypress',
    apiUrl: 'https://conduit-api.bondaracademy.com/api'
  },
setupNodeEvents(on, config) {      
},
ejecutar --> npx cypress open --config-file cypress.dev.config.js
resultado --> Settings > Project settings > Resolved configuration > env --> johana.e.lauk@gmail.com / jLcypress / https://conduit-api.bondaracademy.com/api


(2) crear archivo cypress.env.json:
{
    "username": "johalauk7-ENV@gmail.com"
}
ejecutar --> npx cypress open
resultado --> ... > env --> johalauk7-ENV@gmail.com / jLcypress / https://conduit-api.bondaracademy.com/api


(3) pasar variables de entorno a traves de lineas de comandos
ejecutar --> npx cypress open --env username="hello@test.com", password="123"
resultado --> ... > env --> hello@test.com / 123 / https://conduit-api.bondaracademy.com/api


(3B) configurar package.json:
"cy_run_dev": "npx cypress open --env username='helloDEV@test.com', password='123dev'",
"cy_run_qa": "npx cypress open --env username='helloQA@test.com',password='321qa'"
ejecutar --> npm run cy_run_qa
resultado --> ... > env --> [NO ANDA]
Cypress encountered an error while parsing the argument: --env
You passed: username='helloDEV@test.com',
The error was: Cannot parse as valid JSON


(3C) configurar package.json:
"cy_run_qa": "npx cypress open --env username=$USER_NAME, password=$PASSWORD"

>configurar en cypress.config.js:
e2e: {
    baseUrl: 'https://conduit.bondaracademy.com/',

    setupNodeEvents(on, config) {
      config.env.username = process.env.USER_NAME,
      config.env.password = process.env.PASSWORD
      return config;
    },
  },

ejecutar -->  $env:USER_NAME="TEST@TEST.COM"
              $env:PASSWORD="123qa"
              npm run cy_run_qa
//nota: USER_NAME='TEST@TEST.COM' PASSWORD='123qa' npm run cy_run_qa	--no anda para win con powerShell
cambiar nombre del archivo cypress.env.json a cypress.env.test.json para que no intervenga por prioridad

resultado --> ... > env --> TEST@TEST.com / 123qa / https://conduit-api.bondaracademy.com/api


(4) crear cypress.dev.config.js:
env: {
    username: 'johana-DEV@test.com',
    password: 'testDEV',
    apiUrl: 'https://conduit-api.bondaracademy.com/api'
  },
e2e: {
    baseUrl: 'https://conduit.bondaracademy.com/',
    setupNodeEvents(on, config) {
        return config;
    },
  },
ejecutar --> npx cypress open --config-file cypress.dev.config.js
resultado --> ... > env --> johana-DEV@test.com / testDEV / https://conduit-api.bondaracademy.com/api

*/