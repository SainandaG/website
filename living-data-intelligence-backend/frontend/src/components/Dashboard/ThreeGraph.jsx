import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import soundSystem from '../../utils/SoundSystem'; // Added import for soundSystem
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Calculates 3D positions using Golden Spiral Spherical distribution
 * @param {Array} nodes - Your array of node objects
 * @param {Number} radius - Radius of the galaxy (e.g., 400-800)
 */
function applyGalaxyLayout(nodes, radius = 600) {
    const numNodes = nodes.length;
    // Golden Angle constant
    const phi = Math.PI * (3 - Math.sqrt(5));

    nodes.forEach((node, i) => {
        // 1. Center the Core
        if (node.id === 'DATABASE_CORE' || node.type === 'core' || node.id === 'hub') {
            node.x = 0;
            node.y = 0;
            node.z = 0;
            node.baseY = 0;
            return;
        }

        // 2. Fibonacci Sphere Logic (Fallback)
        if (numNodes <= 1) {
            // Fallback for single node (centered)
            node.x = 0;
            node.y = 0;
            node.z = 0;
        } else {
            // y goes from 1 to -1
            const y = 1 - (i / (numNodes - 1)) * 2;
            const r = Math.sqrt(Math.max(0, 1 - y * y)); // Ensure no sqrt negative
            const theta = phi * i; // Increment theta

            // Assign fixed galaxy coordinates
            node.x = Math.cos(theta) * r * radius;
            node.y = y * radius;
            node.z = Math.sin(theta) * r * radius;
        }

        // Store base Y for the bobbing animation
        node.baseY = node.y;
    });

    return nodes;
}


function createNodeMesh(nodeData) {
    // Colors based on Spline-Style Soft Pastels
    const colorMap = {
        core: 0x68d391,      // Soft Green
        fact: 0xfcd34d,      // Soft Yellow
        dimension: 0x5eead4, // Soft Teal
        warning: 0xfda4af,   // Soft Red
        default: 0x5eead4    // Default Teal
    };

    let color;

    // PRIORITY 1: Core node is ALWAYS green (Neural Core hub)
    if (nodeData.id === 'DATABASE_CORE' || nodeData.id === 'hub' || nodeData.type === 'core' || nodeData.entity === 'core') {
        color = colorMap.core;
    }
    // PRIORITY 2: Use color from backend (cluster coloring) for regular nodes
    else if (nodeData.color && typeof nodeData.color === 'number') {
        color = nodeData.color;
        console.log(`[ThreeGraph] Using cluster color for ${nodeData.name}: 0x${color.toString(16)}`);
    }
    // PRIORITY 3: Status-based
    else if (nodeData.status === 'warning') {
        color = colorMap.warning;
    }
    // PRIORITY 4: Type-based
    else if (nodeData.table_type === 'fact' || ['payment', 'rental', 'orders', 'sales'].includes(nodeData.id)) {
        color = colorMap.fact;
    }
    // PRIORITY 5: Default
    else {
        color = colorMap.dimension;
    }

    // VISUAL DEBUG REMOVED - Returning to Premium Palette
    // The glow will now drive BRIGHTNESS, not Color hue.

    const size = nodeData.size || 40;

    // 1. Inner Core Sphere (The Light Source)
    const geometry = new THREE.SphereGeometry(size * 0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ // Basic material = 100% unlit brightness
        color: color
    });
    const sphere = new THREE.Mesh(geometry, material);

    // 2. Outer Glass Shell (The Lens)
    const shellGeo = new THREE.SphereGeometry(size, 64, 64);
    const shellMat = new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: 0.1,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9,      // Glass effect
        thickness: 2.0,
        emissive: color,
        emissiveIntensity: 0.5, // Subtle glow on the glass itself
        clearcoat: 1.0,
        clearcoatRoughness: 0.0
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    sphere.add(shell);

    // 3. The "Tech" Ring (Saturn Ring) - REMOVED to match desired clean style
    // const ringGeo = new THREE.RingGeometry(size * 1.2, size * 1.4, 32); ...

    // Store "Truth-Preserving" Glow Metric
    // Default to 1.0 if missing
    sphere.userData.nodeGlow = nodeData.node_glow || 1.0;

    // Label (Clean)
    const labelText = nodeData.name || nodeData.id;
    // VISUAL FIX: Doubled font size for readability
    const label = createTextSprite(labelText, 80, '#ffffff');
    label.position.set(0, size + 60, 0);
    sphere.add(label);

    return sphere;
}


function createTextSprite(message, fontsize, color) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = "bold " + fontsize + "px Arial";
    const metrics = ctx.measureText(message);
    const textWidth = metrics.width;
    canvas.width = textWidth + 20;
    canvas.height = fontsize + 20;
    ctx.font = "bold " + fontsize + "px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 6;
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(canvas.width / 10 * 4, canvas.height / 10 * 4, 1);
    return sprite;
}

// --- Restored Curved Edge for "Living" Feel ---
function createCurvedEdge(sourcePos, targetPos, edgeData = {}) {
    const start = new THREE.Vector3(sourcePos.x, sourcePos.y, sourcePos.z);
    const end = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);

    // Create a quadratic bezier curve
    // Midpoint with some random offset for "organic" curve
    const distance = start.distanceTo(end);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    // Offset perpendicular to the line
    mid.x += (Math.random() - 0.5) * distance * 0.3;
    mid.y += (Math.random() - 0.5) * distance * 0.3;
    mid.z += (Math.random() - 0.5) * distance * 0.3;

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Use edge data properties for visual distinction
    // TRUTH-PRESERVING: Use calculated Edge Glow (0.0 - 5.0 typically)
    const edgeGlow = edgeData.edge_glow || 1.0;

    // Scale visual properties logarithmically based on glow
    const edgeWidth = Math.min(6, Math.max(1.5, edgeGlow * 1.5)); // Thicker edges
    const edgeOpacity = Math.min(0.9, Math.max(0.4, edgeGlow * 0.2)); // Higher base opacity

    const material = new THREE.LineBasicMaterial({
        color: 0x00d4ff, // Bright Cyan default
        transparent: true,
        opacity: edgeOpacity,
        linewidth: edgeWidth
    });

    const line = new THREE.Line(geometry, material);

    // Store curve for particle animation
    line.userData.curve = curve;
    line.userData.sourcePos = sourcePos;
    line.userData.targetPos = targetPos;

    return line;
}

function createParticle(type = 'normal') {
    // Increased size for visibility (was 3)
    const geometry = new THREE.SphereGeometry(6, 16, 16);

    let color;
    if (type === 'fraud') color = 0xFF4757;      // Red
    else if (type === 'high_traffic') color = 0xFFD700; // Gold
    else color = 0x00FF88;                       // Green

    const material = new THREE.MeshBasicMaterial({
        color: color,
        // Maximize glow for Green to ensure it's visible
        emissive: color,
        emissiveIntensity: 2.0
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

// --- "Universe Nebula" Background to match Reference Images ---
function createStarfield(scene) {
    // Layer 1: Distant Stars (White/Blue, crisp)
    const starGeo = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 4000; i++) {
        starVertices.push((Math.random() - 0.5) * 8000, (Math.random() - 0.5) * 8000, (Math.random() - 0.5) * 8000);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 2, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Layer 2: Nebula Dust (Blue/Purple, soft, large)
    const dustGeo = new THREE.BufferGeometry();
    const dustVertices = [];
    const dustColors = [];
    const colorA = new THREE.Color(0x4c1d95); // Deep Purple
    const colorB = new THREE.Color(0x2563eb); // Royal Blue

    for (let i = 0; i < 1500; i++) {
        dustVertices.push((Math.random() - 0.5) * 5000, (Math.random() - 0.5) * 5000, (Math.random() - 0.5) * 5000);

        // Mix colors
        const mixedColor = colorA.clone().lerp(colorB, Math.random());
        dustColors.push(mixedColor.r, mixedColor.g, mixedColor.b);
    }
    dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustVertices, 3));
    dustGeo.setAttribute('color', new THREE.Float32BufferAttribute(dustColors, 3));

    // Soft transparent particles for nebula effect
    const dustMat = new THREE.PointsMaterial({
        size: 15,
        vertexColors: true,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);
}

const ThreeGraph = forwardRef(({ onNodeClick, data, tps = 0, className }, ref) => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const animationRef = useRef(null);
    const nodesRef = useRef([]);
    const particlesRef = useRef([]);
    const edgesRef = useRef([]);
    const sceneRef = useRef(null);
    const hoverNodeRef = useRef(null);
    const controlsRef = useRef(null); // Fix: Define controlsRef
    const tpsRef = useRef(tps);
    const selectedNodeRef = useRef(null);
    const flowEnabledRef = useRef(true);

    // Imperative API for Voice Agent
    useImperativeHandle(ref, () => ({
        highlightNode: (target) => {
            console.log(`[ThreeGraph] Action: Highlight ${target}`);
            const node = nodesRef.current.find(n =>
                n.id.toLowerCase() === target.toLowerCase() ||
                n.name.toLowerCase().includes(target.toLowerCase())
            );

            if (node) {
                selectedNodeRef.current = node.id;
                // Move camera to node
                focusOnNode(node);
                return true;
            }
            return false;
        },
        zoomToCluster: (target) => {
            console.log(`[ThreeGraph] Action: Zoom to (Cluster or Node) "${target}"`);

            const normalizedTarget = target.toLowerCase().trim();

            // 1. Try to find nodes by cluster ID or table type (Exact or Prefix)
            const clusterNodes = nodesRef.current.filter(n => {
                const c = n.cluster?.toString().toLowerCase();
                const t = n.table_type?.toLowerCase();
                return c === normalizedTarget || (c && c.includes(normalizedTarget)) ||
                    t === normalizedTarget || (t && t.includes(normalizedTarget));
            });

            if (clusterNodes.length > 0) {
                console.log(`[ThreeGraph] Found ${clusterNodes.length} nodes for cluster/type match:`, clusterNodes.map(n => n.name));
                zoomToNodes(clusterNodes);
                return true;
            }

            // 2. Fallback: Try to find a specific node by name/ID (Fuzzy Match)
            const singleNode = nodesRef.current.find(n =>
                n.id.toLowerCase() === normalizedTarget ||
                n.name.toLowerCase() === normalizedTarget ||
                n.name.toLowerCase().includes(normalizedTarget)
            );

            if (singleNode) {
                console.log(`[ThreeGraph] Target "${target}" matched node: ${singleNode.name}. Focusing camera.`);
                focusOnNode(singleNode);
                selectedNodeRef.current = singleNode.id;
                return true;
            }

            console.warn(`[ThreeGraph] No matches found for "${target}" among ${nodesRef.current.length} nodes.`);
            return false;
        },
        setEvolutionSnapshot: (snapshot) => {
            if (!snapshot || !nodesRef.current) return;

            const snapshotTables = new Map(snapshot.tables.map(t => [t.name, t]));

            nodesRef.current.forEach(node => {
                const snap = snapshotTables.get(node.id) || snapshotTables.get(node.name);

                if (node.mesh) {
                    if (snap) {
                        node.mesh.visible = true;
                        // Scale based on vitality (base 1.0 + vitality bonus)
                        const targetScale = 1.0 + (snap.vitality / 100) * 1.5;
                        node.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

                        // Glow intensity based on node_glow
                        if (node.mesh.material && node.mesh.material.emissiveIntensity !== undefined) {
                            node.mesh.material.emissiveIntensity = snap.node_glow || 1.0;
                        }

                        if (snap.is_new && !node.was_born) {
                            node.was_born = true;
                        }
                    } else {
                        node.mesh.visible = false;
                        node.mesh.scale.set(0.1, 0.1, 0.1);
                        if (node.mesh.material && node.mesh.material.emissiveIntensity !== undefined) {
                            node.mesh.material.emissiveIntensity = 0;
                        }
                        node.was_born = false;
                    }
                }
            });
        },
        startFlow: () => {
            console.log(`[ThreeGraph] Action: Start Flow`);
            flowEnabledRef.current = true;
        },
        stopFlow: () => {
            console.log(`[ThreeGraph] Action: Stop Flow`);
            flowEnabledRef.current = false;
        },
        resetView: () => {
            console.log(`[ThreeGraph] Action: Reset View`);
            resetCamera();
        }
    }));

    const focusOnNode = (node) => {
        if (!cameraRef.current || !controlsRef.current) return;

        const targetPos = new THREE.Vector3(node.x, node.y, node.z);
        const offset = new THREE.Vector3(0, 200, 400); // Cinematic offset
        const camPos = targetPos.clone().add(offset);

        animateCamera(camPos, targetPos);
    };

    const zoomToNodes = (nodes) => {
        if (!cameraRef.current || !controlsRef.current || nodes.length === 0) return;

        const box = new THREE.Box3();
        nodes.forEach(n => box.expandByPoint(new THREE.Vector3(n.x, n.y, n.z)));

        const center = new THREE.Vector3();
        box.getCenter(center);

        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);

        const camPos = center.clone().add(new THREE.Vector3(0, maxDim, maxDim * 1.5));
        animateCamera(camPos, center);
    };

    const resetCamera = () => {
        animateCamera(new THREE.Vector3(0, 0, 1600), new THREE.Vector3(0, 0, 0));
        selectedNodeRef.current = null;
    };

    const animateCamera = (newPos, target) => {
        if (!cameraRef.current || !controlsRef.current) return;

        const duration = 1200;
        const startPos = cameraRef.current.position.clone();
        const startTarget = controlsRef.current.target.clone();
        const startTime = Date.now();

        const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const anim = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const e = ease(progress);

            cameraRef.current.position.lerpVectors(startPos, newPos, e);
            controlsRef.current.target.lerpVectors(startTarget, target, e);

            if (progress < 1) requestAnimationFrame(anim);
        };
        anim();
    };

    // Update tpsRef whenever tps prop changes
    useEffect(() => {
        console.log(`[ThreeGraph] TPS changed: ${tps}`);
        tpsRef.current = tps;
        if (tps <= 0) {
            console.log('[ThreeGraph] TPS is 0 - clearing all particles');
            // Force immediate stability: Clear existing particles
            particlesRef.current.forEach(p => {
                if (sceneRef.current) sceneRef.current.remove(p.mesh);
            });
            particlesRef.current = [];
        }
    }, [tps]);

    useEffect(() => {
        if (!containerRef.current) return;

        // Cleanup
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        // Init Scene
        const scene = new THREE.Scene();
        // REMOVED: Static background color
        // scene.background = new THREE.Color(0x0e1012); 
        // scene.fog = new THREE.FogExp2(0x0e1012, 0.0008); 
        // We will use CSS background for better gradient control

        // Init Camera
        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 15000);
        camera.position.z = 1600; // Zoomed out for better overview (was 1000)
        cameraRef.current = camera;

        // Init Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true, // Allow CSS background to show through if needed
            powerPreference: "high-performance"
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Clears any existing canvas to prevent 'double graph' ghosting
        containerRef.current.innerHTML = '';

        const canvasContainer = document.createElement('div');
        canvasContainer.className = "absolute inset-0 z-0";
        containerRef.current.appendChild(canvasContainer);
        canvasContainer.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // PREMIUM LIGHTING (Ultra Bright Mode)
        // High Ambient to wash out shadows and ensure color visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 2.0);
        pointLight.position.set(500, 500, 500);
        scene.add(pointLight);

        const fillLight = new THREE.DirectionalLight(0xa78bfa, 2.0);
        fillLight.position.set(-500, 200, -500);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
        rimLight.position.set(0, 500, -500);
        scene.add(rimLight);

        // Starfield (Universe Nebula)
        createStarfield(scene);

        // --- Data Processing ---
        nodesRef.current = [];
        edgesRef.current = [];
        particlesRef.current = [];
        sceneRef.current = scene;

        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        // let hoverNode = null; // Removed local variable in favor of Ref

        if (data && data.nodes && data.nodes.length > 0) {
            // 1. Layout
            const layoutNodes = applyGalaxyLayout([...data.nodes], 600);
            const nodeMap = new Map();

            // 2. Create Nodes
            layoutNodes.forEach((nodeData, i) => {
                const mesh = createNodeMesh(nodeData);
                mesh.position.set(nodeData.x, nodeData.y, nodeData.z);
                nodeData.mesh = mesh;
                nodeData.baseY = nodeData.y; // Ensure baseY is set on the object we use in animate

                scene.add(mesh);
                nodesRef.current.push(nodeData);
                nodeMap.set(nodeData.id, nodeData);
            });

            // 3. Create Edges (CURVED)
            if (data.edges) {
                data.edges.forEach(edge => {
                    const source = nodeMap.get(edge.source);
                    const target = nodeMap.get(edge.target);
                    if (source && target) {
                        // CHANGED: Use Curved Edge
                        const line = createCurvedEdge(source.mesh.position, target.mesh.position);
                        line.userData.sourceId = edge.source;
                        line.userData.targetId = edge.target;
                        scene.add(line);
                        edgesRef.current.push(line);
                    }
                });
            }
        }

        // Controls - UNLOCKED for Interaction
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 50;
        controls.maxDistance = 4000;

        // Allow full 360 rotation
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI;
        controls.minAzimuthAngle = -Infinity;
        controls.maxAzimuthAngle = Infinity;

        // CRITICAL FIX: Disable auto-rotation to stop "self-rotating" behavior
        controls.autoRotate = false;

        controls.enableRotate = true; // explicitly enable
        controls.enableZoom = true;   // explicitly enable
        controls.enablePan = true;    // explicitly enable panning

        controlsRef.current = controls; // Fix: Assign to ref

        // Interaction
        const onMouseMove = (e) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            // Check for intersections
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                // Traverse up to find the main node mesh
                let object = intersects[0].object;
                let foundNode = null;

                // Climb up the tree until we find a match in nodesRef or hit root
                while (object) {
                    foundNode = nodesRef.current.find(n => n.mesh === object);
                    if (foundNode) break;
                    object = object.parent;
                }

                if (foundNode && foundNode !== hoverNodeRef.current) {
                    hoverNodeRef.current = foundNode; // Update Ref
                    document.body.style.cursor = 'pointer';
                }
            } else if (hoverNodeRef.current) {
                hoverNodeRef.current = null; // Clear Ref
                document.body.style.cursor = 'default';
            }
        };

        const onClick = () => {
            if (hoverNodeRef.current && onNodeClick) {
                console.log("ThreeGraph: Node Clicked:", hoverNodeRef.current.name);
                onNodeClick(hoverNodeRef.current);
            }
        };

        const canvas = renderer.domElement;
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('click', onClick);

        // Helper to get neighbors
        const getNeighbors = (nodeId) => {
            const neighbors = new Set();
            edgesRef.current.forEach(edge => {
                if (edge.userData.sourceId === nodeId) neighbors.add(edge.userData.targetId);
                else if (edge.userData.targetId === nodeId) neighbors.add(edge.userData.sourceId);
            });
            return Array.from(neighbors);
        };

        // --- ANIMATION LOOP ---
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            const time = Date.now() * 0.001;

            if (controlsRef.current) controlsRef.current.update();

            // Smooth Factor (Lower = Smoother/Heavier like Spline)
            const LERP_FACTOR = 0.08;

            // 1. UPDATE NODES
            scene.traverse((object) => {
                if (object.isMesh && object.userData && object.userData.isNode) {
                    const nodeState = object.userData;
                    const hoverId = hoverNodeRef.current ? hoverNodeRef.current.id : null;

                    let targetScale = 1.0;
                    let state = 'idle';

                    const isSelected = selectedNodeRef.current === nodeState.id;

                    // DETERMINE STATE
                    if (isSelected) {
                        state = 'hover';
                        targetScale = 2.0;
                    } else if (hoverId) {
                        if (nodeState.id === hoverId) {
                            state = 'hover';
                            targetScale = 1.6; // Pop out
                        } else if (getNeighbors(hoverId).includes(nodeState.id)) {
                            state = 'related';
                            targetScale = 1.2;
                        } else {
                            state = 'dimmed';
                            targetScale = 0.8;
                        }
                    }

                    // APPLY SMOOTH SCALE
                    // Add "Pulse" effect based on Node Glow (Living Data)
                    // VISUAL BOOST: Increased pulse amplitude for clearer "life"
                    const pulse = Math.sin(time * (2 + (nodeState.nodeGlow * 0.8))) * 0.15 * (nodeState.nodeGlow || 1);
                    const finalScale = targetScale + pulse;
                    object.scale.lerp(new THREE.Vector3(finalScale, finalScale, finalScale), LERP_FACTOR);

                    // APPLY FLOATING ANIMATION
                    if (state === 'idle' && nodeState.baseY) {
                        // Cast ID to string to safely parse length
                        const idLen = String(nodeState.id).length;
                        // Higher glow = higher float amplitude
                        const floatAmp = 8 + ((nodeState.nodeGlow || 0) * 4); // Increased float variation
                        object.position.y = THREE.MathUtils.lerp(object.position.y, nodeState.baseY + Math.sin(time + idLen) * floatAmp, 0.05);
                    }

                    // UPDATE MATERIALS (Dimming Logic)
                    object.traverse((child) => {
                        if (child.material) {
                            if (!child.userData.originalOpacity) child.userData.originalOpacity = child.material.opacity;
                            if (!child.userData.originalEmissive) child.userData.originalEmissive = child.material.emissiveIntensity || 0.1;

                            let targetOpacity = child.userData.originalOpacity;
                            // VISUAL BOOST: Stronger glow influence (0.4 instead of 0.2)
                            let baseEmissive = Math.min(3.0, (child.userData.originalEmissive + (nodeState.nodeGlow || 0) * 0.4));
                            let targetEmissive = baseEmissive;

                            if (state === 'hover') {
                                targetOpacity = Math.min(1.0, child.userData.originalOpacity * 1.5);
                                targetEmissive = baseEmissive + 0.8; // Stronger Highlight
                            } else if (state === 'related') {
                                targetEmissive = baseEmissive + 0.3;
                            } else if (state === 'dimmed') {
                                targetOpacity = 0.1;
                                targetEmissive = 0.05;
                            }

                            child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, targetOpacity, LERP_FACTOR);
                            if (child.material.emissiveIntensity !== undefined) {
                                child.material.emissiveIntensity = THREE.MathUtils.lerp(child.material.emissiveIntensity, targetEmissive, LERP_FACTOR);
                            }
                        }
                    });
                }
            });

            // 2. UPDATE EDGES
            edgesRef.current.forEach(edge => {
                const hoverId = hoverNodeRef.current ? hoverNodeRef.current.id : null;
                let targetOpacity = 0.15; // Base visibility

                if (hoverId) {
                    if (edge.userData.sourceId === hoverId || edge.userData.targetId === hoverId) {
                        targetOpacity = 0.8;
                        edge.userData.isActive = true;
                    } else {
                        targetOpacity = 0.05;
                        edge.userData.isActive = false;
                    }
                }

                // Smooth Opacity
                edge.material.opacity = THREE.MathUtils.lerp(edge.material.opacity, targetOpacity, LERP_FACTOR);
                edge.material.needsUpdate = true;

                // Animate Curve "Breathing"
                if (edge.userData.curve && edge.userData.isActive) {
                    const mid = edge.userData.curve.v1;
                    mid.y += Math.sin(time * 2) * 0.1;
                    edge.geometry.setFromPoints(edge.userData.curve.getPoints(50));
                    edge.geometry.attributes.position.needsUpdate = true;
                }
            });

            // 3. UPDATE PARTICLES (Simple Flow)
            if (particlesRef.current) {
                for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                    const p = particlesRef.current[i];
                    p.progress += p.speed;
                    if (p.progress >= 1) {
                        scene.remove(p.mesh);
                        particlesRef.current.splice(i, 1);
                    } else {
                        p.mesh.position.copy(p.curve.getPoint(p.progress));
                    }
                }
            }

            renderer.render(scene, camera);
        };
        animate();


        // Initial Sizing
        const updateDimensions = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        updateDimensions();

        // Resize Observer for Container (Centers graph when sidebars toggle)
        const resizeObserver = new ResizeObserver(() => {
            updateDimensions();
        });
        resizeObserver.observe(containerRef.current);

        // Particle Spawner with "Particle Velocity" Formula
        const throughput_constant = 0.0002;

        const particleInterval = setInterval(() => {
            // Only spawn particles if there is REAL active flow (TPS > 0)
            if (flowEnabledRef.current && tpsRef.current > 0 && edgesRef.current.length > 0) {
                const randomEdge = edgesRef.current[Math.floor(Math.random() * edgesRef.current.length)];
                if (randomEdge && randomEdge.userData.curve) {

                    const sourceNode = nodesRef.current.find(n => n.id === randomEdge.userData.sourceId);
                    const timestamp_volume = (sourceNode && sourceNode.vitality) ? sourceNode.vitality : (1 + Math.random() * 9);

                    let velocity = throughput_constant * timestamp_volume;
                    velocity = Math.max(0.005, Math.min(velocity, 0.025));

                    let particleType = 'normal';
                    if (sourceNode && (sourceNode.status === 'warning' || sourceNode.vitality < 10)) {
                        particleType = 'fraud';
                    }
                    else if (velocity > 0.015) {
                        particleType = 'high_traffic';
                    }

                    const particle = createParticle(particleType);
                    scene.add(particle);

                    particlesRef.current.push({
                        mesh: particle,
                        curve: randomEdge.userData.curve,
                        speed: velocity,
                        progress: 0
                    });
                }
            }
        }, 100);

        return () => {
            resizeObserver.disconnect();
            if (canvas) {
                canvas.removeEventListener('mousemove', onMouseMove);
                canvas.removeEventListener('click', onClick);
            }
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            clearInterval(particleInterval);
            if (containerRef.current && canvasContainer) containerRef.current.removeChild(canvasContainer);
            renderer.dispose();
            nodesRef.current = [];
            edgesRef.current = [];
            particlesRef.current = [];
        };
    }, [onNodeClick, data]);

    return <div ref={containerRef} className={className || "fixed inset-0 z-0"} style={{
        background: 'radial-gradient(circle at center, #1a202c 0%, #000000 100%)' // Deep Space Gradient
    }} />;
});

function triggerBirthEffect(mesh) {
    const originalScale = mesh.scale.clone();
    const flashColor = new THREE.Color(0xffffff);
    const originalColor = mesh.material.color.clone();

    // Sudden grow and flash
    mesh.scale.multiplyScalar(2.0);
    mesh.material.color.set(flashColor);

    setTimeout(() => {
        mesh.scale.copy(originalScale);
        mesh.material.color.copy(originalColor);
    }, 500);
}

export default React.memo(ThreeGraph);
