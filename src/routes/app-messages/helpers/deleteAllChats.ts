interface DeleteAllChatsProps {
    messages: { ts?: string,  bot_id?: string }[];
    channel: string;
    chatDelete: (props: { ts: string, channel: string, bot_id?: string }) => Promise<unknown>;
}

const deleteAllChats = async ({ messages, channel, chatDelete }: DeleteAllChatsProps) => {
    const messagesBot = messages.filter(each => each?.bot_id);
    const getAllData = messagesBot?.map((each) => {
        return chatDelete({ channel, ts: each.ts || '' });
    }) || [];

    await Promise.all(getAllData);
}

export { deleteAllChats };

// example: await deleteAllChats({ channel: body.event.channel, messages: result?.messages || [], chatDelete: client.chat.delete })