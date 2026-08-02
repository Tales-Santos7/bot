class TelegramService {
  async createInvite(bot, groupId) {
    const invite = await bot.telegram.createChatInviteLink(groupId, {
      member_limit: 1,
      creates_join_request: false,
    });

    return invite.invite_link;
  }
}

export default new TelegramService();
