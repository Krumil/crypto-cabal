'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { streamActivitySummary } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, X, Wallet } from 'lucide-react';
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
	const [wallets, setWallets] = useState<string[]>([]);
	const [newWallet, setNewWallet] = useState<string>('');
	const [summary, setSummary] = useState<React.ReactNode>();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		const savedWallets = localStorage.getItem('wallets');
		if (savedWallets) {
			setWallets(JSON.parse(savedWallets));
		}
	}, []);

	const addWallet = () => {
		if (newWallet && !wallets.includes(newWallet)) {
			const updatedWallets = [...wallets, newWallet];
			setWallets(updatedWallets);
			localStorage.setItem('wallets', JSON.stringify(updatedWallets));
			setNewWallet('');
			toast({
				title: "Wallet added",
				description: "Your new wallet has been added successfully.",
				action: (
					<ToastAction altText="Undo">Undo</ToastAction>
				),
			});
		} else if (wallets.includes(newWallet)) {
			toast({
				title: "Wallet already exists",
				description: "This wallet address is already in your list.",
				variant: "destructive",
			});
		} else {
			toast({
				title: "Invalid wallet",
				description: "Please enter a valid wallet address.",
				variant: "destructive",
			});
		}
	};

	const removeWallet = (walletToRemove: string) => {
		const updatedWallets = wallets.filter(wallet => wallet !== walletToRemove);
		setWallets(updatedWallets);
		localStorage.setItem('wallets', JSON.stringify(updatedWallets));
		toast({
			title: "Wallet removed",
			description: "The wallet has been removed from your list.",
			action: (
				<ToastAction altText="Undo">Undo</ToastAction>
			),
		});
	};

	const generateSummary = async () => {
		setSummary(await streamActivitySummary(wallets, 'ethereum'));
	};

	return (
		<div className="min-h-screen bg-gray-950 text-gray-300">
			<div className="container mx-auto p-4 max-w-3xl">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-100">Crypto Cabal</h1>
				</div>

				{wallets.length > 0 ? (
					<Button onClick={generateSummary} className="w-full mb-6 bg-gray-800 hover:bg-gray-700 text-gray-200">Generate Summary</Button>
				) : (
					<div className="text-center mb-6 p-4 bg-gray-900 rounded-md">
						<p className="text-gray-400">No wallets added yet. Click the settings button to add a wallet.</p>
					</div>
				)}

				{summary && (
					<div className="rounded-md">
						{summary}
					</div>
				)}
			</div>

			<div className="fixed bottom-4 right-4 z-50">
				<Button
					variant="default"
					size="icon"
					className="rounded-full w-12 h-12 shadow-lg bg-gray-800 hover:bg-gray-700 text-gray-200"
					onClick={() => setIsSettingsOpen(true)}
				>
					<Settings className="h-6 w-6" />
				</Button>
			</div>

			<AnimatePresence>
				{isSettingsOpen && (
					<motion.div
						initial={{ opacity: 0, clipPath: 'circle(0% at bottom right)' }}
						animate={{ opacity: 1, clipPath: 'circle(150% at bottom right)' }}
						exit={{ opacity: 0, clipPath: 'circle(0% at bottom right)' }}
						transition={{ duration: 0.5, ease: 'easeInOut' }}
						className="fixed inset-0 bg-gray-900 z-40 overflow-y-auto"
					>
						<div className="container mx-auto p-4 max-w-3xl">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold text-gray-100">Manage Wallets</h2>
								<Button variant="ghost" onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-200">
									<X className="h-6 w-6" />
								</Button>
							</div>

							{wallets.length > 0 ? (
								wallets.map((wallet, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className="flex items-center justify-between p-4 bg-gray-800 rounded-md mb-2 shadow-md"
									>
										<div className="flex items-center">
											<Wallet className="h-5 w-5 mr-2 text-gray-400" />
											<span className="break-all text-gray-300">{`${wallet.slice(0, 6)}...${wallet.slice(-4)}`}</span>
										</div>
										<Button variant="destructive" size="sm" onClick={() => removeWallet(wallet)}>Remove</Button>
									</motion.div>
								))
							) : (
								<div className="text-center p-4 bg-gray-800 rounded-md">
									<p className="text-gray-400">No wallets added yet. Add a wallet to get started.</p>
								</div>
							)}

							<div className="mb-6">
								<Input
									value={newWallet}
									onChange={(e) => setNewWallet(e.target.value)}
									placeholder="Enter wallet address"
									className="mb-2 bg-gray-800 text-gray-200 border-gray-700"
								/>
								<Button onClick={addWallet} className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200">
									<Plus className="mr-2 h-4 w-4" />
									Add Wallet
								</Button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}