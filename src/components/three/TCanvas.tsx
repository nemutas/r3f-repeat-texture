import React, { FC, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { ScreenPlane } from './ScreenPlane';

export const TCanvas: FC = () => {
	const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.001, 10)
	camera.position.z = 1

	return (
		<Canvas camera={camera} orthographic dpr={window.devicePixelRatio}>
			<Suspense fallback={null}>
				<ScreenPlane />
			</Suspense>
		</Canvas>
	)
}
