'use server';

import React from 'react';
import Link from 'next/link';

interface ActivityFiltersProps {
	viewMode: 'forYou' | 'all';
	activityFilter: 'all' | 'swaps' | 'mints';
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({ viewMode, activityFilter }) => {
	return (
		<div className="mt-4 flex justify-between items-center">
			<div className="flex space-x-2">
				<Link href={`?activityFilter=swaps&viewMode=${viewMode}`}
					className={`px-3 py-1 rounded-full text-sm font-medium ${activityFilter === 'swaps' ? 'bg-white text-black' : 'text-white'}`}>
					Swaps
				</Link>
				<Link href={`?activityFilter=mints&viewMode=${viewMode}`}
					className={`px-3 py-1 rounded-full text-sm font-medium ${activityFilter === 'mints' ? 'bg-white text-black' : 'text-white'}`}>
					Mints
				</Link>
				<Link href={`?activityFilter=all&viewMode=${viewMode}`}
					className={`px-3 py-1 rounded-full text-sm font-medium ${activityFilter === 'all' ? 'bg-white text-black' : 'text-white'}`}>
					All
				</Link>
			</div>
			<Link href={`?viewMode=${viewMode === 'forYou' ? 'all' : 'forYou'}&activityFilter=${activityFilter}`}
				className="text-sm text-gray-400">
				{viewMode === 'forYou' ? 'For you ▼' : 'All ▼'}
			</Link>
		</div>
	);
};

export default ActivityFilters;