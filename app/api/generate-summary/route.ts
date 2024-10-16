import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import axios from 'axios';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

interface Transaction {
	from: string;
	to: string;
	value: string;
	tokenSymbol?: string;
	contractAddress?: string;
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
	contractAddress?: string;
	sparkline: string;
	image: string;
}

export async function POST(req: NextRequest) {
	const { wallets, chain, intervalHours } = await req.json();

	try {
		const response = await axios.post(`${BACKEND_API_URL}/wallet-activity`, {
			wallets,
			chain,
			intervalHours
		});

		const { popularTokens, walletActivity, tokenPrices } = response.data.data;

		// Detect which users bought popular tokens and at what price
		const userTokenPurchases: Record<string, { token: string, price: number }[]> = {};
		walletActivity.forEach((activity: WalletActivity) => {
			activity.transactions.forEach((tx: Transaction) => {
				const popularToken = popularTokens.find((token: TokenInfo) => token.contractAddress === tx.contractAddress);
				if (popularToken && tx.to.toLowerCase() === activity.wallet.toLowerCase()) {
					if (!userTokenPurchases[activity.wallet]) {
						userTokenPurchases[activity.wallet] = [];
					}
					userTokenPurchases[activity.wallet].push({
						token: popularToken.symbol,
						price: tokenPrices[tx.contractAddress as string] || 0
					});
				}
			});
		});

		const { object } = await generateObject({
			model: openai('gpt-4o'),
			schema: z.object({
				outperformers: z.string(),
				walletActivity: z.string(),
				marketInsights: z.string(),
				userTokenPurchases: z.string(),
			}),
			prompt: `Summarize the following wallet activities, popular tokens, and user token purchases in a concise manner:
                - Provide a textual description of outperforming tokens and their performance
                - Give a textual summary of wallet activities, including significant transactions
                - Include brief market insights based on the data
                - Summarize the user token purchases, highlighting which users bought popular tokens and at what prices
                - Use emojis to represent different actions (e.g., 📈 for price increase, 💱 for swaps)
                - Treat this as a summary of multiple wallets, not the user's personal wallet
                Here's the data to summarize:
                Wallet Activity: ${JSON.stringify(walletActivity)}
                Popular Tokens: ${JSON.stringify(popularTokens)}
                Token Prices: ${JSON.stringify(tokenPrices)}
                User Token Purchases: ${JSON.stringify(userTokenPurchases)}`,
		});

		// Return the response
		return NextResponse.json({
			data: {
				...object,
				popularTokens,
				userTokenPurchases,
			},
			message: 'Response generated successfully',
		});
	} catch (error) {
		console.error(`Error in POST: ${error}`);
		return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
	}
}