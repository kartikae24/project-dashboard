

const Charts = (() => {

  
  
  const PALETTE = [
    '#6366f1', 
    '#06b6d4', 
    '#10b981', 
    '#f59e0b', 
    '#f43f5e', 
    '#8b5cf6', 
    '#ec4899', 
    '#14b8a6', 
  ];

  
  function getCSSVar(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name).trim();
  }

  
  function resolveColor(color) {
    if (!color) return color;
    const match = String(color).match(/^var\(\s*(--[^)]+)\s*\)/);
    if (!match) return color;
    return getCSSVar(match[1]) || color;
  }

  
  function svgEl(tag, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  
  
  
  
  function donut(container, data, options = {}) {
    if (!container || !data?.length) return;

    const {
      size = 180,           
      centerLabel = '',     
      colors = PALETTE,
    } = options;

    const radius = 70;           
    const strokeWidth = 22;      
    const circumference = 2 * Math.PI * radius;
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const cx = size / 2;
    const cy = size / 2;

    
    const svg = svgEl('svg', {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      role: 'img',
      'aria-label': options.title || 'Donut chart'
    });

    
    svg.appendChild(svgEl('circle', {
      cx, cy, r: radius,
      fill: 'none',
      stroke: getCSSVar('--border'),
      'stroke-width': strokeWidth
    }));

    
    let cumulativeOffset = circumference * 0.25; 

    data.forEach((item, i) => {
      const portion = item.value / total;
      const dash    = portion * circumference;
      const gap     = circumference - dash;
      const color   = resolveColor(colors[i % colors.length]);

      const circle = svgEl('circle', {
        cx, cy, r: radius,
        fill: 'none',
        stroke: color,
        'stroke-width': strokeWidth,
        'stroke-dasharray': `${dash} ${gap}`,
        'stroke-dashoffset': -cumulativeOffset,
        'stroke-linecap': 'butt',
        style: 'transition: stroke-dasharray 0.8s ease; cursor: pointer;'
      });

      
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${item.label}: ${item.value} (${Math.round(portion * 100)}%)`;
      circle.appendChild(title);

      svg.appendChild(circle);
      cumulativeOffset += dash;
    });

    
    if (centerLabel) {
      const text = svgEl('text', {
        x: cx, y: cy - 6,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'font-size': '22',
        'font-weight': '700',
        fill: getCSSVar('--text-primary'),
        'font-family': 'Inter, sans-serif'
      });
      text.textContent = centerLabel;
      svg.appendChild(text);

      const subText = svgEl('text', {
        x: cx, y: cy + 16,
        'text-anchor': 'middle',
        'font-size': '11',
        fill: getCSSVar('--text-muted'),
        'font-family': 'Inter, sans-serif'
      });
      subText.textContent = 'projects';
      svg.appendChild(subText);
    }

    
    const legend = document.createElement('div');
    legend.style.cssText = 'display:flex;flex-direction:column;gap:8px;flex:1;min-width:0;';

    data.forEach((item, i) => {
      const color   = colors[i % colors.length];
      const percent = Math.round((item.value / total) * 100);

      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;';

      row.innerHTML = `
        <span style="
          width:10px;height:10px;border-radius:50%;
          background:${color};flex-shrink:0;
        "></span>
        <span style="
          font-size:12px;color:var(--text-secondary);
          flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
        ">${item.label}</span>
        <span style="
          font-size:12px;font-weight:600;
          color:var(--text-primary);flex-shrink:0;
        ">${percent}%</span>
      `;
      legend.appendChild(row);
    });

    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;align-items:center;gap:24px;';
    wrapper.appendChild(svg);
    wrapper.appendChild(legend);

    container.innerHTML = '';
    container.appendChild(wrapper);
  }

  
  
  
  
  function area(container, data, options = {}) {
    if (!container || !data?.length) return;

    const {
      color     = PALETTE[0],
      height    = 160,
      showDots  = true,
      showGrid  = true,
    } = options;

    const W = container.clientWidth || 400;
    const H = height;
    const padL = 36, padR = 16, padT = 16, padB = 32;

    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    let chartData = [...data];
    if (chartData.length === 1) {
      
      const parts = chartData[0].label.split(' ');
      let prevLabel = 'Prev';
      if (parts.length === 2) {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const idx = months.indexOf(parts[0]);
        if (idx !== -1) {
          const prevMonth = idx === 0 ? months[11] : months[idx - 1];
          const prevYear = idx === 0 ? parseInt(parts[1], 10) - 1 : parts[1];
          prevLabel = `${prevMonth} ${prevYear}`;
        }
      }
      chartData.unshift({ label: prevLabel, value: 0 });
    }

    const maxVal = Math.max(...chartData.map(d => d.value), 1);

    
    const points = chartData.map((d, i) => ({
      x: padL + (i / Math.max(chartData.length - 1, 1)) * chartW,
      y: padT + chartH - (d.value / maxVal) * chartH,
      label: d.label,
      value: d.value
    }));

    const svg = svgEl('svg', {
      width: '100%', height: H,
      viewBox: `0 0 ${W} ${H}`,
      role: 'img', 'aria-label': 'Area chart'
    });

    
    const defs = svgEl('defs');
    const gradId = `grad-${Math.random().toString(36).slice(2)}`;
    const grad = svgEl('linearGradient', { id: gradId, x1:'0', y1:'0', x2:'0', y2:'1' });
    const resolvedColor = resolveColor(color);
    const stop1 = svgEl('stop', { offset:'0%',   'stop-color': resolvedColor, 'stop-opacity': '0.3' });
    const stop2 = svgEl('stop', { offset:'100%', 'stop-color': resolvedColor, 'stop-opacity': '0.02' });
    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
    svg.appendChild(defs);

    
    if (showGrid) {
      const gridSteps = 4;
      for (let i = 0; i <= gridSteps; i++) {
        const y = padT + (i / gridSteps) * chartH;
        const line = svgEl('line', {
          x1: padL, y1: y, x2: W - padR, y2: y,
          stroke: getCSSVar('--border'),
          'stroke-width': '1',
          'stroke-dasharray': i === gridSteps ? '0' : '4 4'
        });
        svg.appendChild(line);

        
        const val = Math.round(maxVal - (i / gridSteps) * maxVal);
        const label = svgEl('text', {
          x: padL - 6, y: y + 4,
          'text-anchor': 'end',
          'font-size': '10',
          fill: getCSSVar('--text-muted'),
          'font-family': 'Inter, sans-serif'
        });
        label.textContent = val;
        svg.appendChild(label);
      }
    }

    
    function smoothPath(pts) {
      if (pts.length < 2) return `M ${pts[0].x} ${pts[0].y}`;
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const cpX = (prev.x + curr.x) / 2;
        d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${cpX} ${curr.y}`;
      }
      return d;
    }

    const linePath = smoothPath(points);

    
    const areaPath = `${linePath} L ${points[points.length-1].x} ${padT + chartH} L ${padL} ${padT + chartH} Z`;

    
    svg.appendChild(svgEl('path', {
      d: areaPath,
      fill: `url(#${gradId})`,
      stroke: 'none'
    }));

    
    const lineEl = svgEl('path', {
      d: linePath,
      fill: 'none',
      stroke: resolvedColor,
      'stroke-width': '2.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    });

    
    const totalLen = 9999; 
    lineEl.style.cssText = `
      stroke-dasharray: ${totalLen};
      stroke-dashoffset: ${totalLen};
      transition: stroke-dashoffset 1.2s ease;
    `;
    svg.appendChild(lineEl);

    
    points.forEach((pt, i) => {
      
      const showLabel = chartData.length <= 8 || i % Math.ceil(chartData.length / 8) === 0;

      if (showDots) {
        
        svg.appendChild(svgEl('circle', {
          cx: pt.x, cy: pt.y, r: '5',
          fill: resolvedColor, opacity: '0.2'
        }));
        
        const dot = svgEl('circle', {
          cx: pt.x, cy: pt.y, r: '3',
          fill: resolvedColor, stroke: getCSSVar('--bg-card'), 'stroke-width': '2'
        });
        const title = document.createElementNS('http://www.w3.org/2000/svg','title');
        title.textContent = `${pt.label}: ${pt.value}`;
        dot.appendChild(title);
        svg.appendChild(dot);
      }

      if (showLabel) {
        const xLabel = svgEl('text', {
          x: pt.x, y: H - 6,
          'text-anchor': 'middle',
          'font-size': '9',
          fill: getCSSVar('--text-muted'),
          'font-family': 'Inter, sans-serif'
        });
        xLabel.textContent = pt.label;
        svg.appendChild(xLabel);
      }
    });

    container.innerHTML = '';
    container.appendChild(svg);

    
    Utils.onVisible(container, () => {
      lineEl.style.strokeDashoffset = '0';
    });
  }

  
  
  
  
  function bar(container, data, options = {}) {
    if (!container || !data?.length) return;

    const {
      colors = PALETTE,
      height = 180,
      showValues = true,
    } = options;

    const W = container.clientWidth || 400;
    const H = height;
    const padL = 32, padR = 12, padT = 24, padB = 36;

    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const maxVal = Math.max(...data.map(d => d.value), 1);

    const barGap  = 6;
    const barW    = (chartW / data.length) - barGap;

    const svg = svgEl('svg', {
      width: '100%', height: H,
      viewBox: `0 0 ${W} ${H}`,
      role: 'img', 'aria-label': 'Bar chart'
    });

    
    [0, 0.25, 0.5, 0.75, 1].forEach(frac => {
      const y = padT + chartH - frac * chartH;
      svg.appendChild(svgEl('line', {
        x1: padL, y1: y, x2: W - padR, y2: y,
        stroke: getCSSVar('--border'),
        'stroke-width': '1',
        'stroke-dasharray': frac === 0 ? '0' : '3 3'
      }));
      if (frac > 0) {
        const label = svgEl('text', {
          x: padL - 4, y: y + 3,
          'text-anchor': 'end', 'font-size': '9',
          fill: getCSSVar('--text-muted'), 'font-family': 'Inter, sans-serif'
        });
        label.textContent = Math.round(frac * maxVal);
        svg.appendChild(label);
      }
    });

    
    data.forEach((item, i) => {
      const color  = resolveColor(colors[i % colors.length]);
      const barH   = (item.value / maxVal) * chartH;
      const x      = padL + i * (barW + barGap);
      const y      = padT + chartH - barH;

      
      const rect = svgEl('rect', {
        x, y: padT + chartH,  
        width: barW, height: 0,
        rx: '4', ry: '4',
        fill: color, opacity: '0.85'
      });

      const title = document.createElementNS('http://www.w3.org/2000/svg','title');
      title.textContent = `${item.label}: ${item.value}`;
      rect.appendChild(title);
      svg.appendChild(rect);

      
      if (showValues) {
        const valLabel = svgEl('text', {
          x: x + barW / 2, y: y - 4,
          'text-anchor': 'middle', 'font-size': '9',
          'font-weight': '600',
          fill: getCSSVar('--text-secondary'),
          'font-family': 'Inter, sans-serif',
          opacity: '0'
        });
        valLabel.textContent = item.value;
        svg.appendChild(valLabel);

        
        setTimeout(() => {
          valLabel.style.cssText = 'transition: opacity 0.4s ease 0.8s';
          valLabel.setAttribute('opacity', '1');
        }, 100);
      }

      
      const xLabel = svgEl('text', {
        x: x + barW / 2, y: H - 8,
        'text-anchor': 'middle', 'font-size': '9',
        fill: getCSSVar('--text-muted'), 'font-family': 'Inter, sans-serif'
      });
      xLabel.textContent = item.label.length > 8
        ? item.label.slice(0, 8) + '…'
        : item.label;
      svg.appendChild(xLabel);

      
      Utils.onVisible(container, () => {
        rect.style.cssText = 'transition: height 0.7s cubic-bezier(0.34,1.2,0.64,1), y 0.7s cubic-bezier(0.34,1.2,0.64,1)';
        rect.setAttribute('y', y);
        rect.setAttribute('height', barH);
      });
    });

    container.innerHTML = '';
    container.appendChild(svg);
  }

  
  
  
  
  function horizontalBar(container, data, options = {}) {
    if (!container || !data?.length) return;

    const {
      color      = PALETTE[0],
      showValues = true,
      colors     = null,   
    } = options;

    const maxVal = Math.max(...data.map(d => d.value), 1);

    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-direction:column;gap:10px;';

    data.forEach((item, i) => {
      const barColor = colors ? colors[i % colors.length] : color;
      const pct = (item.value / maxVal) * 100;

      const row = document.createElement('div');
      row.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
          <span style="font-size:12px;color:var(--text-secondary);">${item.label}</span>
          ${showValues ? `<span style="font-size:12px;font-weight:600;color:var(--text-primary);">${item.value}</span>` : ''}
        </div>
        <div style="background:var(--border);border-radius:999px;height:6px;overflow:hidden;">
          <div class="hbar-fill" style="
            height:100%;border-radius:999px;
            background:${barColor};
            width:0%;
            transition:width 0.8s cubic-bezier(0.34,1.1,0.64,1) ${i * 80}ms;
          " data-target="${pct}%"></div>
        </div>
      `;
      wrapper.appendChild(row);
    });

    container.innerHTML = '';
    container.appendChild(wrapper);

    
    Utils.onVisible(container, () => {
      container.querySelectorAll('.hbar-fill').forEach(bar => {
        bar.style.width = bar.dataset.target;
      });
    });
  }

  
  
  
  
  function ring(container, value, options = {}) {
    if (!container) return;
    const {
      color = PALETTE[0],
      size  = 80,
      label = `${value}%`
    } = options;

    const resolvedRingColor = resolveColor(color);
    const r = (size / 2) - 8;
    const circ = 2 * Math.PI * r;
    const fill = (value / 100) * circ;

    const svg = svgEl('svg', {
      width: size, height: size,
      viewBox: `0 0 ${size} ${size}`
    });

    
    svg.appendChild(svgEl('circle', {
      cx: size/2, cy: size/2, r,
      fill: 'none',
      stroke: getCSSVar('--border'),
      'stroke-width': '6'
    }));

    
    const arc = svgEl('circle', {
      cx: size/2, cy: size/2, r,
      fill: 'none',
      stroke: resolvedRingColor,
      'stroke-width': '6',
      'stroke-linecap': 'round',
      'stroke-dasharray': `0 ${circ}`,
      'stroke-dashoffset': circ * 0.25,
      style: 'transition: stroke-dasharray 1s ease;'
    });
    svg.appendChild(arc);

    
    const text = svgEl('text', {
      x: size/2, y: size/2 + 4,
      'text-anchor': 'middle',
      'font-size': '11',
      'font-weight': '700',
      fill: getCSSVar('--text-primary'),
      'font-family': 'Inter, sans-serif'
    });
    text.textContent = label;
    svg.appendChild(text);

    container.innerHTML = '';
    container.appendChild(svg);

    
    Utils.onVisible(container, () => {
      arc.setAttribute('stroke-dasharray', `${fill} ${circ - fill}`);
    });
  }

  
  return { donut, area, bar, horizontalBar, ring, PALETTE };

})();
