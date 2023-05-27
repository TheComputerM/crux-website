import { useEffect, useRef } from "react";
import { WebGLRenderer, Scene, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader, PlaneGeometry } from "three";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect";
import image from "./logo.png";

export default function ASCIISection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let plane: Mesh;
  useEffect(() => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    const renderer = new WebGLRenderer({
      canvas: canvasRef.current!,
      antialias: false,
      stencil: false,
      depth: false
    });

    renderer.setSize(window.innerWidth - 100, window.innerHeight);
    const effect = new AsciiEffect(renderer, ' .:-+x=%@#', { invert: true, resolution: 0.2 });
    effect.setSize(window.innerWidth - 10, window.innerHeight);
    effect.domElement.classList.add("absolute", "inset-0")
    canvasRef.current?.parentElement?.appendChild(effect.domElement)


    const geometry = new PlaneGeometry(2, 2);
    const map = new TextureLoader().load(image.src);
    const material = new MeshBasicMaterial({ map });
    plane = new Mesh(geometry, material);
    scene.add(plane);
    
    camera.position.z = 2;

    let animationID: number;

    function animate() {
      animationID = requestAnimationFrame(animate);
      effect.render(scene, camera);
    }
    animate();


    return () => {
      cancelAnimationFrame(animationID)
      effect.domElement.remove();
    }
  }, [])

  return <section className="relative">
    <canvas className="opacity-0 relative z-10" ref={canvasRef} onPointerMove={(e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      plane.rotation.y = (x - 0.5) * 0.75;
      plane.rotation.x = (y - 0.5) * 0.75;
    }} />
  </section>
}