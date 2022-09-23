const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the music"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("0 songs in the queue")

		queue.setPaused(false)
        await interaction.editReply("Music resumed! Use `/pause` to pause the music")
	},
}