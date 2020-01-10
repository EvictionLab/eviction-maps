import { Injectable, EventEmitter } from '@angular/core';
import { select, selectAll } from 'd3-selection';
import { transition } from 'd3-transition';
import { scaleLinear, scaleBand } from 'd3-scale';
import { easePoly } from 'd3-ease';
import { axisRight, axisBottom, axisLeft, axisTop } from 'd3-axis';
import { extent, max, bisector, scan } from 'd3-array';
import { format } from 'd3-format';
import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom';
import { lineChunked } from 'd3-line-chunked';
import { area } from 'd3-shape';
import { interpolatePath } from 'd3-interpolate-path';
import * as _merge from 'lodash.merge';

@Injectable()
export class GraphService {
  el;
  svg;
  data: any = [];
  settings = {
    id: 'd3graph',
    props: { x: 'x', y: 'y', ci: 'ci', ciH: 'ciH', ciL: 'ciL' },
    margin: { left: 48, right: 10, top: 10, bottom: 48 },
    axis: {
      x: { position: 'bottom', label: 'x', invert: false, extent: [], minVal: null, maxVal: null },
      y: { position: 'left', label: 'y', invert: false, extent: [], minVal: null, maxVal: null }
    },
    transition: { ease: easePoly, duration: 1000 },
    zoom: { enabled: false, min: 1, max: 10 },
    ci: {
      display: true
    },
    debug: false
  };
  barHover = new EventEmitter();
  barClick = new EventEmitter();
  private type;
  private zoomBehaviour;
  private width;
  private height;
  private d3el;
  private container;
  private dataContainer;
  private dataRect; // rectangle around the bounds of the graph data
  private clip;
  private defs;
  private scales;
  private transform = zoomIdentity;
  private created = false;
  private bisectX = bisector((d) => d[this.settings.props.x]).left;
  private title;
  private desc;
  private legacyAreaData;

  /**
   * initializes the SVG element for the graph
   * @param settings graph settings
   */
  create(el, data, settings = {}): GraphService {
    this.el = el;
    this.d3el = select(this.el);
    this.updateSettings(settings);
    // build the SVG if it doesn't exist yet
    if (!this.svg && this.d3el) {
      this.createSvg();
    }
    this.setDimensions();
    this.addZoomBehaviour();
    this.created = true;
    if (data) { this.update(data); }
    return this;
  }

  isCreated() { return this.created; }
  isLineGraph() { return this.type === 'line'; }

  /**
   * Sets the data for the graph and updates the view
   * @param data new data for the graph
   * @param type override the type of graph to render
   */
  update(data, type?) {
    this.setType(type ? type : this.detectTypeFromData(data));
    this.svg.attr('class', this.type === 'line' ? 'line-graph' : 'bar-graph');
    this.data = data;
    this.updateView();
  }

  /**
   * Adds axis and lines
   * If any arguments are passed the rendered elements will not transition into place
   */
  updateView(...args) {
    this.setDimensions();
    this.transform = zoomTransform(this.svg.node()) || zoomIdentity;
    this.scales = this.getScales();
    this.updateTitleDesc();
    this.renderAxis(this.settings.axis.x, this.transform, args.length > 0)
      .renderAxis(this.settings.axis.y, this.transform, args.length > 0);
    if (this.type === 'line') {
      this.renderLines();
    } else {
      this.renderBars();
    }
  }

  /**
   * Transitions the graph to the range provided by x1 and x2
   */
  setVisibleRange(x1, x2): GraphService {
    const pxWidth = Math.abs(this.scales.x(x1) - this.scales.x(x2));
    const spaceAvailable = this.width;
    const scaleAmount = Math.min((spaceAvailable / pxWidth), this.settings.zoom.max);
    const scaledWidth = pxWidth * scaleAmount;
    const emptySpace = ((spaceAvailable - scaledWidth) / 2);
    this.transform = zoomIdentity.scale(scaleAmount)
      .translate((-1 * this.scales.x(x1)) + (emptySpace / scaleAmount), 0);
    this.svg.transition()
      .ease(this.settings.transition.ease)
      .duration(this.settings.transition.duration)
      .call(this.zoomBehaviour.transform, this.transform);
    return this;
  }

  /**
   * Sets the type of graph, 'line' or 'bar'.  If switching from one type to another,
   * the render functions for the old type are called to clear out any rendered data.
   * @param type type of graph to switch to
   */
  setType(type: string) {
    // console.log('setType');
    if (this.type !== type) {
      const oldType = this.type;
      this.type = type;
      if (oldType === 'line') {
        this.renderLines();
      }
      if (oldType === 'bar') { this.renderBars(); }
    }
  }

  /**
   * Creates an axis for graph element
   */
  renderAxis(settings, transform = this.transform, blockTransition = false): GraphService {
    const axisType =
      (settings.position === 'top' || settings.position === 'bottom') ? 'x' : 'y';
    const axisGenerator = this.getAxisGenerator(settings);
    // if line graph, scale axis based on transform
    const scale = (axisType === 'x') ?
      (this.type === 'line' ? transform.rescaleX(this.scales.x) : this.scales.x) :
      this.scales.y;

    // if called from a mouse event (blockTransition = true), call the axis generator
    // if transition is programatically triggered, transition to the new axis position
    if (blockTransition) {
      this.container.selectAll('g.axis-' + axisType)
        .call(axisGenerator.scale(scale));
    } else {
      this.container.selectAll('g.axis-' + axisType)
        .transition().duration(this.settings.transition.duration)
        .call(axisGenerator.scale(scale));
    }
    // update axis label
    this.container.selectAll('g.axis-' + axisType + ' .label-' + axisType)
      .text(this.settings.axis[axisType]['label'] || '');
    return this;
  }

  /**
   * Renders areas to convey confidence interval for bars
   * @return Boolean
   */
  renderBarCI() {
    // console.log('renderBarCI()');
    // Gather & bind data.
    const barData = (this.type === 'bar' ? this.data : []);
    // Remove all existing bars
    const barCIs = this.dataContainer.selectAll('.bar-ci').data(barData);
    const barCIsEnter = barCIs.enter().append('rect');
    const self = this;
    const displayCI = this.settings && this.settings.ci && this.settings.ci &&   this.settings.ci.display;

    // transition out bars no longer present
    barCIs.exit()
      .attr('class', (d, i) => 'bar-ci bar-ci-exit bar-ci-' + i)
      .transition()
      .ease(this.settings.transition.ease)
      .duration(this.settings.transition.duration)
      .attr('height', 0)
      .attr('y', (d) => {
        return this.height;
      })
      .remove();

    const update = () => {
      // console.log('update');
      barCIs
        .transition()
        .ease(this.settings.transition.ease)
        .duration(this.settings.transition.duration)
        .attr('class', (d, i) => 'bar-ci bar-ci-' + i)
        .attr('x', (d) => this.scales.x(d.data[0][this.settings.props.x]))
        .attr('width', this.scales.x.bandwidth())
        .attr('height', (d) => {
          return displayCI ?
          (this.height - Math.max(0, this.scales.y(d.data[0][this.settings.props.ciH] - d.data[0][this.settings.props.ciL]))) : 0;
        })
        .attr('y', (d) => {
          return displayCI ?
          (Math.max(0, this.scales.y(d.data[0][this.settings.props.ciH]))) : this.scales.y(d.data[0][this.settings.props.y]);
        });
    };

    if (this.type === 'bar') {
      // update bars with new data
      update();

      // add bars for new data
      barCIsEnter
        .attr('class', (d, i) => 'bar-ci bar-ci-enter bar-ci-' + i)
        .attr('x', (d) => this.scales.x(d.data[0][this.settings.props.x]))
        .attr('y', (d) => {
          return this.height;
          // return Math.max(0, this.scales.y(d.data[0][this.settings.props.ciL]));
        })
        .attr('width', this.scales.x.bandwidth())
        .attr('height', 0)
        .transition()
        .delay(this.settings.transition.duration * 4)
        .ease(this.settings.transition.ease)
        .duration(this.settings.transition.duration)
        .attr('height', (d) => {
          return displayCI ?
          (this.height - Math.max(0, this.scales.y(d.data[0][this.settings.props.ciH] - d.data[0][this.settings.props.ciL]))) : 0;
        })
        .attr('y', (d) => {
          // return Math.max(0, this.scales.y(d.data[0][this.settings.props.ciH]));
          return displayCI ?
          (Math.max(0, this.scales.y(d.data[0][this.settings.props.ciH]))) : this.scales.y(d.data[0][this.settings.props.y]);
        });
    }
  }

  /**
   * Render bars for the data
   */
  renderBars() {
    const barData = (this.type === 'bar' ? this.data : []);
    const bars = this.dataContainer.selectAll('.bar').data(barData, (d) => d.id);
    const self = this;

    // transition out bars no longer present
    bars.exit()
      .attr('class', (d, i) => 'bar bar-exit bar-' + i)
      .transition()
      .ease(this.settings.transition.ease)
      .duration(this.settings.transition.duration)
      .attr('height', 0)
      .attr('y', this.height)
      .remove();
      // .on('end', this.renderBarCI());

    const update = () => {
      // console.log('bars update()');
      bars.transition().ease(this.settings.transition.ease)
        .duration(this.settings.transition.duration)
        .attr('class', (d, i) => 'bar bar-' + i)
        .attr('height', (d) => Math.max(
          0, this.height - this.scales.y(this.getBarDisplayVal(d.data[0][this.settings.props.y], this.scales.y))
        ))
        .attr('y', (d) => this.scales.y(this.getBarDisplayVal(d.data[0][this.settings.props.y], this.scales.y)))
        .attr('x', (d) => this.scales.x(d.data[0][this.settings.props.x]))
        .attr('width', this.scales.x.bandwidth());
        // .on('end', this.renderBarCI());
    };

    if (this.type === 'bar') {
      // update bars with new data
      update();

      // add bars for new data
      bars.enter().append('rect')
        .attr('class', (d, i) => 'bar bar-enter bar-' + i)
        .on('mouseover', function(d) { self.barHover.emit({...d, ...self.getBarRect(this), el: this }); })
        .on('mouseout',  function(d) { self.barHover.emit(null); })
        .on('click',  function(d) { self.barClick.emit({...d, ...self.getBarRect(this), el: this }); })
        .attr('x', (d) => this.scales.x(d.data[0][this.settings.props.x]))
        .attr('y', this.height)
        .attr('width', this.scales.x.bandwidth())
        .attr('height', 0)
        .transition().ease(this.settings.transition.ease)
          .duration(this.settings.transition.duration)
          .attr('height', (d) => Math.max(0, this.height - this.scales.y(d.data[0][this.settings.props.y])))
          .attr('y', (d) => this.scales.y(d.data[0][this.settings.props.y]));
          // .on('end', this.renderBarCI());
    }
    this.renderBarCI();
    return this;
  }

  /**
   * Renders areas to convey confidence interval for lines
   * @return Boolean
   */
  renderLineCI() {
    // console.log('renderLineCI()');

    const transform = this.transform;
    const lineData = (this.type === 'line' ? this.data : []);
    const extent = this.getExtents();

    // Construct area data before binding data (because we need
    // a bit different info than the lines themselves).
    const areaData = [];
    lineData.forEach((el, i) => {
      const _data = el.data;
      const ptArr = [];
      // Additional index to track lines with missing dates.
      let incr = 0;
      _data.forEach((item, ind) => {
        const _ciH = item.ciH;
        const _ciL = item.ciL;
        // Check for stretches with missing y coords
        let areaPrev = false;
        let areaNext = false;
        if (_data[ind + 1]) {
          if ( _data[ind + 1]['y'] === undefined) {
            areaNext = true;
          }
        }
        if (_data[ind - 1]) {
          if ( _data[ind - 1]['y'] === undefined) {
            areaPrev = true;
          }
        }
        // Build the item area coords and any closing coords
        // before or after an undefined stretch.
        let _areaObj = {};
        if (item.y > -1) {
          if (!!areaPrev) {
            ptArr.push({
              x: this.scales.x(item.x),
              y: this.scales.y(item.y),
              y1: this.scales.y(item.y),
              y0: this.scales.y(item.y)
            });
          }
          _areaObj = {
            x: this.scales.x(item.x),
            y: this.scales.y(item.y),
            y1: this.scales.y(_ciH),
            y0: this.scales.y(_ciL)
          };
          ptArr.push(_areaObj);
          if (!!areaNext) {
            ptArr.push({
              x: this.scales.x(item.x),
              y: this.scales.y(item.y),
              y1: this.scales.y(item.y),
              y0: this.scales.y(item.y)
            });
          }
          incr++;
        }
      });
      areaData.push(ptArr);
    });
    // console.log('areaData');
    // console.log(areaData);

    // where y = bottom
    const flatAreaCoords = area()
      .x((d: any, index: any, da: any) => 0)
      .y0( (d: any) => this.scales.y(extent.y[0]))
      .y1( (d: any) => this.scales.y(extent.y[0]));

    // where y0 and y1 = y
    const flatAreaCoordsLine = area()
      .x( (d: any) => d.x)
      .y0( (d: any) => d.y)
      .y1( (d: any) => d.y);

    const flatArea = (el) => {
      return el
        .attr('d', flatAreaCoords)
        .attr('stroke-opacity', 0)
        .attr('fill-opacity', 0);
    };

    const lineArea = (el) => {
      return el
        .attr('d', flatAreaCoordsLine)
        .attr('stroke-opacity', 0)
        .attr('fill-opacity', 0);
    };

    // Endpoint to transition to CI visibility.
    const valueAreaCoords = area()
      .x( (d: any) => d.x)
      .y0( (d: any) => d.y0)
      .y1( (d: any) => d.y1);

    const valueArea = (el) => {
      return el
        .attr('d', valueAreaCoords)
        .attr('stroke-opacity', 1)
        .attr('fill-opacity', 0.2)
        .attr('transform', 'translate(' + transform.x + ',0)scale(' + transform.k + ',1)')
        .attr('vector-effect', 'non-scaling-stroke');
    };

    // Establish areas and enter() collection
    const areas = this.dataContainer.selectAll('g.area').data(areaData);
    // console.log('areas');
    // console.log(areas);
    const areasEnter = areas
      .enter()
      .append('g')
      .attr('class', (d, i) => 'area area-' + i)
      .append('path');

    // Shrink the areas.
    areas
      .select('path')
      .transition()
      .ease(this.settings.transition.ease)
      .duration(this.settings.transition.duration / 2)
      .call(lineArea);

    // transition out lines no longer present
    areas
      .exit()
      .attr('class', (d, i) => 'area area-exit area-' + i)
      .select('path')
      .transition()
      .ease(this.settings.transition.ease)
      .duration(this.settings.transition.duration / 2)
      .call(lineArea)
      .select(function() { return this.parentNode; })
      .remove();

    if (this.type === 'line') {
      // Transition from flat line to full ci "padding" on enter
      if (this.settings &&
        this.settings.ci &&
        this.settings.ci &&
        this.settings.ci.display) {

        areasEnter
          .transition()
          .ease(this.settings.transition.ease)
          .duration(this.settings.transition.duration)
          .delay(this.settings.transition.duration)
          .call(flatAreaCoordsLine)
          .transition()
          .ease(this.settings.transition.ease)
          .duration(this.settings.transition.duration)
          .call(valueArea);

        areas
          .select('path')
          .transition()
          .delay(this.settings.transition.duration)
          .ease(this.settings.transition.ease)
          .duration(this.settings.transition.duration)
          .call(valueArea);
      }
    }
    this.legacyAreaData = areaData;
  }

  /**
   * Renders lines for any data in the data set.
   */
  renderLines(transform = this.transform) {
    // console.log('renderLines()');
    this.renderLineCI();
    const lineData = (this.type === 'line' ? this.data : []);
    const extent = this.getExtents();
    const lines = this.dataContainer.selectAll('g.line').data(lineData, (d) => d.id);
    const linesEnter = lines.enter().append('g')
      .attr('class', (d, i) => 'line line-' + i);

    const flatLine = lineChunked()
      .accessData(d => d.data)
      .defined((d: any) => !isNaN(d[this.settings.props.y]))
      .x((d: any, index: any, da: any) => 0)
      .y(this.scales.y(extent.y[0]))
      .pointAttrs({ r: 0 });

    const valueLine = lineChunked()
      .accessData(d => d.data)
      .defined((d: any) => !isNaN(d[this.settings.props.y]))
      .x((d: any, index: any, da: any) => this.scales.x(d.x))
      .y((d: any) => this.scales.y(d[this.settings.props.y]))
      .lineAttrs({
        class: (d, i) => 'line line-' + i,
        transform: 'translate(' + transform.x + ',0)scale(' + transform.k + ',1)',
        vectorEffect: 'non-scaling-stroke',
        'stroke-linecap': 'round'
      })
      .gapStyles({ 'stroke-opacity': 0 })
      .pointAttrs({ r: 5 });

    const delay = (this.type === 'line') ? this.settings.transition.duration : 0;

    // Transition from flat line on enter
    linesEnter.call(flatLine)
      .transition()
      .delay(this.settings.transition.duration)
      .ease(this.settings.transition.ease)
      .duration(delay)
      .call(valueLine);

    lines.transition()
      .ease(this.settings.transition.ease)
      .delay(this.settings.transition.duration)
      .duration(delay)
      .call(valueLine);

    // transition out lines no longer present
    lines.exit()
      .attr('class', (d, i) => 'line line-exit line-' + i)
      .transition()
      .delay(delay)
      .ease(this.settings.transition.ease)
      .duration(this.settings.transition.duration)
      .call(flatLine)
      .remove();

    return this;
  }

  /**
   * Transitions back to the default zoom for the graph
   */
  resetZoom(): GraphService {
    this.svg.transition()
      .ease(this.settings.transition.ease)
      .duration(this.settings.transition.duration)
      .call(this.zoomBehaviour.transform, zoomIdentity);
    return this;
  }

  /**
   * Overrides any provided graph settings
   * @param settings graph settings
   */
  updateSettings(settings = {}) {
    this.settings = _merge(this.settings, settings);
    this.log('updated settings', settings);
  }

  /**
   * Sets the width and height of the graph and updates any containers
   */
  setDimensions(margin = this.settings.margin) {
    this.width = this.el.clientWidth - margin.left - margin.right;
    this.height =
      this.el.getBoundingClientRect().height - margin.top - margin.bottom;
    // only set dimensions if width and height are valid
    if (this.width > 0 && this.height > 0) {
      this.svg
        .attr('width', this.width + margin.left + margin.right)
        .attr('height', this.height + margin.top + margin.bottom);
      this.container.attr('width', this.width).attr('height', this.height)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      this.dataContainer.attr('width', this.width).attr('height', this.height)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      this.clip.attr('width', this.width).attr('height', this.height);
      this.dataRect.attr('width', this.width).attr('height', this.height)
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      this.svg.selectAll('g.axis-x')
        .attr('transform', this.getAxisTransform(this.settings.axis.x.position))
        .selectAll('.label-x')
          .attr('transform', 'translate(' + this.width / 2 + ',' + margin.bottom + ')')
          .attr('text-anchor', 'middle')
          .attr('dy', -10)
          ;
      this.svg.selectAll('g.axis-y')
        .attr('transform', this.getAxisTransform(this.settings.axis.y.position))
        .selectAll('.label-y')
          .attr('transform', 'rotate(-90) translate(' + -this.height / 2 + ',' + -margin.left + ')')
          .attr('dy', margin.left / 2)
          .attr('text-anchor', 'middle')
          .text(this.settings.axis.y.label);
      this.log('setting dimensions', this.width, this.height, margin);
    } else {
      this.width = 1;
      this.height = 1;
    }

    return this;
  }

  /**
   * Gets the value of the data at the provided x pixel coordinate
   */
  getValueAtPosition(xPos) {
    if (
      xPos < this.settings.margin.left || xPos > (this.settings.margin.left + this.width)
    ) { return null; }
    const graphX = Math.max(0, Math.min((xPos - this.settings.margin.left), this.width));
    const x0 = this.scales.x.invert(graphX);
    return this.getLineValues(x0, 0);
  }

  /**
   * Gets the line values for a previous or next x value
   * @param currentX
   * @param offset
   */
  getLineValues(currentX, offset = 1) {
    // use the first X value if there is no current
    if (!currentX && currentX !== 0) {
      currentX = this.data[0].data[0][this.settings.props.x];
      offset = 0;
    }
    const self = this;
    const values = [];
    selectAll('g.line').each(function (d: any) {
      const i = self.bisectX(d.data, currentX, 1);
      const NULL_VAL = { id: d.id, x: null, y: null, xPos: null, yPos: null };
      if (d.data.length && d.data[i]) {
        const x0 = d.data[i - 1][self.settings.props.x];
        const x1 = d.data[i][self.settings.props.x];
        const closestIndex = (Math.abs(currentX - x0) > Math.abs(currentX - x1)) ? i : i - 1;
        const boundedIndex = Math.min(d.data.length - 1, Math.max(0, closestIndex + offset));
        // Only push value if less than a full stop away from the closest
        const val = self.getLineEventValue(d, boundedIndex, this);
        values.push(Math.abs(currentX - val.x) < 1 ? val : NULL_VAL);
      } else {
        values.push(NULL_VAL);
      }
    });
    return values;
  }

  /**
   * Gets the bar values for a previous or next x value
   * @param currentX
   * @param offset
   */
  getBarValue(currentX, offset = 1) {
    const self = this;
    let newIndex = -1;
    // get the new index, or start at the beginning if there is no current value
    if (!currentX) {
      newIndex = 0;
    } else {
      selectAll('.bar').each(function(d: any, i: number) {
        if (d.data[0][self.settings.props.x] === currentX) {
          newIndex = (i + offset) % self.data.length;
        }
      });
    }
    // get the bar dimensions for the new index and return the data / position
    if (newIndex > -1) {
      const el = selectAll('.bar').filter((d0: any, i) => i === newIndex).node();
      return [{ id: this.data[newIndex].id, ...this.data[newIndex].data[0], ...this.getBarRect(el), el: el }];
    }
    return null;
  }

  /**
   * Display a minimum line for bar graph values that is 1% of the maximum value
   * @param val
   * @param scale
   */
  private getBarDisplayVal(val, scale) {
    const scaleDomain = scale.domain();
    return val >= 0.1 ? val : scaleDomain[scaleDomain.length - 1] * 0.01;
  }

  /**
   * Builds an object to return for DOM events
   * @param dataItem the line data item
   * @param pointIndex the index of the point to get data at
   * @param el the DOM line element
   */
  private getLineEventValue(dataItem, pointIndex, el) {
    let yVal = dataItem.data[pointIndex][this.settings.props.y];
    yVal = this.settings.axis.y.maxVal > 0 ? Math.min(this.settings.axis.y.maxVal, yVal) : yVal;
    return {
      id: dataItem.id,
      ...dataItem.data[pointIndex],
      xPos: (this.settings.margin.left + this.scales.x(dataItem.data[pointIndex][this.settings.props.x])),
      yPos: (this.settings.margin.top + this.scales.y(yVal)),
      el: el
    };
  }

  /** Gets the position and size of a passed `rect` element */
  private getBarRect(el) {
    return {
      top: parseFloat(el.getAttribute('y')) + this.settings.margin.top,
      left: parseFloat(el.getAttribute('x')) + this.settings.margin.left,
      width: parseFloat(el.getAttribute('width')),
      height: parseFloat(el.getAttribute('height'))
    };
  }

  /** Creates the skeleton DOM structure of the SVG */
  private createSvg() {
    this.svg = this.d3el.append('svg');
    this.title = this.svg.append('title');
    this.desc = this.svg.append('desc');
    // data rect
    this.dataRect = this.svg.append('rect')
      .attr('class', 'graph-rect');
    // defs
    this.defs = this.svg.append('defs');
    // gradients
    for (let i = 0; i < 4; i++) {
      const g = this.defs.append('linearGradient').attr('id', 'g' + i)
        .attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', 1);
      g.append('stop').attr('offset', '0%').attr('class', 'g' + i + '-start');
      g.append('stop').attr('offset', '100%').attr('class', 'g' + i + '-end');
    }
    // clip area
    this.clip = this.defs
      .append('clipPath').attr('id', 'data-container')
      .append('rect').attr('x', 0).attr('y', 0);
    // containers for axis
    this.container = this.svg.append('g').attr('class', 'graph-container');
    this.container.append('g').attr('class', 'axis axis-x')
      .append('text').attr('class', 'label-x');
    this.container.append('g').attr('class', 'axis axis-y')
      .append('text').attr('class', 'label-y');
    // masked container for lines and bars
    this.dataContainer = this.svg.append('g')
      .attr('clip-path', 'url(#data-container)')
      .attr('class', 'data-container');
    this.log('created svg', this.svg);
  }

  /**
   * Creates the zoom behaviour for the graph then sets it up based on
   * dimensions and settings
   */
  private addZoomBehaviour(): GraphService {
    this.zoomBehaviour = zoom()
      .scaleExtent([this.settings.zoom.min, this.settings.zoom.max])
      .translateExtent([[0, 0], [this.width, this.height]])
      .extent([[0, 0], [this.width, this.height]])
      .on('zoom', this.updateView.bind(this));
    if (this.settings.zoom.enabled) { this.svg.call(this.zoomBehaviour); }
    return this;
  }

  /**
   * Get the transform based on the axis position
   * @param position
   */
  private getAxisTransform(position: string) {
    switch (position) {
      case 'top':
        return 'translate(0,0)';
      case 'bottom':
        return 'translate(0,' + this.height + ')';
      case 'left':
        return 'translate(0,0)';
      case 'right':
        return 'translate(' + this.width + ',0)';
      default:
        return 'translate(0,0)';
    }
  }

  /**
   * returns the axis generator based the axis settings and graph type
   * @param settings settings for the axis, including position and tick formatting
   */
  private getAxisGenerator(settings: any) {
    let axisGen;
    let scale;
    switch (settings.position) {
      case 'top':
        axisGen = axisTop;
        scale = this.scales.x;
        break;
      case 'bottom':
        axisGen = axisBottom;
        scale = this.scales.x;
        break;
      case 'left':
        axisGen = axisLeft;
        scale = this.scales.y;
        break;
      case 'right':
        axisGen = axisRight;
        scale = this.scales.y;
        break;
    }
    return this.addTicks(axisGen(scale), settings);
  }

  /** Add ticks to an axis */
  private addTicks(axisGen, settings) {
    let axis = axisGen;
    if (settings.hasOwnProperty('ticks') && settings.ticks) {
      axis = axis.ticks(settings.ticks);
    }
    if (settings.hasOwnProperty('tickSize') && settings.tickSize) {
      axis = axis.tickSize(this.getTickSize(settings.tickSize, settings.position));
    }
    if (settings.hasOwnProperty('tickFormat') && settings.tickFormat) {
      axis = axis.tickFormat(format(settings.tickFormat));
    }
    if (settings.hasOwnProperty('tickPadding') && settings.tickPadding) {
      axis = axis.tickPadding(settings.tickPadding);
    }
    this.log('created axis', axis, settings);
    return axis;
  }

  /** Parse the tick size to see if it is a percentage */
  private getTickSize(value, axisPosition: string) {
    if (typeof value === 'string' && value.slice(-1) === '%') {
      const axisType = axisPosition === 'left' || axisPosition === 'right' ? 'y' : 'x';

      return (parseFloat(value) / 100) * (axisType === 'x' ? this.height : this.width );
    }
    return value;
  }

  /**
   * Returns a range for the axis
   */
  private getRange() {
    return {
      x: (this.settings.axis.x.invert ? [this.width, 0] : [0, this.width]),
      y: (this.settings.axis.y.invert ? [0, this.height] : [this.height, 0])
    };
  }

  /** Gets the extents for the x and y axis */
  private getExtents(): { x: Array<number>, y: Array<number> } {
    return {
      x: this.getExtent('x'),
      y: this.getExtent('y')
    };
  }

  /**
   * Gets either the x or y extent
   * @param prop either 'x' or 'y'
   */
  private getExtent(prop: string): Array<number> {
    const axis = this.settings.axis[prop];
    // return if extent is explicitly set
    if (axis.hasOwnProperty('extent') && axis['extent'].length === 2) {
      return axis['extent'];
    }
    // return if there is no data
    if (!this.data.length) { return [0, 1]; }
    // loop through data and create an extent representative of the entire data set
    let xtnt: Array<number>;
    for (const dp of this.data) {
      const setExtent = extent(dp.data, (d) => parseFloat(d[this.settings.props[prop]]));
      xtnt = xtnt ? extent([...xtnt, ...setExtent]) : setExtent;
    }
    // pad y extent by 10%
    xtnt = prop === 'y' ? this.padExtent(xtnt, 0.1, {top: true, bottom: true}) : xtnt;
    // Set min Y to minVal if needed
    if (!isNaN(parseFloat(axis.minVal))) { xtnt[0] = Math.max(axis.minVal, xtnt[0]); }
    // Cap Y extent to maxVal if present
    if (!isNaN(parseFloat(axis.maxVal))) { xtnt[1] = Math.min(xtnt[1], axis.maxVal); }
    return xtnt;
  }

  /**
   * Returns the scales based on the graph type
   */
  private getScales() {
    if (this.type === 'line') {
      const ranges = this.getRange();
      const extents = this.getExtents();
      return {
        x: scaleLinear().range(ranges.x).domain(extents.x),
        y: scaleLinear().range(ranges.y).domain(extents.y)
      };
    } else if (this.type === 'bar') {
      const scales = {
        x: scaleBand().rangeRound([0, this.width]).padding(0.25),
        y: scaleLinear().rangeRound([this.height, 0])
      };
      // Set max Y value in scale to at least minVal, at most maxVal
      let maxY = max(this.data, (d: any) => parseFloat(d.data[0][this.settings.props.y]));
      if (!isNaN(this.settings.axis.y.minVal)) {
        maxY = Math.max(this.settings.axis.y.minVal, maxY);
      }
      if (!isNaN(this.settings.axis.y.maxVal)) {
        maxY = Math.min(this.settings.axis.y.maxVal, maxY);
      }
      // Cap Y domain to maxVal without padding if present
      let yDomain;
      if (this.settings.axis.y.hasOwnProperty('extent') && this.settings.axis.y.extent.length === 2) {
        yDomain = this.settings.axis.y.extent;
      } else {
        yDomain = this.settings.axis.y.maxVal === maxY ? [0, maxY] : this.padExtent([0, maxY], 0.1, { top: true });
      }
      scales.x.domain(this.data.map((d) => d.data[0][this.settings.props.x]));
      scales.y.domain(yDomain);
      return scales;
    }
  }

  /**
   * Returns largest of max and min CI values to add to padding
   * @return Number
   */
  private getMaxCI() {
    // console.log('getMaxCI()');
    const cis = [];
    (this.data).forEach((d) => {
      cis.push((d.data[0].ciH > d.data[0].ciL) ? d.data[0].ciH : d.data[0].ciL);
    });
    return Math.max(...cis);
  }

  /** Pads the min / max of an extent array by the provided amount */
  private padExtent(extent: Array<number>, amount = 0.1, options: any = {}): Array<number> {
    // console.log('padExtent()');
    // const maxCI = this.getMaxCI();
    const padding = ((extent[1] - extent[0]) * amount);
    const min = options.bottom ? extent[0] - padding : extent[0];
    const max = options.top ? extent[1] + padding : extent[1];
    return [min, max];
  }

  /**
   * Attempts to determine the type of graph based on the provided data.
   * If each item in the data set only has one data point, it assumes it is a bar graph
   * Anything else is a line graph.
   * @param data The dataset for the graph
   */
  private detectTypeFromData(data): string {
    for (let i = 0; i < data.length; i++) {
      if (data[i].data.length !== 1) {
        return 'line';
      }
    }
    return 'bar';
  }

  /**
   * Set the title and description for the graph based on settings and also add
   * the aria-labelledby attr as recommended by:
   * https://css-tricks.com/accessible-svgs/
   */
  private updateTitleDesc() {
    this.title
      .attr('id', this.settings.id + '_title')
      .text(this.settings['title'] ? this.settings['title'] : '');
    this.desc
      .attr('id', this.settings.id + '_desc')
      .text(this.settings['description'] ? this.settings['description'] : '');
    this.svg
      .attr('aria-labelledby', `${this.settings.id}_title ${this.settings.id}_desc`);
  }

  /** Wrapper for console logging if debug is enabled */
  private log(...logItems) {
    if (this.settings.debug) {
      console.debug.apply(this, logItems);
    }
  }
}
