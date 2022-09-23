const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles the queue"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("0 songs in the queue")

		queue.shuffle()
        await interaction.editReply(`The queue of ${queue.tracks.length} songs has been shuffled!`)
	},
}