const { Client } = require('@notionhq/client');
require('dotenv').config();

const axios = require('axios');
const notion = new Client({auth: process.env.NOTION_KEY})

let countriesArray = [];

async function getCountries() {
    await axios.get('https://restcountries.com/v3.1/all').then((resp) => {

        resp.data.forEach((country) => {
            countriesArray.push({
                name: country.translations.por.common,
                flag: country.flags.png,
                region: country.region
            })
        })

        console.log(`mandei ${countriesArray.length} países`)
    }).catch((err) => {
        console.log("error: ", err)
    })
    
    createNotionPage()
}

getCountries()

async function createNotionPage() {

    for (let country of countriesArray) {
        const response = await notion.pages.create({
            parent: {
                type: "database_id",
                database_id: process.env.NOTION_DATABASE_ID
            },
            cover: {
                type: "external",
                external: {
                    url: country.flag
                }
            },
            icon: {
                type: "external",
                external: {
                    url: country.flag
                }
            },
            properties: {
                "Nome": {
                    title: [
                        {
                            type: "text",
                            text: {
                                content: country.name
                            }
                        }
                    ]
                },
                "Já fui": {
                    checkbox: false
                },
                "Região": {
                    select: {
                        "name": country.region
                    }
                }
            }
        })

    }
}