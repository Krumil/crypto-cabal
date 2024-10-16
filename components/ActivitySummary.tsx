'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';
import { getEnsName } from '@wagmi/core';
import { config } from '@/lib/config';

interface TokenInfo {
	id: string;
	symbol: string;
	name: string;
	price: number;
	price_change_percentage_24h: number;
	image: string;
}

interface ActivitySummaryProps {
	userActions: string;
	popularTokens: TokenInfo[];
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({
	userActions,
	popularTokens,
}) => {
	const [formattedActions, setFormattedActions] = useState<string>(userActions);
	const [addresses, setAddresses] = useState<`0x${string}`[]>([]);
	const [ensNames, setEnsNames] = useState<{ [key: string]: string | null }>({});

	useEffect(() => {
		const addressRegex = /0x[a-fA-F0-9]{40}/g;
		const foundAddresses = userActions.match(addressRegex) || [];
		setAddresses(foundAddresses.map(addr => addr as `0x${string}`));
	}, [userActions]);

	useEffect(() => {
		const fetchEnsNames = async () => {
			const results: { [key: string]: string | null } = {};
			await Promise.all(
				addresses.map(async (address) => {
					try {
						const ensName = await getEnsName(config, { address });
						results[address] = ensName ?? null;
					} catch (error) {
						console.error(`Error fetching ENS name for address ${address}:`, error);
						results[address] = null;
					}
				})
			);
			setEnsNames(results);
		};

		if (addresses.length > 0) {
			fetchEnsNames();
		}
	}, [addresses]);

	const shortenAddress = useCallback((address: string): string => {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	}, []);

	useEffect(() => {
		let formattedText = userActions;
		addresses.forEach((address) => {
			const ensName = ensNames[address];
			const replacement = ensName || shortenAddress(address);
			formattedText = formattedText.replace(address, `<span class="font-semibold text-blue-400">${replacement}</span>`);
		});
		setFormattedActions(formattedText);
	}, [userActions, addresses, ensNames, shortenAddress]);

	return (
		<Card className="w-full max-w-md mx-auto bg-gray-900 border-gray-800 text-gray-300">
			<CardContent className="p-4">
				<h2 className="text-xl font-semibold text-gray-100 mb-4">Today's summary</h2>

				<div className="mb-6">
					<p className="text-lg" dangerouslySetInnerHTML={{ __html: formattedActions }}></p>
				</div>

				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold text-gray-100">For you</h3>
					<div className="flex space-x-2">
						<button className="bg-gray-800 px-3 py-1 rounded-full text-sm font-medium">Swaps</button>
						<button className="bg-gray-800 px-3 py-1 rounded-full text-sm font-medium">Mints</button>
						<button className="bg-gray-800 px-3 py-1 rounded-full text-sm font-medium">All</button>
					</div>
				</div>

				<ScrollArea className="h-full">
					{popularTokens.map((token) => (
						<div key={token.id} className="flex items-center space-x-3 mb-3">
							<Image src={token.image} alt={token.name} width={32} height={32} className="rounded-full" />
							<div>
								<p className="font-medium text-gray-100">{token.symbol.toUpperCase()}</p>
								<p className="text-sm text-gray-400">${token.price.toFixed(2)}</p>
							</div>
							<div className="ml-auto">
								<p className={`text-sm ${token.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
									{token.price_change_percentage_24h.toFixed(2)}%
								</p>
							</div>
						</div>
					))}
				</ScrollArea>
			</CardContent>
		</Card>
	);
};

export default ActivitySummary;