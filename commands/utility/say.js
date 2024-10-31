const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Send message as Shiro')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption(option =>
            option.setName('message')
            .setDescription('Message')
                .setRequired(true)),
    async execute(interaction) {
        const messageContent = interaction.options.getString('message').trim();
        await interaction.deferReply({ ephemeral: true });
        await interaction.channel.send(messageContent);
        await interaction.deleteReply();
    },
};