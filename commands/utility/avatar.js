const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Avatar')
        .addUserOption(option => option.setName('username').setDescription('@Username')),
    async execute(interaction) {
        const user = interaction.options.getUser('username') || interaction.user;
		const member = await interaction.guild.members.fetch(user.id);
		const global = user.displayAvatarURL({ dynamic: true, size: 1024 });
		const guild = member.avatarURL({ dynamic: true, size: 1024 });

        const globalAvatarEmbed = new EmbedBuilder()
            .setColor(0x81A5F9)
            .setTitle(`${user.username}'s Avatar`)
            .setImage(global);

        await interaction.reply({ embeds: [globalAvatarEmbed] });

		if (guild) {
			const guildAvatarEmbed = new EmbedBuilder()
				.setColor(0x81A5F9)
				.setTitle(`${user.username}'s Avatar`)
				.setImage(guild);

			await interaction.channel.send({ embeds: [guildAvatarEmbed] });
		}
    },
};
