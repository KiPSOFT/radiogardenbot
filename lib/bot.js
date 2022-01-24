const { Telegraf } = require('telegraf');

const commandType = {
    Search: 'search'
};    

class Bot extends Telegraf {    

    constructor(commands) {
        super(process.env.RGBOT_TOKEN);
        const self = this;
        self.commands = commands;
        self.start(self.commands.start);
        self.command(commandType.Search);
        self.action(/listen_+/, self.commands.listen);
        if (process.env.RGBOT_DEBUG === 'true') {
            console.log('Debug mode on.');
            self.launch();
        } else {
            self.launch({
                webhook: {
                    domain: 'radiogardenbot.herokuapp.com',
                    hookPath: '/' + process.env.RGBOT_TOKEN,
                    port: process.env.PORT
                }
            });
        }
     }

    command(cmdType) {
        const self = this;
        super.command(cmdType, async(ctx) => {
            const params = ctx.message.text.split(' ');
            switch (cmdType) {
                case commandType.Search:
                    self.commands.search(ctx);
                    break;
            }
        });
    }

}

module.exports = Bot;
