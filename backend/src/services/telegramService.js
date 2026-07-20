class TelegramService {

    async createInvite(bot) {

        const invite = await bot.telegram.createChatInviteLink(

            process.env.VIP_GROUP_ID,

            {

                member_limit: 1,

                creates_join_request: false

            }

        );

        return invite.invite_link;

    }

}

export default new TelegramService();