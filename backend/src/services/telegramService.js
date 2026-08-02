class TelegramService {
  async createInvite(bot, groupId) {
    const invite = await telegramService.createInvite(bot, order.groupId);

    console.log(invite);

    return invite.invite_link;
  }
}

export default new TelegramService();
