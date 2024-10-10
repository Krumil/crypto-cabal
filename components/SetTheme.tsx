'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const SetTheme = () => {
	const [theme, setTheme] = useState<string>('light');

	useEffect(() => {
		setTheme(window.__theme || 'light');
		window.__onThemeChange = setTheme;
	}, []);

	const toggleTheme = () => {
		window.__setPreferredTheme(theme === 'light' ? 'dark' : 'light');
	};

	return (
		<Button onClick={toggleTheme} variant="outline" size="sm">
			{theme === 'dark' ? '🌞' : '🌙'}
		</Button>
	);
};

export default SetTheme;