'use client';

import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export type ChatMessage = { type: 'human' | 'ai' | 'system'; content: string };

export type ChatMessageListProps = {
	messages: ChatMessage[];
	streamingText?: string | null;
};

export function ChatMessageList({ messages, streamingText }: ChatMessageListProps) {
	const endRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
	}, [messages, streamingText]);

	return (
		<div className="space-y-4" aria-live="polite" role="log">
			{messages.map((m, i) => (
				<MessageBubble key={i} role={m.type} content={m.content} />
			))}
			{streamingText ? (
				<div className="space-y-2">
					<MessageBubble role="ai" content={streamingText} />
					<div className="pl-11 text-left">
						<div className="typing-dots" aria-hidden>
							<span></span><span></span><span></span>
						</div>
					</div>
				</div>
			) : null}
			<div ref={endRef} />
		</div>
	);
}

export default ChatMessageList;


