const axios = require('axios');
const { Markup } = require('telegraf');

class Commands {    
    start(ctx) {
        ctx.reply('Welcome to radio.garden unofficial bot! Please send to me; /search command. Example /search izmir');
    }

    async search(ctx) {
        const params = ctx.message.text.split(' ');
        try {
            const search = await axios.get(`https://radio.garden/api/search\?q\=${params[1]}`);
            const res = search.data.hits.hits.filter(itm => itm._source.type === 'channel');
            const buttons = [];
            for (let r of res) {
                const code = r._source.url.split('/')[3];
                buttons.push(Markup.button.callback(r._source.title, 'listen_' + code));
            }
            ctx.replyWithHTML('<b>Search results;</b>', Markup.inlineKeyboard(buttons));
        } catch (err) {
            console.log('search', err.message);
            ctx.reply('Incorrect search term.');
        }
    }

    async listen(ctx) {
        try {
            const code = ctx.match.input.split('_')[1];
            const url = `https://radio.garden/api/ara/content/listen/${code}/channel.mp3?${Date.now()}`;
            console.log('Listening url;', url);
            await axios.get(url, {
                maxRedirects: 0
            });
        } catch (err) {
            if (err.response && err.response.status === 302) {
                ctx.reply('📻 ', Markup.inlineKeyboard([
                    Markup.button.url('Listen', err.response.headers.location)
                ]));
            } else {
                ctx.reply('Houston, I have a problem.');
                console.log('listen', err.message);
            }
        }
    }
}

module.exports = Commands;