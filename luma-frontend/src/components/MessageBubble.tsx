'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type MessageBubbleProps = {
	role: 'human' | 'ai' | 'system';
	content: string;
};

export function MessageBubble({ role, content }: MessageBubbleProps) {
	const isHuman = role === 'human';
	const alignmentClass = isHuman ? 'justify-end' : 'justify-start';
	// Dark style to match screenshot: human = bright blue; ai/system = slate gray
	const bubbleClass = isHuman
		? 'bg-[#1d71f2] text-white'
		: role === 'system'
		? 'bg-[#2a3441] text-[#e5e7eb] border border-[#3a4452]'
		: 'bg-[#2a3441] text-[#e5e7eb] border border-[#3a4452]';

	const avatar = (
		<div
			className={
				'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ' +
				(isHuman ? 'bg-[#1d71f2] text-white' : 'bg-[#0f1720] text-[#9aa4b2] border border-[#253043]')
			}
			aria-hidden
		>
			{isHuman ? 'You' : role === 'system' ? 'Sys' : 'AI'}
		</div>
	);

	return (
		<div className={'flex gap-3 py-1 ' + alignmentClass}>
			{!isHuman ? avatar : <div className="w-8" />}
			<div className={
				'inline-block max-w-[72ch] rounded-2xl px-4 py-3 align-top whitespace-pre-wrap shadow-sm ' +
				bubbleClass
			}>
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					components={{
					code: ({ node, className, children, ...props }) => (
							<code
								className={'rounded bg-black/10 px-1 py-0.5 text-[0.9em] ' + (className || '')}
								{...props}
							>
								{children}
							</code>
						),
						pre: ({ children }) => (
						<pre className="overflow-auto rounded-lg border border-[#3a4452] bg-[#0b0f17] text-[#e5e7eb] p-3">
								{children}
							</pre>
						),
					p: ({ children }) => <p className="leading-7">{children}</p>,
						ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
						ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
					a: ({ href, children }) => (
						<a className="text-[#60a5fa] underline break-words" href={href} target="_blank" rel="noreferrer noopener">
								{children}
							</a>
						),
					}}
				>
					{content}
				</ReactMarkdown>
			</div>
			{isHuman ? avatar : <div className="w-8" />}
		</div>
	);
}

export default MessageBubble;


