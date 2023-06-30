const { Events } = require("discord.js")
import CustomClient from "../classes/CustomClient"

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: any, client: CustomClient) {
        if (!interaction.isChatInputCommand()) return;
        const cmd = client.commands.find(a => a.data.toJSON().name === interaction.commandName)

        if (!cmd) {
            client.logError(`Unknown command "${interaction.commandName}"`)
        }

        try {
            await cmd?.execute(interaction, client)
        } catch (err) {
            client.logError(`Unable to execute command: ${err}`)
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}