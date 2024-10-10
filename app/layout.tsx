import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { getTheme } from '@/lib/getTheme';

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
	title: "Crypto Social Block Explorer",
	description: "Explore crypto wallets and generate activity summaries",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: getTheme }} />
			</head>
			<body className={`${spaceGrotesk.variable} font-sans antialiased`}>
				{children}
			</body>
		</html>
	);
}