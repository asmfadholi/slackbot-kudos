interface DeleteAllChatsProps {
    messages: { ts?: string }[];
    channel: string;
    chatDelete: (props: { ts: string, channel: string }) => Promise<unknown>;
}

const deleteAllChats = async ({ messages, channel, chatDelete }: DeleteAllChatsProps) => {
    const getAllData = messages?.map((each) => {
        return chatDelete({ channel, ts: each.ts || '' });
    }) || [];

    await Promise.all(getAllData);
}

export { deleteAllChats };

// example: await deleteAllChats({ channel: body.event.channel, messages: result?.messages || [], chatDelete: client.chat.delete })