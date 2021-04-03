function Pie() {
	this._data = null;
	this._sel = null;
	this._colorScale = null;
	this._padding = 15;
	this._size = 180;
	this._radius = () => {
		return this._size / 2 - this._padding;
	};

	this.data = function () {
		if (arguments.length > 0) {
			this._data = arguments[0];
			return this;
		}
		return this._data;
	};

	this.selection = function () {
		if (arguments.length > 0) {
			this._sel = arguments[0];
			return this;
		}
		return this._sel;
	};

	this.colorScale = function () {
		if (arguments.length > 0) {
			this._colorScale = arguments[0];
			return this;
		}
		return this._colorScale;
	};

	this.padding = function () {
		if (arguments.length > 0) {
			this._padding = arguments[0];
			return this;
		}
		return this._padding;
	};

	this.size = function () {
		if (arguments.length > 0) {
			this._size = arguments[0];
			return this;
		}
		return this._size;
	};

	this.draw = function () {
		// create a pie layout function
		let pie = d3
			.pie()
			.sort((d) => d.key)
			.value((d) => d.value);

		// create arc function
		let arc = d3.arc().innerRadius(0).outerRadius(this._radius);

		// calculate the layout
		let layout = pie(this._data.arr);

		// create the groups
		let g = this._sel.selectAll("g").data(layout).join("g");

		// add paths to those groups
		g.selectAll("path")
			.data((d) => [d])
			.join("path")
			.attr("d", arc)
			.attr("fill", (d) => this._colorScale(d.data.key));

		// you can add text labels if you want
		// g.selectAll('text')
		//     .data(d => [d])
		//     .join('text')
		//     .attr('transform', d => {
		//         let centroid = arc.centroid(d);
		//         return `translate(${centroid[0]}, ${centroid[1]})`;
		//     }) cf) geo.centroid
		//     .attr('text-anchor', 'middle')
		//     .text(d => d.data.key);

		// add the title
		this._sel
			.selectAll("text.title")
			.data([this._data.name])
			.join("text")
			.classed("title", true)
			.text((d) => d);
	};

	return this;
}
