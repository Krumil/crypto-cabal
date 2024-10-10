import React from 'react';

const LoadingComponent: React.FC = () => (
	<div className="flex items-center justify-center h-24 bg-gray-900 rounded-lg p-4">
		<div className="animate-pulse flex space-x-4">
			<div className="rounded-full bg-gray-700 h-12 w-12"></div>
			<div className="flex-1 space-y-4 py-1">
				<div className="h-4 bg-gray-700 rounded w-3/4"></div>
				<div className="space-y-2">
					<div className="h-4 bg-gray-700 rounded"></div>
					<div className="h-4 bg-gray-700 rounded w-5/6"></div>
				</div>
			</div>
		</div>
	</div>
);

export default LoadingComponent;