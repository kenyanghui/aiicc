'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const stages = [
  { label: '发现', icon: '🔍', glow: '#06b6d4' },
  { label: '定义', icon: '🎯', glow: '#3b82f6' },
  { label: '构思', icon: '💡', glow: '#f59e0b' },
  { label: '原型', icon: '🛠️', glow: '#10b981' },
  { label: '交付', icon: '🚀', glow: '#ec4899' },
];

const colors = {
  bg: '#07070d',
  surface: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.06)',
  text: '#f1f5f9',
  muted: '#64748b',
  accent1: '#06b6d4',
  accent2: '#3b82f6',
  accent3: '#8b5cf6',
};

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleStart = () => {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    const projectId = `demo-${Date.now()}`;
    localStorage.setItem('aiicc_student', JSON.stringify({ name: name.trim(), code }));
    router.push(`/project/${projectId}`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.bg,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Grid pattern overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Gradient orbs */}
      <div
        style={{
          position: 'fixed',
          top: '-20%',
          right: '-10%',
          width: '40%',
          height: '50%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-20%',
          left: '-5%',
          width: '35%',
          height: '45%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '40%',
          left: '50%',
          width: '30%',
          height: '30%',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Nav */}
      <header
        className="home-header"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(7,7,13,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              color: '#fff',
            }}
          >
            A
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}>AIICC</span>
        </div>
        <a
          href="/coach"
          style={{
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '0.4rem 0.875rem',
            fontSize: 13,
            fontWeight: 500,
            color: '#94a3b8',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)';
            e.currentTarget.style.color = '#06b6d4';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          教练入口 →
        </a>
      </header>

      {/* Main content */}
      <main
        className="home-main"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 57px)',
          padding: '2.5rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: 420, width: '100%' }}>
          {/* Badge */}

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                borderRadius: 9999,
                border: '1px solid rgba(6,182,212,0.2)',
                background: 'rgba(6,182,212,0.06)',
                padding: '0.25rem 0.75rem',
                fontSize: 11,
                fontWeight: 500,
                color: '#22d3ee',
                marginBottom: '1.5rem',
                animation: 'fadeInUp 0.5s ease-out both',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 9999,
                  background: '#22d3ee',
                  display: 'inline-block',
                  boxShadow: '0 0 6px rgba(6,182,212,0.6)',
                }}
              />
              ICC 大赛 · AI 创新辅导
            </div>

          {/* Headline */}
            <h1
              className="home-headline"
              style={{
                fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: '#f1f5f9',
                margin: 0,
                animation: 'fadeInUp 0.5s ease-out 0.08s both',
              }}
            >
              用 AI 引导
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 200%',
                }}
              >
                完成你的创新项目
              </span>
            </h1>

          {/* Subtitle */}
            <p
              className="home-subtitle"
              style={{
                marginTop: '0.875rem',
                fontSize: 14,
                lineHeight: 1.7,
                color: '#64748b',
                animation: 'fadeInUp 0.5s ease-out 0.12s both',
              }}
            >
              五阶段 AI 引导式辅导
              <br />
              从创意到交付，陪你完成 ICC 大赛项目
            </p>

          {/* Stage indicators */}
            <div
              className="home-stage-wrap"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginTop: '2.5rem',
                marginBottom: '0.5rem',
                animation: 'fadeInUp 0.5s ease-out 0.16s both',
              }}
            >
              {stages.map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'transform 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div
                    className="home-stage-icon"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      backdropFilter: 'blur(8px)',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = s.glow;
                      e.currentTarget.style.boxShadow = `0 0 20px ${s.glow}33`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {s.icon}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#475569', letterSpacing: '0.02em' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

          {/* Form card */}
            <div
              className="home-card"
              style={{
                marginTop: '2rem',
                width: '100%',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.03)',
                padding: '1.75rem',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                animation: 'fadeInUp 0.5s ease-out 0.2s both',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.15))',
                  border: '1px solid rgba(6,182,212,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                }}
              >
                <span style={{ fontSize: 20 }}>🚀</span>
              </div>

              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#f1f5f9',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                开始你的项目
              </h2>
              <p
                style={{
                  margin: '0.25rem 0 1.25rem',
                  fontSize: 13,
                  color: '#64748b',
                  textAlign: 'center',
                }}
              >
                输入昵称，立即开始
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="你的昵称"
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)',
                    padding: '0.75rem 1rem',
                    fontSize: 14,
                    color: '#e2e8f0',
                    outline: 'none',
                    transition: 'all 0.25s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)';
                    e.currentTarget.style.background = 'rgba(6,182,212,0.04)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.08)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleStart()}
                />
                <input
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="邀请码（选填）"
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)',
                    padding: '0.75rem 1rem',
                    fontSize: 14,
                    color: '#e2e8f0',
                    outline: 'none',
                    transition: 'all 0.25s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)';
                    e.currentTarget.style.background = 'rgba(6,182,212,0.04)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.08)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleStart()}
                />
                <button
                  onClick={handleStart}
                  disabled={!name.trim() || submitting}
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    padding: '0.75rem 1rem',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#fff',
                    border: 'none',
                    cursor: !name.trim() || submitting ? 'not-allowed' : 'pointer',
                    opacity: !name.trim() || submitting ? 0.3 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 4,
                    transition: 'all 0.2s',
                    background: !name.trim() || submitting
                      ? 'linear-gradient(135deg, #0891b2, #2563eb)'
                      : 'linear-gradient(135deg, #06b6d4, #3b82f6, #6366f1)',
                    boxShadow: name.trim() && !submitting
                      ? '0 4px 24px rgba(6,182,212,0.25)'
                      : 'none',
                  }}
                  onMouseEnter={e => {
                    if (name.trim() && !submitting) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 6px 32px rgba(6,182,212,0.35)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (name.trim() && !submitting) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 24px rgba(6,182,212,0.25)';
                    }
                  }}
                >
                  {submitting ? '创建中…' : '开始冒险'}
                </button>
              </div>

              <p style={{ marginTop: '1rem', fontSize: 11, color: '#475569', textAlign: 'center' }}>
                无需注册 · 免费使用
              </p>
            </div>

          {/* Trust line */}
            <p
              style={{
                marginTop: '1.5rem',
                fontSize: 12,
                color: '#334155',
                textAlign: 'center',
                animation: 'fadeInUp 0.5s ease-out 0.25s both',
              }}
            >
              已帮助 <span style={{ color: '#64748b', fontWeight: 600 }}>100+</span> 学员完成 ICC 项目
            </p>
        </div>
      </main>

      {mounted && (
        <style>{`
          @media (max-width: 640px) {
            .home-main { padding: 1.5rem 1rem !important; }
            .home-card { padding: 1.25rem !important; border-radius: 16px !important; }
            .home-headline { font-size: clamp(1.6rem, 6vw, 2rem) !important; }
            .home-stage-icon { width: 34px !important; height: 34px !important; font-size: 14px !important; border-radius: 10px !important; }
            .home-stage-wrap { gap: 6px !important; }
            .home-header { padding: 0.5rem 0.75rem !important; }
            .home-subtitle { font-size: 13px !important; }
            .home-badge { font-size: 10px !important; padding: 0.2rem 0.6rem !important; }
          }
        `}</style>
      )}
    </div>
  );
}
