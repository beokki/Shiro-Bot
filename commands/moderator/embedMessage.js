const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Create embed messages')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('fields')
                .setDescription('Fields, separated by "//" and using "|" to separate title and value.')
                .setRequired(false))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel')
                .addChannelTypes(ChannelType.GuildText))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('Image')
                .setRequired(false)),
    async execute(interaction) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const fieldsInput = interaction.options.getString('fields');
        const image = interaction.options.getString('image');
        const channel = interaction.options.getChannel('channel') || interaction.channel;

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(0xFFFFFF);

        if (fieldsInput) {
            const fieldsArray = fieldsInput.split('//').map(field => {
                const [title, value] = field.split('|').map(elem => elem.trim());
                return { name: title, value: value };
            });

            for (const field of fieldsArray) {
                embed.addFields({ name: field.name, value: field.value });
            }
        }

        if (image) {
            embed.setImage(image);
        }

        channel.send({ embeds: [embed] })
            .then(() => interaction.reply({ content: `Embed sent to #${channel.name}`, ephemeral: true }))
            .catch(error => {
                console.error(error);
                interaction.reply({ content: 'Error', ephemeral: true });
            });
    },
};
