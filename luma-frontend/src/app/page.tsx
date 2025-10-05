'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAgentSSE, type AgentEvent } from '@/hooks/useAgentSSE';
import { appendMessage, loadHistory } from '@/lib/history';
import { ChatMessageList } from '@/components/ChatMessageList';
import PreviewPane from '@/components/PreviewPane';
import Logo from '@/components/Logo';

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("thread_id") || crypto.randomUUID();
    localStorage.setItem("thread_id", saved);
    setThreadId(saved);
  }, []);

  const { data, done, cancel } = useAgentSSE(submitted ?? "", threadId);

  const [cachedMessages, setCachedMessages] = useState<AgentEvent["messages"]>([]);
  useEffect(() => {
    if (!threadId) return;
    setCachedMessages(loadHistory(threadId));
  }, [threadId]);

  useEffect(() => {
    if (done && threadId) {
      const final = data?.output ?? "";
      if (final) {
        const next = appendMessage(threadId, { type: 'ai', content: final });
        setCachedMessages(next);
      }
      setIsSending(false);
    }
  }, [done, data, threadId]);

  const onSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || !threadId) return;
    const next = appendMessage(threadId, { type: 'human', content: trimmed });
    setCachedMessages(next);
    setSubmitted(trimmed);
    setInputValue("");
    setIsSending(true);
    // refocus for quick follow-ups
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  
  const messages = useMemo(() => cachedMessages, [cachedMessages]);
  const streamingText = !done ? (data?.output ?? null) : null;

  return (
    <div className="flex h-svh w-full min-w-0 bg-[#0b1220] text-white">
      {/* Left sidebar: Chats */}
      <aside className="hidden shrink-0 md:block md:w-[320px] min-h-0 border-r border-[#223048] bg-[#0f1622]">
        <div className="border-b border-[#223048] px-4 py-3 text-[20px] font-semibold">Chats</div>
        <div className="min-h-0 overflow-y-auto p-2">
          {[
            { name: 'Mission Control', sub: '10:30 AM', active: true },
            { name: 'Space Station Alpha', sub: 'Yesterday' },
            { name: 'Mars Rover Team', sub: '2 days ago' },
            { name: 'Lunar Base Crew', sub: '3 days ago' },
          ].map((c, i) => (
            <button
              key={i}
              className={
                'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left ' +
                (c.active ? 'bg-[#132033]' : 'hover:bg-[#111a2a]')
              }
            >
              <span className="inline-block h-10 w-10 rounded-full bg-[#23314a]" aria-hidden />
              <span className="flex-1 min-w-0">
                <div className="truncate text-[15px]">{c.name}</div>
                <div className="text-xs text-[#9aa4b2]">{c.sub}</div>
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Center column: Chat */}
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-[#223048] px-5 py-3 text-[20px] font-semibold">Mission Control</div>
        {/* Messages area */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-[#0b1220] px-6 py-6">
          <div className="mx-auto max-w-3xl">
            <ChatMessageList messages={messages as any} streamingText={streamingText} />
          </div>
        </div>
        {/* Composer */}
        <div className="border-t border-[#223048] bg-[#0f1622] px-4 py-3">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#23314a]" aria-hidden />
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[#2a3a56] bg-[#0b1220] px-3 py-2">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="max-h-32 w-full resize-none bg-transparent text-[14px] placeholder:text-[#6b7280] outline-none"
              />
              <button className="rounded p-1 text-[#9aa4b2] hover:text-[#cbd5e1]" aria-label="Attach image">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5a2 2 0 0 0-2-2H5C3.9 3 3 3.9 3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM5 5h14v8l-3.5-3.5-4.5 4.5-2-2L5 16V5z"/></svg>
              </button>
            </div>
            <button
              onClick={onSend}
              disabled={!inputValue.trim()}
              className="rounded-full bg-[#1d71f2] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </section>

      {/* Right sidebar: Preview */}
      <aside className="hidden min-h-0 shrink-0 md:block md:w-[360px]">
        <PreviewPane data={data} done={!!done} messages={messages as any} />
      </aside>
    </div>
  );
}