import React, { FC } from 'react';
import { LinkIconButton } from './LinkIconButton';
import { TCanvas } from './three/TCanvas';

export const App: FC = () => {
	return (
		<div style={{ width: '100vw', height: '100vh' }}>
			<TCanvas />
			<LinkIconButton imagePath="icons/github.svg" linkPath="https://github.com/nemutas/r3f-repeat-texture" />
		</div>
	)
}
