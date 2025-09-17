// src/components/KPICard.js
import React, { useState } from 'react';
import { kpiStyles, colors } from '../styles/theme';

const KPICard = ({ icon: Icon, title, value, subtitle, trend, onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div 
      style={{
        ...kpiStyles.card,
        ...(hovered ? kpiStyles.cardHover : {}),
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={onClick ? "button" : "presentation"}
      tabIndex={onClick ? 0 : -1}
      onKeyPress={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div style={kpiStyles.header}>
        <div style={kpiStyles.icon}>
          <Icon size={24} color={colors.accent} />
        </div>
        {trend && (
          <div style={{
            ...kpiStyles.trend,
            ...(trend > 0 ? kpiStyles.trendPositive : kpiStyles.trendNegative)
          }}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      
      <div style={kpiStyles.value}>{value}</div>
      <div style={kpiStyles.label}>{title}</div>
      {subtitle && <div style={kpiStyles.subLabel}>{subtitle}</div>}
    </div>
  );
};

export default KPICard;