const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prune')
        .setDescription('Prine and keep Pinned messages')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0 || amount > 100) {
            return interaction.reply({ content: 'You can only prune between 1 and 100 messages.', ephemeral: true });
        }

        interaction.channel.messages.fetch({ limit: amount })
            .then(messages => {
                const filteredMessages = messages.filter(m => !m.pinned && Date.now() - m.createdTimestamp < 1209600000);

                interaction.channel.bulkDelete(filteredMessages, true)
                    .then(deletedMessages => interaction.reply({ content: `Deleted ${deletedMessages.size} messages.`, ephemeral: true }))
                    .catch(error => {
                        console.error(error);
                        interaction.reply({ content: 'Error', ephemeral: true });
                    });
            })
            .catch(console.error);
    },
};
