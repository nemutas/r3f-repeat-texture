import { FC, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { lerp } from 'three/src/math/MathUtils';
import { Plane, useTexture } from '@react-three/drei';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import fragment from '../../modules/glsl/fragmentShader.glsl';
import vertex from '../../modules/glsl/vertexShader.glsl';
import { publicPath } from '../../modules/utils';

export const ScreenPlane: FC = () => {
	const { viewport } = useThree()

	let isPan = false
	const prevMouse = new THREE.Vector2()
	const textureOffset = useMemo(() => new THREE.Vector2(), [])
	const dMousePosition = useMemo(() => new THREE.Vector2(), [])
	let zoom = useMemo(() => 1, [])

	const texture = useTexture(publicPath('images/wlop.jpg'))
	texture.wrapS = THREE.RepeatWrapping
	texture.wrapT = THREE.RepeatWrapping

	const shader: THREE.Shader = useMemo(() => {
		return {
			uniforms: {
				u_texture: { value: texture },
				u_uvScale: { value: new THREE.Vector2() },
				u_textureOffset: { value: new THREE.Vector2() },
				u_mouseSpeed: { value: new THREE.Vector2() },
				u_zoom: { value: zoom },
				u_zoomProgress: { value: 0 },
				u_aspect: { value: viewport.aspect }
			},
			vertexShader: vertex,
			fragmentShader: fragment
		}
	}, [])

	useEffect(() => {
		const textureAspect = texture.image.width / texture.image.height
		const aspect = viewport.aspect
		const ratio = aspect / textureAspect
		const [x, y] = aspect < textureAspect ? [ratio, 1] : [1, 1 / ratio]

		shader.uniforms.u_uvScale.value.set(x, y)
	}, [viewport])

	// --------------------------------------
	// frame loop
	useFrame(({ viewport }) => {
		// smooth drag move
		shader.uniforms.u_textureOffset.value.lerp(textureOffset, 0.1)
		// decrease mouse speed
		dMousePosition.lerp(new THREE.Vector2(), 0.1)
		shader.uniforms.u_mouseSpeed.value.copy(dMousePosition).multiplyScalar(2)
		// smooth zoom
		shader.uniforms.u_zoom.value = lerp(shader.uniforms.u_zoom.value, zoom, 0.1)
		shader.uniforms.u_zoomProgress.value = zoom - shader.uniforms.u_zoom.value

		shader.uniforms.u_aspect.value = viewport.aspect
	})

	// --------------------------------------
	// event
	const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
		isPan = true
		prevMouse.copy(e.pointer)
	}

	const handlePointerUp = () => {
		isPan = false
	}

	const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
		if (isPan) {
			dMousePosition.copy(e.pointer.clone().sub(prevMouse))
			// Apply drag amount to zoom
			dMousePosition.multiplyScalar(shader.uniforms.u_zoom.value)
			// Apply drag amount to screen size
			dMousePosition.multiply(shader.uniforms.u_uvScale.value)
			// Add to total move amount
			textureOffset.add(dMousePosition)

			prevMouse.copy(e.pointer)
		}
	}

	const handleWheel = (e: ThreeEvent<WheelEvent>) => {
		if (0 < e.nativeEvent.deltaY) {
			zoom += 0.05
			zoom = Math.min(zoom, 1)
		} else {
			zoom -= 0.05
			zoom = Math.max(zoom, 0.3)
		}
	}

	return (
		<Plane
			args={[2, 2]}
			scale={[viewport.width / 2, viewport.height / 2, 1]}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}
			onPointerLeave={handlePointerUp}
			onPointerMove={handlePointerMove}
			onWheel={handleWheel}>
			<shaderMaterial args={[shader]} />
		</Plane>
	)
}
