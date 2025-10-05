'use client';

import React from 'react';

export function Logo() {
	return (
		<div className="flex items-center gap-2 select-none">
			{/* Replace this with your own brand mark/image if available */}
			<div className="h-7 w-7 rounded-xl bg-gradient-to-br from-blue-600 to-teal-400 shadow-sm" aria-hidden />
			<div className="text-base font-semibold tracking-tight">Worldview Assistant</div>
		</div>
	);
}

export default Logo;


