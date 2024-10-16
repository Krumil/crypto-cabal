import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { getTheme } from '@/lib/getTheme';
import Providers from "./providers";
import { headers } from "next/headers";

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
	const cookie = headers().get("cookie");

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: getTheme }} />
			</head>
			<body className={`${spaceGrotesk.variable} font-sans antialiased`}>
				<Providers cookie={cookie}>{children}</Providers>
			</body>
		</html>
	);
}