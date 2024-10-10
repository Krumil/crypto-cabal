import React from 'react';

interface ActivitySummaryProps {
	outperformers: { token: string; performance: string; }[];
	walletActivity: { address: string; ens?: string; activity: string; isForYou: boolean; }[];
	marketInsights: string[];
	tvlInsights: string;
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ outperformers, walletActivity, marketInsights, tvlInsights }) => {
	return (
		<div className="bg-gray-900 text-white p-6 rounded-lg max-w-3xl mx-auto">
			<h2 className="text-2xl font-semibold mb-6">Today's DeFi Activity</h2>

			{/* Wallet Activity Section */}
			<div className="mb-8">
				<h3 className="text-xl font-semibold text-blue-400 mb-4">👛 Wallet Activity</h3>
				<div className="space-y-4">
					{walletActivity.map((wallet, index) => (
						<div key={index} className="bg-gray-800 p-4 rounded-lg">
							<div className="flex justify-between items-center mb-2">
								<p className="font-medium text-lg">
									{wallet.ens || wallet.address.substring(0, 6) + '...' + wallet.address.substring(38)}
								</p>
								{wallet.isForYou && (
									<span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">For You</span>
								)}
							</div>
							<p className="text-gray-300">{wallet.activity}</p>
						</div>
					))}
				</div>
			</div>

			{/* Outperformers Section */}
			<div className="mb-4">
				<h3 className="text-lg font-semibold text-green-400 mb-2">🚀 Outperformers</h3>
				<div className="grid grid-cols-2 gap-2">
					{outperformers.map((token, index) => (
						<div key={index} className="bg-gray-800 p-2 rounded">
							<span className="font-bold">{token.token}</span>: {token.performance}
						</div>
					))}
				</div>
			</div>

			{/* Market Insights Section */}
			<div className="mb-4">
				<h3 className="text-lg font-semibold text-yellow-400 mb-2">💡 Market Insights</h3>
				<ul className="list-disc list-inside">
					{marketInsights.map((insight, index) => (
						<li key={index} className="text-sm mb-1">{insight}</li>
					))}
				</ul>
			</div>

			{/* TVL Insights */}
			<p className="text-sm text-gray-400 mt-4">{tvlInsights}</p>
		</div>
	);
};

export default ActivitySummary;