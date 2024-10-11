'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ActivitySummaryProps {
	outperformers: { token: string; performance: string }[];
	walletActivity: { address: string; ens?: string; activity: string; isForYou: boolean }[];
	marketInsights: string[];
	tvlInsights: string;
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({
	outperformers,
	walletActivity,
	marketInsights,
	tvlInsights,
}) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	const fadeInVariants = {
		hidden: { opacity: 0, x: 20 },
		visible: { opacity: 1, x: 0 },
	};

	return (
		<div className="bg-gray-900 text-white p-8 rounded-lg max-w-4xl mx-auto shadow-2xl">
			<motion.h2
				className="text-3xl font-bold mb-8 text-center"
				initial="hidden"
				animate={isVisible ? 'visible' : 'hidden'}
				variants={fadeInVariants}
				transition={{ duration: 0.5 }}
			>
				Today's DeFi Activity
			</motion.h2>

			{/* Wallet Activity Section */}
			<motion.div
				className="mb-10"
				initial="hidden"
				animate={isVisible ? 'visible' : 'hidden'}
				variants={fadeInVariants}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<h3 className="text-2xl font-semibold text-blue-400 mb-6">Wallet Activity</h3>
				<div className="space-y-4">
					{walletActivity.map((wallet, index) => (
						<motion.div
							key={index}
							className="bg-gray-800 p-6 rounded-lg shadow-md"
							initial="hidden"
							animate={isVisible ? 'visible' : 'hidden'}
							variants={fadeInVariants}
							transition={{ duration: 0.5, delay: 0.1 * index }}
						>
							<div className="flex justify-between items-center mb-3">
								<p className="font-medium text-xl">
									{wallet.ens || wallet.address.substring(0, 6) + '...' + wallet.address.substring(38)}
								</p>
								{wallet.isForYou && (
									<span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">For You</span>
								)}
							</div>
							<p className="text-gray-300">{wallet.activity}</p>
						</motion.div>
					))}
				</div>
			</motion.div>

			{/* Outperformers Section */}
			<motion.div
				className="mb-10"
				initial="hidden"
				animate={isVisible ? 'visible' : 'hidden'}
				variants={fadeInVariants}
				transition={{ duration: 0.5, delay: 0.4 }}
			>
				<h3 className="text-2xl font-semibold text-green-400 mb-6">Outperformers</h3>
				<div className="grid grid-cols-2 gap-4">
					{outperformers.map((token, index) => (
						<motion.div
							key={index}
							className="bg-gray-800 p-4 rounded-lg shadow-md"
							initial="hidden"
							animate={isVisible ? 'visible' : 'hidden'}
							variants={fadeInVariants}
							transition={{ duration: 0.5, delay: 0.1 * index }}
						>
							<span className="font-bold text-lg">{token.token}</span>
							<span className="text-green-400 ml-2">{token.performance}</span>
						</motion.div>
					))}
				</div>
			</motion.div>

			{/* Market Insights Section */}
			<motion.div
				className="mb-10"
				initial="hidden"
				animate={isVisible ? 'visible' : 'hidden'}
				variants={fadeInVariants}
				transition={{ duration: 0.5, delay: 0.6 }}
			>
				<h3 className="text-2xl font-semibold text-yellow-400 mb-6">Market Insights</h3>
				<ul className="space-y-3">
					{marketInsights.map((insight, index) => (
						<motion.li
							key={index}
							className="text-base bg-gray-800 p-4 rounded-lg shadow-md"
							initial="hidden"
							animate={isVisible ? 'visible' : 'hidden'}
							variants={fadeInVariants}
							transition={{ duration: 0.5, delay: 0.1 * index }}
						>
							{insight}
						</motion.li>
					))}
				</ul>
			</motion.div>

			{/* TVL Insights */}
			<motion.p
				className="text-sm text-gray-400 mt-6"
				initial="hidden"
				animate={isVisible ? 'visible' : 'hidden'}
				variants={fadeInVariants}
				transition={{ duration: 0.5, delay: 0.8 }}
			>
				{tvlInsights}
			</motion.p>
		</div>
	);
};

export default ActivitySummary;