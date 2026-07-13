export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  // Basic markdown parser for italics and links
  const createMarkup = (text) => {
    let formatted = text
      .replace(/_(.*?)_/g, '<i>$1</i>')
      .replace(/\n/g, '<br>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-primary underline break-all">$1</a>');
    return { __html: formatted };
  };

  if (isUser) {
    return (
      <div className="flex justify-end animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-surface-container-high px-space-lg py-space-md rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
          <p className="font-body-lg text-body-lg text-on-surface">{message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant Message
  return (
    <div className="flex justify-start gap-space-md animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex-none h-8 w-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
        <span className="material-symbols-outlined text-[18px]">smart_toy</span>
      </div>
      <div className="flex-1 space-y-space-md">
        <div className="bg-surface-container-lowest border border-outline-variant/30 px-space-lg py-space-md rounded-2xl rounded-tl-none shadow-sm">
          {message.isLoading ? (
            <span className="loading-dots text-md font-body-lg text-on-surface">Typing</span>
          ) : (
            <p className="font-body-lg text-body-lg text-on-surface" dangerouslySetInnerHTML={createMarkup(message.content)} />
          )}
        </div>
      </div>
    </div>
  );
}
