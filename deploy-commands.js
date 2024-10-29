const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`Command at ${filePath} is missing a required property.`);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Refreshing ${commands.length} slash commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

        // for global
        // await rest.put(
        //     Routes.applicationCommands(clientId),
        //     { body: commands },
        // );

        // //for guild-based commands
        // rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
        // .then(() => console.log('Successfully deleted all guild commands.'))
        // .catch(console.error);

        // //for global commands
        // rest.put(Routes.applicationCommands(clientId), { body: [] })
        // .then(() => console.log('Successfully deleted all application commands.'))
        // .catch(console.error);

		console.log(`Reloaded ${data.length} slash commands.`);
	} catch (error) {
		console.error(error);
	}
})();