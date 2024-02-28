const { Events } = require('discord.js')
import CustomClient from "../classes/CustomClient"

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client: CustomClient) {
        client.logInfo("Client loaded.")
        client.logInfo("Starting to fetch members...")
        await client.guilds.cache.forEach(async guild => {
            await guild.members.fetch()
        })
        client.logInfo("Finished fetcing members.")
    }
}