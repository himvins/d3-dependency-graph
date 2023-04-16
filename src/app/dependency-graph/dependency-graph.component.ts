import { Component, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-dependency-graph',
  templateUrl: './dependency-graph.component.html',
  styleUrls: ['./dependency-graph.component.scss'],
})
export class DependencyGraphComponent implements OnInit {
  @ViewChild('container', { static: false }) container: { nativeElement: any; } | undefined;
  data: any;
  _svg: any;


  ngOnInit() {
    setTimeout(() => this.renderGraph());
  }

  renderGraph(): void {
    if (this.container) {

      const svg = d3.select(this.container.nativeElement).append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('margin', 50)
        .attr('viewBox', `0 0 1200 1200`)

      svg.append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', '5');

      this._svg = svg;

      this.data = {
        nodes: [
          { id: 'API-1' },
          { id: 'API-2' },
          { id: 'API-3' },
          { id: 'API-4' },
          { id: 'API-5' },
          { id: 'API-6' },
          { id: 'API-7' },
          { id: 'API-8' },
          { id: 'API-9' },
          { id: 'API-10' },
          { id: 'API-11' },
          { id: 'API-12' },
          { id: 'API-13' },
          { id: 'API-14' },
          { id: 'API-15' },
          { id: 'API-16' },
          { id: 'API-17' },
          { id: 'API-18' },
          { id: 'API-19' },
          { id: 'API-20' },
          { id: 'API-21' },
          { id: 'API-22' },
          { id: 'API-23' },
          { id: 'API-24' },
          { id: 'API-25' }
        ],
        links: [
          { source: 'API-1', target: 'API-2' },
          { source: 'API-1', target: 'API-3' },
          { source: 'API-1', target: 'API-4' },
          { source: 'API-2', target: 'API-5' },
          { source: 'API-2', target: 'API-6' },
          { source: 'API-3', target: 'API-6' },
          { source: 'API-3', target: 'API-7' },
          { source: 'API-4', target: 'API-8' },
          { source: 'API-5', target: 'API-9' },
          { source: 'API-6', target: 'API-10' },
          { source: 'API-6', target: 'API-11' },
          { source: 'API-7', target: 'API-12' },
          { source: 'API-8', target: 'API-13' },
          { source: 'API-9', target: 'API-14' },
          { source: 'API-10', target: 'API-15' },
          { source: 'API-11', target: 'API-15' },
          { source: 'API-12', target: 'API-16' },
          { source: 'API-13', target: 'API-17' },
          { source: 'API-13', target: 'API-18' },
          { source: 'API-14', target: 'API-19' },
          { source: 'API-15', target: 'API-20' },
          { source: 'API-16', target: 'API-21' },
          { source: 'API-17', target: 'API-22' },
          { source: 'API-18', target: 'API-23' },
          { source: 'API-19', target: 'API-24' },
          { source: 'API-20', target: 'API-25' }
        ]
      };

      const marker = svg.append('defs')
        .append('marker')
        .style('stroke', '#aaa')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-5 -5 10 10')
        .attr('refX', 14)
        .attr('refY', 0)
        .attr('markerWidth', 4)
        .attr('markerHeight', 3)
        .attr('orient', 'auto');

      marker.append('path')
        .attr('d', 'M -5 -5 L 5 0 L -5 5 Z')
        .attr('fill', '#555');


      const simulation = d3.forceSimulation(this.data.nodes as any)
        .force('link', d3.forceLink(this.data.links).id((d: any) => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-150))
        .force('center', d3.forceCenter(this.container.nativeElement.offsetWidth / 2, this.container.nativeElement.offsetHeight / 2));

      const link = svg.append('g')
        .selectAll('line')
        .data(this.data.links)
        .enter()
        .append('line')
        .style('stroke', '#aaa')
        .style('stroke-width', 5)
        .attr('marker-end', 'url(#arrowhead)')
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);;

      const node = svg.append('g')
        .selectAll('circle')
        .data(this.data.nodes)
        .enter()
        .append('circle')
        .attr('r', 15)
        .style('fill', '#69b3a2')
        .call(drag(simulation) as any)
        .on('contextmenu', (event, d: any) => {
          event.preventDefault();
          this.toggleApiState(d.id);
          this.updateNodeColors();
        })
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);;


      const label = svg.selectAll('text')
        .data(this.data.nodes)
        .enter()
        .append('text')
        .text((d: any) => d.id)
        .attr('x', 30)
        .attr('y', 10)
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

      const handleZoom = (e: any) => {
        label.attr('transform', e.transform);
        node.attr('transform', e.transform);
        link.attr('transform', e.transform);
      };
      const zoom: any = d3.zoom().on('zoom', handleZoom);
      d3.select('svg').call(zoom);

      simulation.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);

        label
          .attr('x', (d: any) => d.x + 25)
          .attr('y', (d: any) => d.y);
      });

      function drag(simulation: any) {
        function dragstarted(event: any, d: any) {
          if (!event.active) simulation.alphaTarget(0.3
          ).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(event: any, d: any) {
          d.fx = event.x;
          d.fy = event.y;
        }

        function dragended(event: any, d: any) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

        return d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended);
      }

      // Programmatically call the handleZoom method
      const initialTransform: any = d3.zoomIdentity;
      const fakeEvent = new Event("wheel"); // Create a fake wheel event to simulate zoom
      handleZoom(fakeEvent);
    }
  }

  //working
  toggleApiState(apiId: string) {
    const api = this.data.nodes.find((node: any) => node.id === apiId);
    api['down'] = !api['down'];
    // Recursively mark all dependent APIs as down as well
    const markDependents = (apiId: string, down: boolean) => {
      const dependents = this.data.links.filter((link: any) => link.target.id === apiId);
      //check for dependents
      if (dependents && dependents.length > 0) {
        dependents.forEach((link: any) => {
          const dependentApi = this.data.nodes.find((node: any) => node.id === link.source.id);
          dependentApi['down'] = down;
          markDependents(dependentApi.id, down);
        });
      };
    }

    markDependents(apiId, api['down']);
  }

  updateNodeColors() {
    d3.selectAll('circle')
      .style('fill', (d: any) => {
        if (d['halfDown'] && !d['down']) {
          return 'yellow';
        } else if (d['down']) {
          return 'red';
        } else {
          return "#69b3a2";
        }
      });
  }
}