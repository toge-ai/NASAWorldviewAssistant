'use client';

import React from 'react';

export type AgentEvent = { messages: any[]; output: string; images_output: any[] };

export type PreviewPaneProps = {
	data: AgentEvent | null;
	done: boolean;
	messages: { type: 'human' | 'ai' | 'system'; content: string }[];
};

export function PreviewPane({ data, done, messages }: PreviewPaneProps) {
	return (
		<div className="flex h-full flex-col overflow-hidden border-l border-[#223048] bg-[#0f1622]">
			<div className="border-b border-[#223048] px-4 py-3">
				<div className="text-[18px] font-semibold text-[#e5e7eb]">Preview</div>
			</div>
			<div className="min-h-0 flex-1 overflow-y-auto p-4 text-sm text-[#cbd5e1]">
				<p className="leading-6">
					Current mission status: Nominal. All systems are functioning within expected parameters. Weather
					conditions are favorable for launch.
				</p>
				<div className="mt-6">
					<div className="text-[15px] font-semibold text-[#e5e7eb]">Mission Objectives</div>
					<ul className="mt-3 space-y-3">
						{['Deploy satellite', 'Conduct experiments', 'Return safely'].map((label) => (
							<li key={label} className="flex items-center gap-3">
								<span className="inline-block h-4 w-4 rounded border border-[#344256] bg-transparent" aria-hidden />
								<span>{label}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default PreviewPane;


