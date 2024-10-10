'use server';

import { streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import React from 'react';
import axios from 'axios';
import { headers } from 'next/headers';
import LoadingComponent from '@/components/LoadingComponent';
import ActivitySummary from '@/components/ActivitySummary';

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const DEFILLAMA_API_URL = 'https://coins.llama.fi';
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

interface Transaction {
	from: string;
	to: string;
	value: string;
	tokenSymbol?: string;
}

interface WalletActivity {
	wallet: string;
	transactions: Transaction[];
}

interface TokenInfo {
	id: string;
	symbol: string;
	name: string;
	price: number;
	price_change_percentage_24h: number;
}

const getBlockNumberAtTimestamp = async (chain: string, timestamp: number): Promise<number> => {
	const url = `${DEFILLAMA_API_URL}/block/${chain}/${timestamp}`;
	console.log(`Fetching block number for chain ${chain} at timestamp ${timestamp}`);
	try {
		const response = await axios.get(url);
		console.log(`Block number fetched successfully: ${response.data.height}`);
		await new Promise(resolve => setTimeout(resolve, 1000));
		return response.data.height;
	} catch (error) {
		console.error(`Error fetching block number: ${error}`);
		throw error;
	}
};

const getWalletActivity = async (
	wallets: string[],
	chain: string,
	intervalHours: number = 24
): Promise<WalletActivity[]> => {
	console.log(`Fetching wallet activity for ${wallets.length} wallets on chain ${chain} for the last ${intervalHours} hours`);
	const activities: WalletActivity[] = [];
	const endTimestamp = Math.floor((Date.now() - 60000) / 1000);
	const startTimestamp = endTimestamp - intervalHours * 60 * 60;

	try {
		const startBlock = await getBlockNumberAtTimestamp(chain, startTimestamp);
		const endBlock = await getBlockNumberAtTimestamp(chain, endTimestamp);

		for (const wallet of wallets) {
			const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=${startBlock}&endblock=${endBlock}&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
			console.log(`Fetching transactions for wallet ${wallet}`);
			try {
				const response = await axios.get(url);

				if (response.data.status === '1') {
					const transactions = response.data.result.map((tx: any) => ({
						from: tx.from,
						to: tx.to,
						value: tx.value,
						tokenSymbol: tx.tokenSymbol || 'ETH',
					}));

					activities.push({ wallet, transactions });
					console.log(`Successfully fetched ${transactions.length} transactions for wallet ${wallet}`);
				} else {
					console.warn(`No transactions found for wallet ${wallet}`);
				}
			} catch (error) {
				console.error(`Error fetching transactions for wallet ${wallet}: ${error}`);
			}
		}

		return activities;
	} catch (error) {
		console.error(`Error in getWalletActivity: ${error}`);
		throw error;
	}
};

const getTokenPrices = async (tokens: string[]): Promise<Record<string, number>> => {
	const url = `${DEFILLAMA_API_URL}/prices/current/${tokens.join(',')}`;
	console.log(`Fetching token prices for ${tokens.length} tokens`);
	try {
		const response = await axios.get(url);
		console.log(`Successfully fetched prices for ${Object.keys(response.data.coins).length} tokens`);
		return Object.fromEntries(
			Object.entries(response.data.coins).map(([key, value]: [string, any]) => [key, value.price])
		);
	} catch (error) {
		console.error(`Error fetching token prices: ${error}`);
		throw error;
	}
};

const getPopularTokens = async (limit: number = 5): Promise<TokenInfo[]> => {
	const url = `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;
	console.log(`Fetching ${limit} popular tokens from CoinGecko`);
	try {
		const response = await axios.get(url);
		const popularTokens = response.data.map((token: any) => ({
			id: token.id,
			symbol: token.symbol,
			name: token.name,
			price: token.current_price,
			price_change_percentage_24h: token.price_change_percentage_24h,
		}));
		console.log(`Successfully fetched ${popularTokens.length} popular tokens`);
		return popularTokens;
	} catch (error) {
		console.error(`Error fetching popular tokens: ${error}`);
		throw error;
	}
};

export async function streamActivitySummary(wallets: string[], chain: string, intervalHours: number = 24) {
	console.log('Starting streamActivitySummary');
	console.log('wallets', wallets);
	console.log('chain', chain);
	console.log('intervalHours', intervalHours);

	try {
		const walletActivity = await getWalletActivity(wallets, chain, intervalHours);
		const popularTokens = await getPopularTokens();
		const tokenAddresses = walletActivity
			.flatMap(activity => activity.transactions)
			.map(tx => tx.to)
			.filter((value, index, self) => self.indexOf(value) === index);

		const tokenPrices = await getTokenPrices(tokenAddresses);

		console.log('All data fetched successfully, generating summary');


		const result = await streamUI({
			model: openai('gpt-4o'),
			prompt: `Summarize the following wallet activities and popular tokens in a concise manner:
      - Highlight outperforming tokens and their performance
      - Provide detailed wallet activity summaries, including significant transactions or patterns
      - Include brief market insights based on the data
      - Mention TVL insights for top protocols and chains
      - Use emojis to represent different actions (e.g., 📈 for price increase, 💱 for swaps)
      - Treat this as a summary of multiple wallets, not the user's personal wallet
      - Categorize wallet activities as "For You" if they involve significant transactions or interesting patterns
      Here's the data to summarize:
      Wallet Activity: ${JSON.stringify(walletActivity)}
      Token Prices: ${JSON.stringify(tokenPrices)}
      Popular Tokens: ${JSON.stringify(popularTokens)}`,
			text: ({ content }) => <div className="text-sm text-gray-200">{content}</div>,
			tools: {
				generateActivitySummary: {
					description: 'Generate a summary of wallet activity and market insights',
					parameters: z.object({
						outperformers: z.array(z.object({
							token: z.string(),
							performance: z.string(),
						})),
						walletActivity: z.array(z.object({
							address: z.string(),
							ens: z.string().optional(),
							activity: z.string(),
							isForYou: z.boolean(),
						})),
						marketInsights: z.array(z.string()),
						tvlInsights: z.string(),
					}),
					generate: async function* ({ outperformers, walletActivity, marketInsights, tvlInsights }) {
						yield <LoadingComponent />;
						return (
							<ActivitySummary
								outperformers={outperformers}
								walletActivity={walletActivity}
								marketInsights={marketInsights}
								tvlInsights={tvlInsights}
							/>
						);
					},
				},
			},
		});

		console.log('Activity summary generated successfully');
		return result.value;
	} catch (error) {
		console.error(`Error in streamActivitySummary: ${error}`);
		throw error;
	}
}