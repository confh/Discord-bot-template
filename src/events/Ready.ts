const { Events } = require('discord.js')
import CustomClient from "../classes/CustomClient"

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client: CustomClient) {
        client.logInfo("Client loaded.")
        client.logInfo("Starting to fetch members...")
        for (let i = 0; i < client.guilds.cache.size; i++) {
            await client.guilds.cache.at(i)?.members.fetch()
        }
        client.logInfo("Finished fetcing members.")
    }
}