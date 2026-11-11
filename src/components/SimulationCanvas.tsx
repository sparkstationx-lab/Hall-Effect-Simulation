/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, FastForward, Eye, Layers, Compass, Zap, AlertCircle } from 'lucide-react';
import { CalculationResults, SimulationParams } from '../types/physics';

interface SimulationCanvasProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  results: CalculationResults;
  darkMode: boolean;
}

interface Particle {
  id: number;
  x: number; // 0 to 1 (fraction of slab length)
  y: number; // -1 to 1 (fraction of slab width)
  z: number; // -1 to 1 (depth)
  vy: number; // Transverse drift speed
  size: number;
  trail: { x: number; y: number }[];
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  params,
  setParams,
  results,
  darkMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Initialize particles on carrier/material change
  useEffect(() => {
    const particles: Particle[] = [];
    const count = 38;
    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        x: Math.random(),
        y: (Math.random() - 0.5) * 1.6,
        z: (Math.random() - 0.5) * 1.2,
        vy: 0,
        size: 5 + Math.random() * 2,
        trail: [],
      });
    }
    particlesRef.current = particles;
  }, [params.carrierType, params.materialId]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Handle HDPI canvas scaling for high DPI displays
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * window.devicePixelRatio || canvas.height !== height * window.devicePixelRatio) {
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
      }
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Canvas Background Field
      ctx.clearRect(0, 0, width, height);
      
      const bgColor = darkMode ? '#0B132B' : '#F8FAFC';
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Subtle Background Grid
      ctx.strokeStyle = darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(226, 232, 240, 0.8)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3D Isometric View Parameters for Semiconductor Slab
      const slabCenterX = width * 0.46;
      const slabCenterY = height * 0.50;
      const slabLength = Math.min(width * 0.50, 400);
      const slabWidth = Math.min(height * 0.30, 140);
      const slabDepth = 55;

      const halfL = slabLength / 2;
      const halfW = slabWidth / 2;

      // Perspective projection helper
      const project = (xFrac: number, yFrac: number, zFrac: number) => {
        const px = slabCenterX + xFrac * slabLength + zFrac * slabDepth * 0.7;
        const py = slabCenterY - yFrac * slabWidth - zFrac * slabDepth * 0.4;
        return { x: px, y: py };
      };

      const topLeftBack = project(-0.5, 0.5, 0.5);
      const topRightBack = project(0.5, 0.5, 0.5);
      const bottomRightBack = project(0.5, -0.5, 0.5);
      const bottomLeftBack = project(-0.5, -0.5, 0.5);

      const topLeftFront = project(-0.5, 0.5, -0.5);
      const topRightFront = project(0.5, 0.5, -0.5);
      const bottomRightFront = project(0.5, -0.5, -0.5);
      const bottomLeftFront = project(-0.5, -0.5, -0.5);

      // --- 1. Draw Magnetic Field Background Overlay (B vectors) ---
      if (params.showFieldLines && Math.abs(params.magneticField) > 0.01) {
        const fieldCols = 8;
        const fieldRows = 5;
        const isInto = params.fieldDirection === 'into';
        ctx.fillStyle = darkMode ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.15)';
        ctx.strokeStyle = darkMode ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.35)';
        ctx.lineWidth = 1.5;

        for (let c = 0; c < fieldCols; c++) {
          for (let r = 0; r < fieldRows; r++) {
            const fx = slabCenterX - halfL * 1.1 + (c / (fieldCols - 1)) * halfL * 2.2;
            const fy = slabCenterY - halfW * 1.1 + (r / (fieldRows - 1)) * halfW * 2.2;

            ctx.beginPath();
            ctx.arc(fx, fy, 11, 0, Math.PI * 2);
            ctx.stroke();

            if (isInto) {
              ctx.beginPath();
              ctx.moveTo(fx - 5, fy - 5);
              ctx.lineTo(fx + 5, fy + 5);
              ctx.moveTo(fx + 5, fy - 5);
              ctx.lineTo(fx - 5, fy + 5);
              ctx.stroke();
            } else {
              ctx.beginPath();
              ctx.arc(fx, fy, 3.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // B Field direction header
        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.fillStyle = darkMode ? '#38BDF8' : '#0284C7';
        const bText = `B-FIELD = ${params.magneticField.toFixed(2)} T (${isInto ? '⊗ INTO SCREEN' : '⊙ OUT OF SCREEN'})`;
        ctx.fillText(bText, slabCenterX - halfL, slabCenterY - halfW - 48);
      }

      // --- 2. Draw Back & Top Faces of Semiconductor Slab ---
      // Back face
      ctx.fillStyle = darkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(241, 245, 249, 0.95)';
      ctx.beginPath();
      ctx.moveTo(topLeftBack.x, topLeftBack.y);
      ctx.lineTo(topRightBack.x, topRightBack.y);
      ctx.lineTo(bottomRightBack.x, bottomRightBack.y);
      ctx.lineTo(bottomLeftBack.x, bottomLeftBack.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = darkMode ? 'rgba(51, 65, 85, 0.8)' : 'rgba(203, 213, 225, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Top face gradient
      const topGradient = ctx.createLinearGradient(topLeftBack.x, topLeftBack.y, topLeftFront.x, topLeftFront.y);
      if (params.carrierType === 'electron') {
        topGradient.addColorStop(0, darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(224, 242, 254, 0.95)');
        topGradient.addColorStop(1, darkMode ? 'rgba(30, 58, 138, 0.85)' : 'rgba(186, 230, 253, 0.95)');
      } else {
        topGradient.addColorStop(0, darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(254, 243, 199, 0.95)');
        topGradient.addColorStop(1, darkMode ? 'rgba(120, 53, 15, 0.85)' : 'rgba(253, 230, 138, 0.95)');
      }
      ctx.fillStyle = topGradient;
      ctx.beginPath();
      ctx.moveTo(topLeftBack.x, topLeftBack.y);
      ctx.lineTo(topRightBack.x, topRightBack.y);
      ctx.lineTo(topRightFront.x, topRightFront.y);
      ctx.lineTo(topLeftFront.x, topLeftFront.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Side Gold Contact Electrodes
      const goldGrad = ctx.createLinearGradient(topLeftBack.x - 14, topLeftBack.y, topLeftFront.x - 14, topLeftFront.y);
      goldGrad.addColorStop(0, '#EAB308');
      goldGrad.addColorStop(0.5, '#FDE047');
      goldGrad.addColorStop(1, '#CA8A04');

      // Left Contact
      ctx.fillStyle = goldGrad;
      ctx.beginPath();
      ctx.moveTo(topLeftBack.x - 14, topLeftBack.y);
      ctx.lineTo(topLeftFront.x - 14, topLeftFront.y);
      ctx.lineTo(bottomLeftFront.x - 14, bottomLeftFront.y);
      ctx.lineTo(bottomLeftBack.x - 14, bottomLeftBack.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#A16207';
      ctx.stroke();

      // Right Contact
      ctx.beginPath();
      ctx.moveTo(topRightBack.x + 14, topRightBack.y);
      ctx.lineTo(topRightFront.x + 14, topRightFront.y);
      ctx.lineTo(bottomRightFront.x + 14, bottomRightFront.y);
      ctx.lineTo(bottomRightBack.x + 14, bottomRightBack.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Front Face of Semiconductor Slab
      const frontGradient = ctx.createLinearGradient(topLeftFront.x, topLeftFront.y, bottomRightFront.x, bottomRightFront.y);
      if (darkMode) {
        frontGradient.addColorStop(0, 'rgba(30, 41, 59, 0.96)');
        frontGradient.addColorStop(1, 'rgba(15, 23, 42, 0.98)');
      } else {
        frontGradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        frontGradient.addColorStop(1, 'rgba(241, 245, 249, 0.98)');
      }
      ctx.fillStyle = frontGradient;
      ctx.beginPath();
      ctx.moveTo(topLeftFront.x, topLeftFront.y);
      ctx.lineTo(topRightFront.x, topRightFront.y);
      ctx.lineTo(bottomRightFront.x, bottomRightFront.y);
      ctx.lineTo(bottomLeftFront.x, bottomLeftFront.y);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = darkMode ? '#64748B' : '#94A3B8';
      ctx.stroke();

      // Material Name Label
      ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = darkMode ? '#CBD5E1' : '#475569';
      ctx.textAlign = 'center';
      const matName = params.materialId === 'silicon_n' ? 'N-Type Silicon Sample' :
                      params.materialId === 'silicon_p' ? 'P-Type Silicon Sample' :
                      params.materialId === 'copper' ? 'Copper Conductor (Dense e⁻)' :
                      params.materialId === 'silver' ? 'Silver Conductor' :
                      params.materialId === 'germanium_n' ? 'N-Type Germanium' : 'Custom Sample';
      ctx.fillText(matName, slabCenterX, slabCenterY + 4);

      // --- 3. Current Wires & Direction Indicators ---
      const isCurrentRight = params.currentDirection === 'positive';
      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 3;

      // Left circuit lead
      ctx.beginPath();
      ctx.moveTo(topLeftFront.x - 14, slabCenterY);
      ctx.lineTo(topLeftFront.x - 75, slabCenterY);
      ctx.stroke();

      // Right circuit lead
      ctx.beginPath();
      ctx.moveTo(topRightFront.x + 14, slabCenterY);
      ctx.lineTo(topRightFront.x + 75, slabCenterY);
      ctx.stroke();

      // Current Flow Label
      if (params.current > 0) {
        ctx.fillStyle = '#EAB308';
        ctx.font = '700 12px "JetBrains Mono", monospace';
        const currentArrowX = isCurrentRight ? topLeftFront.x - 48 : topRightFront.x + 48;
        const arrowDir = isCurrentRight ? '→' : '←';
        ctx.fillText(`I = ${params.current.toFixed(1)} A ${arrowDir}`, currentArrowX, slabCenterY - 14);
      }

      // --- 4. Animate Charge Carrier Particles ---
      const isElectron = params.carrierType === 'electron';
      const particleColor = isElectron ? '#06B6D4' : '#F97316'; // Cyan vs Orange
      const particleGlow = isElectron ? 'rgba(6, 182, 212, 0.45)' : 'rgba(249, 115, 22, 0.45)';
      const particleLabel = isElectron ? '-' : '+';

      const speedMultiplier = params.particleSpeedScale * (params.isSimulating ? 1 : 0);
      const baseVelocityX = isElectron
        ? (isCurrentRight ? -0.38 : 0.38)
        : (isCurrentRight ? 0.38 : -0.38);

      const forceDirection = results.lorentzForceDirection;
      let targetVy = 0;
      if (forceDirection === 'up') targetVy = 0.48;
      if (forceDirection === 'down') targetVy = -0.48;

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (params.isSimulating) {
          p.x += baseVelocityX * dt * speedMultiplier;
          p.vy = p.vy * 0.92 + targetVy * 0.08;
          p.y += p.vy * dt * speedMultiplier;

          if (p.x > 1) {
            p.x = 0;
            p.y = (Math.random() - 0.5) * 1.5;
            p.trail = [];
          } else if (p.x < 0) {
            p.x = 1;
            p.y = (Math.random() - 0.5) * 1.5;
            p.trail = [];
          }

          if (p.y > 0.82) p.y = 0.82;
          if (p.y < -0.82) p.y = -0.82;

          if (params.showTrajectoryTrails && Math.random() < 0.45) {
            p.trail.push({ x: p.x, y: p.y });
            if (p.trail.length > 9) p.trail.shift();
          }
        }

        const pFracX = p.x - 0.5;
        const pFracY = p.y * 0.45;
        const pFracZ = p.z * 0.4;
        const pos = project(pFracX, pFracY, pFracZ);

        // Render Particle Trails
        if (params.showTrajectoryTrails && p.trail.length > 1) {
          ctx.beginPath();
          for (let t = 0; t < p.trail.length; t++) {
            const ptPos = project(p.trail[t].x - 0.5, p.trail[t].y * 0.45, p.z * 0.4);
            if (t === 0) ctx.moveTo(ptPos.x, ptPos.y);
            else ctx.lineTo(ptPos.x, ptPos.y);
          }
          ctx.strokeStyle = particleGlow;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Outer Glow Aura
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.size + 4, 0, Math.PI * 2);
        ctx.fillStyle = particleGlow;
        ctx.fill();

        // Inner Particle Circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Plus/Minus Charge Symbol
        ctx.font = '700 10px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(particleLabel, pos.x, pos.y);
      }

      // --- 5. Draw Charge Badges on Top/Bottom Surfaces ---
      const topSign = results.chargeAccumulationTop;
      const bottomSign = results.chargeAccumulationBottom;

      if (topSign !== '0' && Math.abs(results.hallVoltage) > 1e-9) {
        const badgeCols = 7;
        for (let b = 0; b < badgeCols; b++) {
          const frac = -0.42 + (b / (badgeCols - 1)) * 0.84;
          const posTop = project(frac, 0.53, 0);
          const posBottom = project(frac, -0.53, 0);

          // Top badge
          ctx.beginPath();
          ctx.arc(posTop.x, posTop.y, 8.5, 0, Math.PI * 2);
          ctx.fillStyle = topSign === '+' ? '#EF4444' : '#3B82F6';
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(topSign, posTop.x, posTop.y);

          // Bottom badge
          ctx.beginPath();
          ctx.arc(posBottom.x, posBottom.y, 8.5, 0, Math.PI * 2);
          ctx.fillStyle = bottomSign === '+' ? '#EF4444' : '#3B82F6';
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(bottomSign, posBottom.x, posBottom.y);
        }
      }

      // --- 6. Digital Voltmeter Dashboard ---
      const probeTopPos = project(0, 0.53, 0);
      const probeBottomPos = project(0, -0.53, 0);

      const vmX = width - 155;
      const vmY = 70;
      const vmWidth = 135;
      const vmHeight = 105;

      // Probe Wires
      ctx.lineWidth = 2.5;

      // Probe A Wire (Red)
      ctx.strokeStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(probeTopPos.x, probeTopPos.y);
      ctx.lineTo(probeTopPos.x, vmY + 30);
      ctx.lineTo(vmX, vmY + 30);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(probeTopPos.x, probeTopPos.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#EF4444';
      ctx.fill();

      // Probe B Wire (Blue)
      ctx.strokeStyle = '#3B82F6';
      ctx.beginPath();
      ctx.moveTo(probeBottomPos.x, probeBottomPos.y);
      ctx.lineTo(probeBottomPos.x, vmY + 72);
      ctx.lineTo(vmX, vmY + 72);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(probeBottomPos.x, probeBottomPos.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#3B82F6';
      ctx.fill();

      // Voltmeter Container Body
      ctx.fillStyle = darkMode ? '#1E293B' : '#FFFFFF';
      ctx.strokeStyle = darkMode ? '#475569' : '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(vmX, vmY, vmWidth, vmHeight, 12);
      ctx.fill();
      ctx.stroke();

      // Voltmeter Glass Screen
      ctx.fillStyle = darkMode ? '#020617' : '#0F172A';
      ctx.beginPath();
      ctx.roundRect(vmX + 10, vmY + 12, vmWidth - 20, 50, 8);
      ctx.fill();

      // Digital Readout
      ctx.font = '700 15px "JetBrains Mono", monospace';
      const vVal = results.hallVoltageMilliVolts;
      let displayStr = '0.000 mV';
      if (Math.abs(vVal) >= 0.001) {
        displayStr = `${vVal > 0 ? '+' : ''}${vVal.toFixed(3)} mV`;
      } else if (Math.abs(results.hallVoltageMicroVolts) >= 0.01) {
        displayStr = `${results.hallVoltageMicroVolts > 0 ? '+' : ''}${results.hallVoltageMicroVolts.toFixed(1)} µV`;
      }

      ctx.fillStyle = vVal > 0 ? '#10B981' : (vVal < 0 ? '#F43F5E' : '#94A3B8');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayStr, vmX + vmWidth / 2, vmY + 37);

      ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = darkMode ? '#94A3B8' : '#64748B';
      ctx.fillText('DIGITAL VOLTMETER', vmX + vmWidth / 2, vmY + 74);
      ctx.fillText('Probe A - Probe B', vmX + vmWidth / 2, vmY + 88);

      // --- 7. Force Vectors Overlay ---
      if (params.showForceVectors && Math.abs(params.magneticField) > 0.01 && Math.abs(params.current) > 0.01) {
        const centerPos = project(0, 0, 0);

        if (results.lorentzForceDirection !== 'none') {
          const fDirY = results.lorentzForceDirection === 'up' ? -52 : 52;
          ctx.strokeStyle = '#EC4899';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerPos.x, centerPos.y);
          ctx.lineTo(centerPos.x, centerPos.y + fDirY);
          ctx.stroke();

          ctx.fillStyle = '#EC4899';
          ctx.beginPath();
          ctx.arc(centerPos.x, centerPos.y + fDirY, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('F_L', centerPos.x + 12, centerPos.y + fDirY / 2);
        }

        const vDirX = isElectron
          ? (isCurrentRight ? -52 : 52)
          : (isCurrentRight ? 52 : -52);
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(centerPos.x, centerPos.y);
        ctx.lineTo(centerPos.x + vDirX, centerPos.y);
        ctx.stroke();

        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#10B981';
        ctx.fillText('v_d', centerPos.x + vDirX + 8, centerPos.y + 4);
      }

      // --- 8. 3D Coordinates Legend ---
      const axisX = 45;
      const axisY = height - 40;
      const axisLen = 28;

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(axisX, axisY);
      ctx.lineTo(axisX + axisLen, axisY);
      ctx.stroke();
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#EF4444';
      ctx.fillText('X (I)', axisX + axisLen + 8, axisY + 3);

      ctx.strokeStyle = '#22C55E';
      ctx.beginPath();
      ctx.moveTo(axisX, axisY);
      ctx.lineTo(axisX, axisY - axisLen);
      ctx.stroke();
      ctx.fillStyle = '#22C55E';
      ctx.fillText('Y (V_H)', axisX - 4, axisY - axisLen - 6);

      ctx.strokeStyle = '#3B82F6';
      ctx.beginPath();
      ctx.moveTo(axisX, axisY);
      ctx.lineTo(axisX - 16, axisY + 12);
      ctx.stroke();
      ctx.fillStyle = '#3B82F6';
      ctx.fillText('Z (B)', axisX - 26, axisY + 18);

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [params, results, darkMode]);

  return (
    <div className="relative w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Simulation Top Bar Controls */}
      <div className="px-4 py-3 bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setParams(prev => ({ ...prev, isSimulating: !prev.isSimulating }))}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.98] ${
              params.isSimulating
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
            }`}
          >
            {params.isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{params.isSimulating ? 'Pause Motion' : 'Start Motion'}</span>
          </button>

          {/* Speed Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-700/60 rounded-xl">
            <button
              onClick={() => setParams(prev => ({ ...prev, particleSpeedScale: 0.5 }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                params.particleSpeedScale === 0.5
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              0.5x
            </button>
            <button
              onClick={() => setParams(prev => ({ ...prev, particleSpeedScale: 1.0 }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                params.particleSpeedScale === 1.0
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              1.0x
            </button>
            <button
              onClick={() => setParams(prev => ({ ...prev, particleSpeedScale: 2.0 }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                params.particleSpeedScale === 2.0
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2.0x
            </button>
          </div>
        </div>

        {/* Display Toggles */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-700 dark:text-slate-300">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showForceVectors}
              onChange={e => setParams(prev => ({ ...prev, showForceVectors: e.target.checked }))}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Force Vectors</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showFieldLines}
              onChange={e => setParams(prev => ({ ...prev, showFieldLines: e.target.checked }))}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>B-Field Overlay</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showTrajectoryTrails}
              onChange={e => setParams(prev => ({ ...prev, showTrajectoryTrails: e.target.checked }))}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Particle Trails</span>
          </label>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative w-full h-[430px] sm:h-[490px]">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Live Status Telemetry Bar */}
      <div className="px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>
            Lorentz Force: {results.lorentzForceDirection.toUpperCase()} deflection
          </span>
          <span className="text-slate-400 dark:text-slate-600">|</span>
          <span>
            Drift Velocity: {(results.driftVelocity * 1e3).toFixed(3)} mm/s
          </span>
        </div>
        <div>
          <span>
            Carrier: {params.carrierType === 'electron' ? 'e⁻ (Electrons)' : 'h⁺ (Holes)'}
          </span>
        </div>
      </div>
    </div>
  );
};
