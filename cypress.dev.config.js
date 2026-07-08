const { defineConfig } = require("cypress");

module.exports = defineConfig({
  
  env: {
    //ejecutar en la terminal --> npx cypress open --config-file cypress.dev.config.js
    //este archivo fue creado para probar una forma de configurar variables de entorno
    //renomabrar/borrar el archivo cypress.env.json porque se interpone 
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

  viewportWidth: 1280,
  viewportHeight: 720
});